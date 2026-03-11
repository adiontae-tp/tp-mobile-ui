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
import { getStackVariants, getStackSpring } from "./transitions";
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
const SWIPE_DISMISS_THRESHOLD = 0.35; // 35% of screen width

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

  // iOS swipe-back gesture state
  const dragX = useMotionValue(0);
  const bgX = useTransform(dragX, [0, window.innerWidth], ["0%", "-30%"]);
  const isDragging = React.useRef(false);

  const handleDragStart = React.useCallback(
    (_: unknown, info: PanInfo) => {
      // Only allow swipe-back from left edge zone, only on iOS, only if can go back
      if (!isIOS || state.routes.length <= 1) return;
      if ((info as unknown as { point: { x: number } }).point?.x > EDGE_ZONE_WIDTH + 40) {
        isDragging.current = false;
        return;
      }
      isDragging.current = true;
    },
    [isIOS, state.routes.length]
  );

  const handleDragEnd = React.useCallback(
    (_: unknown, info: PanInfo) => {
      if (!isDragging.current) return;
      isDragging.current = false;

      const threshold = window.innerWidth * SWIPE_DISMISS_THRESHOLD;
      if (info.offset.x > threshold || info.velocity.x > 400) {
        dispatch({ type: "POP" });
      }
    },
    []
  );

  const topRoute = state.routes[state.routes.length - 1];
  const belowRoute = state.routes.length > 1 ? state.routes[state.routes.length - 2] : null;
  const BelowComponent = belowRoute ? screens.get(belowRoute.name)?.component : null;

  return (
    <StackContext.Provider value={navigationValue}>
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
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

        <AnimatePresence initial={false} custom={state.direction} mode="popLayout">
          <motion.div
            key={topRoute.key}
            custom={state.direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
            className={cn(
              "absolute inset-0 bg-background",
              isIOS && state.routes.length > 1 && "touch-pan-y"
            )}
            // iOS swipe-back drag
            {...(isIOS && state.routes.length > 1
              ? {
                  drag: "x" as const,
                  dragDirectionLock: true,
                  dragConstraints: { left: 0, right: window.innerWidth },
                  dragElastic: 0,
                  dragMomentum: false,
                  onDragStart: handleDragStart,
                  onDragEnd: handleDragEnd,
                  style: { x: dragX },
                }
              : {})}
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
                if (!screen) {
                  return (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      Screen "{topRoute.name}" not found
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
