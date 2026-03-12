import * as React from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { detectPlatform } from "./platform";
import { getStackVariants, getStackSpring, iosShadowVariants } from "./transitions";
import {
  stackReducer,
  createInitialStackState,
  StackContext,
  RouteContext,
} from "./use-navigation";
import type {
  StackScreenProps,
  ScreenDefinition,
  StackNavigationContextValue,
} from "./types";

/* ── Constants ───────────────────────────────────────────────────── */

const EDGE_ZONE_WIDTH = 20;
const SWIPE_DISMISS_THRESHOLD = 0.35;

/* ── Title animation variants ────────────────────────────────────── */

const titleVariants = {
  enter: (direction: "forward" | "back") => ({
    x: direction === "forward" ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: "forward" | "back") => ({
    x: direction === "forward" ? -60 : 60,
    opacity: 0,
  }),
};

const backVariants = {
  enter: { x: -20, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
};

const titleSpring = {
  type: "spring" as const,
  damping: 28,
  stiffness: 260,
  mass: 0.8,
};

/* ── StackNavigator.Screen (config-only, no render) ──────────────── */

function Screen(_props: StackScreenProps) {
  return null;
}
Screen.displayName = "StackNavigator.Screen";

/* ── StackHeader ─────────────────────────────────────────────────── */

interface StackHeaderProps {
  title: string;
  routeKey: string;
  direction: "forward" | "back";
  canGoBack: boolean;
  previousTitle: string;
  onBack: () => void;
  headerRight?: React.ReactNode;
}

function StackHeader({
  title,
  routeKey,
  direction,
  canGoBack,
  previousTitle,
  onBack,
  headerRight,
}: StackHeaderProps) {
  return (
    <header
      className="relative z-50 border-b bg-background/80 backdrop-blur-lg"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex h-11 items-center justify-between px-4">
        {/* Left: back button */}
        <div className="flex min-w-[2.75rem] items-center">
          <AnimatePresence mode="wait">
            {canGoBack && (
              <motion.button
                key="back"
                variants={backVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={titleSpring}
                onClick={onBack}
                className="flex items-center gap-0.5 text-primary"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm">{previousTitle || "Back"}</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Center: animated title */}
        <div className="flex-1 overflow-hidden text-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.span
              key={routeKey}
              custom={direction}
              variants={titleVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={titleSpring}
              className="block truncate text-base font-semibold"
            >
              {title}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Right: optional actions */}
        <div className="flex min-w-[2.75rem] items-center justify-end">
          {headerRight}
        </div>
      </div>
    </header>
  );
}

/* ── StackNavigator ──────────────────────────────────────────────── */

interface StackNavigatorProps {
  initialRoute: string;
  children: React.ReactNode;
  className?: string;
}

function StackNavigator({ initialRoute, children, className }: StackNavigatorProps) {
  const platform = React.useMemo(() => detectPlatform(), []);
  const variants = React.useMemo(() => getStackVariants(platform), [platform]);
  const spring = React.useMemo(() => getStackSpring(platform), [platform]);
  const isIOS = platform !== "android";

  // Collect screen definitions from children
  const screens = React.useMemo(() => {
    const map = new Map<string, ScreenDefinition>();
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === Screen) {
        const { name, component, title, headerRight, headerShown } = child.props as StackScreenProps;
        map.set(name, { name, component, title, headerRight, headerShown });
      }
    });
    return map;
  }, [children]);

  const [state, dispatch] = React.useReducer(
    stackReducer,
    initialRoute,
    createInitialStackState
  );

  const navigationValue = React.useMemo<StackNavigationContextValue>(
    () => ({
      push: (name, params) => dispatch({ type: "PUSH", name, params }),
      pop: () => dispatch({ type: "POP" }),
      goBack: () => dispatch({ type: "POP" }),
      canGoBack: () => state.routes.length > 1,
      replace: (name, params) => dispatch({ type: "REPLACE", name, params }),
      reset: (name, params) => dispatch({ type: "RESET", name, params }),
    }),
    [state.routes.length]
  );

  // Container ref for width measurement (avoids stale window.innerWidth)
  const containerRef = React.useRef<HTMLDivElement>(null);
  const getWidth = React.useCallback(
    () => containerRef.current?.offsetWidth ?? window.innerWidth,
    []
  );

  // iOS swipe-back gesture state.
  // The parallax layer is only rendered during active swipe to prevent
  // the below-screen from bleeding through after push/pop transitions.
  const swipeProgress = useMotionValue(0);
  const bgX = useTransform(swipeProgress, [0, 1], ["-30%", "0%"]);
  const isDragging = React.useRef(false);
  const [showParallax, setShowParallax] = React.useState(false);

  // Pointer-based swipe-back: track the gesture manually so that
  // we never bind a MotionValue to style.x on the AnimatePresence
  // screen (which would override its variant-based animations).
  const pointerStart = React.useRef<{ x: number; y: number; id: number } | null>(null);
  const swipeX = useMotionValue(0);

  const handleEdgePointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (!isIOS || state.routes.length <= 1) return;
      const rect = containerRef.current?.getBoundingClientRect();
      const relX = rect ? e.clientX - rect.left : e.clientX;
      if (relX > EDGE_ZONE_WIDTH + 20) return;
      pointerStart.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
      isDragging.current = false; // not confirmed yet — wait for direction lock
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isIOS, state.routes.length]
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (!pointerStart.current || pointerStart.current.id !== e.pointerId) return;
      const dx = e.clientX - pointerStart.current.x;
      const dy = e.clientY - pointerStart.current.y;

      // Direction lock: first significant movement decides axis
      if (!isDragging.current) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 8) return; // too small to decide
        if (Math.abs(dy) > Math.abs(dx)) {
          // Vertical — cancel swipe, let scroll happen
          pointerStart.current = null;
          return;
        }
        isDragging.current = true;
        setShowParallax(true);
      }

      const offset = Math.max(0, dx);
      swipeX.set(offset);
      const w = getWidth();
      swipeProgress.set(Math.max(0, offset / w));
    },
    [getWidth, swipeProgress, swipeX]
  );

  const handlePointerUp = React.useCallback(
    (e: React.PointerEvent) => {
      if (!pointerStart.current || pointerStart.current.id !== e.pointerId) return;
      const wasActive = isDragging.current;
      const dx = e.clientX - pointerStart.current.x;
      pointerStart.current = null;
      isDragging.current = false;

      if (!wasActive) {
        setShowParallax(false);
        return;
      }

      const w = getWidth();
      if (dx > w * SWIPE_DISMISS_THRESHOLD) {
        animate(swipeProgress, 1, spring);
        animate(swipeX, w, spring).then(() => {
          setShowParallax(false);
          swipeX.jump(0);
          swipeProgress.jump(0);
        });
        dispatch({ type: "POP" });
      } else {
        animate(swipeX, 0, spring);
        animate(swipeProgress, 0, spring).then(() => setShowParallax(false));
      }
    },
    [getWidth, swipeProgress, swipeX, spring]
  );

  const handlePointerCancel = React.useCallback(
    (e: React.PointerEvent) => {
      if (!pointerStart.current || pointerStart.current.id !== e.pointerId) return;
      pointerStart.current = null;
      isDragging.current = false;
      animate(swipeX, 0, spring);
      animate(swipeProgress, 0, spring).then(() => setShowParallax(false));
    },
    [swipeProgress, swipeX, spring]
  );

  const topRoute = state.routes[state.routes.length - 1];
  const belowRoute = state.routes.length > 1 ? state.routes[state.routes.length - 2] : null;
  const BelowComponent = belowRoute ? screens.get(belowRoute.name)?.component : null;

  // Resolve header title from screen definition
  const resolveTitle = React.useCallback(
    (routeName: string, params?: Record<string, unknown>): string => {
      const screen = screens.get(routeName);
      if (!screen?.title) return routeName;
      if (typeof screen.title === "function") return screen.title(params ?? {});
      return screen.title;
    },
    [screens]
  );

  const currentScreen = screens.get(topRoute.name);
  const headerShown = currentScreen?.headerShown !== false && currentScreen?.title !== undefined;
  const currentTitle = resolveTitle(topRoute.name, topRoute.params);
  const previousTitle = belowRoute ? resolveTitle(belowRoute.name, belowRoute.params) : "";

  return (
    <StackContext.Provider value={navigationValue}>
      <div ref={containerRef} className={cn("relative flex h-full w-full flex-col overflow-hidden", className)}>
        {/* Persistent header with animated title crossfade */}
        {headerShown && (
          <StackHeader
            title={currentTitle}
            routeKey={topRoute.key}
            direction={state.direction}
            canGoBack={state.routes.length > 1}
            previousTitle={previousTitle}
            onBack={() => dispatch({ type: "POP" })}
            headerRight={currentScreen?.headerRight}
          />
        )}

        {/* Screen area */}
        <div
          className="relative flex-1 overflow-hidden"
          onPointerDown={handleEdgePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          style={{ touchAction: isIOS ? "pan-y" : undefined }}
        >
          {/* Below screen (iOS parallax) — only rendered during active swipe
              so it can never bleed through after push/pop transitions. */}
          {isIOS && showParallax && BelowComponent && belowRoute && (
            <motion.div
              className="absolute inset-0"
              style={{ x: bgX }}
            >
              <RouteContext.Provider
                value={{
                  name: belowRoute.name,
                  key: belowRoute.key,
                  params: belowRoute.params ?? {},
                }}
              >
                <BelowComponent />
              </RouteContext.Provider>
            </motion.div>
          )}

          <AnimatePresence initial={false} custom={state.direction} mode="sync">
            <motion.div
              key={topRoute.key}
              custom={state.direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={spring}
              className="absolute inset-0 bg-background"
            >
              {/* iOS edge shadow — GPU-composited via opacity only */}
              {isIOS && (
                <motion.div
                  className="pointer-events-none absolute inset-y-0 -left-6 w-6"
                  style={{ boxShadow: "4px 0 16px rgba(0,0,0,0.15)" }}
                  custom={state.direction}
                  variants={iosShadowVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={spring}
                />
              )}

              <RouteContext.Provider
                value={{
                  name: topRoute.name,
                  key: topRoute.key,
                  params: topRoute.params ?? {},
                }}
              >
                {(() => {
                  const screen = screens.get(topRoute.name);
                  if (!screen) {
                    return (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        Screen &ldquo;{topRoute.name}&rdquo; not found
                      </div>
                    );
                  }
                  const Component = screen.component;
                  return <Component />;
                })()}
              </RouteContext.Provider>
            </motion.div>
          </AnimatePresence>

          {/* Swipe-back overlay: sits on top of AnimatePresence and
              shifts the visible screen during an active gesture. This is
              a separate layer so it NEVER interferes with variant
              enter/exit animations. */}
          {showParallax && (
            <motion.div
              className="absolute inset-0 bg-background"
              style={{ x: swipeX }}
            >
              <RouteContext.Provider
                value={{
                  name: topRoute.name,
                  key: topRoute.key,
                  params: topRoute.params ?? {},
                }}
              >
                {(() => {
                  const screen = screens.get(topRoute.name);
                  if (!screen) return null;
                  const Component = screen.component;
                  return <Component />;
                })()}
              </RouteContext.Provider>
            </motion.div>
          )}
        </div>
      </div>
    </StackContext.Provider>
  );
}

StackNavigator.Screen = Screen;
StackNavigator.displayName = "StackNavigator";

export { StackNavigator };
