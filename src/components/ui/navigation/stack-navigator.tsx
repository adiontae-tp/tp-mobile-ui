import * as React from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { cn } from "@/lib/utils";
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

/* ── StackNavigator.Screen (config-only, no render) ──────────────── */

function Screen(_props: StackScreenProps) {
  return null;
}
Screen.displayName = "StackNavigator.Screen";

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
        const { name, component } = child.props as StackScreenProps;
        map.set(name, { name, component });
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

  // iOS swipe-back gesture state
  const dragX = useMotionValue(0);
  const bgX = useTransform(dragX, (v) => {
    const w = getWidth();
    // Parallax: behind screen moves from -30% to 0% as drag progresses
    const progress = Math.max(0, v / w);
    return `${-30 + progress * 30}%`;
  });
  const isDragging = React.useRef(false);

  // Reset dragX after a pop so the next screen doesn't inherit the offset
  const prevRouteCount = React.useRef(state.routes.length);
  React.useEffect(() => {
    if (state.routes.length < prevRouteCount.current) {
      dragX.set(0);
    }
    prevRouteCount.current = state.routes.length;
  }, [state.routes.length, dragX]);

  const handleDragStart = React.useCallback(
    (e: PointerEvent | MouseEvent | TouchEvent) => {
      if (!isIOS || state.routes.length <= 1) {
        isDragging.current = false;
        return;
      }

      // Check if the gesture started inside the left-edge zone
      const rect = containerRef.current?.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const relX = rect ? clientX - rect.left : clientX;

      if (relX > EDGE_ZONE_WIDTH + 20) {
        isDragging.current = false;
        return;
      }
      isDragging.current = true;
    },
    [isIOS, state.routes.length]
  );

  const handleDrag = React.useCallback(
    (_: unknown, info: PanInfo) => {
      // If not a valid edge swipe, pin dragX to 0 so the screen doesn't move
      if (!isDragging.current) {
        dragX.set(0);
      }
    },
    [dragX]
  );

  const handleDragEnd = React.useCallback(
    (_: unknown, info: PanInfo) => {
      if (!isDragging.current) {
        dragX.set(0);
        return;
      }
      isDragging.current = false;

      const w = getWidth();
      const threshold = w * SWIPE_DISMISS_THRESHOLD;
      if (info.offset.x > threshold || info.velocity.x > 400) {
        dispatch({ type: "POP" });
      } else {
        // Snap back — dragX will animate to 0 via dragConstraints
      }
    },
    [dragX, getWidth]
  );

  const topRoute = state.routes[state.routes.length - 1];
  const belowRoute = state.routes.length > 1 ? state.routes[state.routes.length - 2] : null;
  const BelowComponent = belowRoute ? screens.get(belowRoute.name)?.component : null;

  return (
    <StackContext.Provider value={navigationValue}>
      <div ref={containerRef} className={cn("relative h-full w-full overflow-hidden", className)}>
        {/* Below screen (for iOS parallax during transitions and swipe-back) */}
        {isIOS && BelowComponent && belowRoute && (
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
            // iOS swipe-back drag
            {...(isIOS && state.routes.length > 1
              ? {
                  drag: "x" as const,
                  dragDirectionLock: true,
                  dragConstraints: { left: 0, right: 0 },
                  dragElastic: { left: 0, right: 1 },
                  dragMomentum: false,
                  onDragStart: handleDragStart,
                  onDrag: handleDrag,
                  onDragEnd: handleDragEnd,
                  style: { x: dragX, touchAction: "pan-y" },
                }
              : {})}
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
      </div>
    </StackContext.Provider>
  );
}

StackNavigator.Screen = Screen;
StackNavigator.displayName = "StackNavigator";

export { StackNavigator };
