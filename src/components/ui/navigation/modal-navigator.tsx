import * as React from "react";
import {
  motion,
  AnimatePresence,
  type PanInfo,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { modalVariants, modalBackdropVariants, modalSpring } from "./transitions";
import { ModalContext, StackContext, RouteContext } from "./use-navigation";
import type {
  ModalNavigationContextValue,
  ModalScreenDefinition,
  RouteEntry,
  StackNavigationContextValue,
} from "./types";

/* ── Constants ───────────────────────────────────────────────────── */

const SWIPE_DISMISS_THRESHOLD = 0.3; // 30% of screen height

/* ── ModalNavigator.Screen (config-only) ─────────────────────────── */

interface ModalScreenProps {
  name: string;
  component: React.ComponentType<Record<string, never>>;
}

function Screen(_props: ModalScreenProps) {
  return null;
}
Screen.displayName = "ModalNavigator.Screen";

/* ── ModalNavigator ──────────────────────────────────────────────── */

interface ModalNavigatorProps {
  children: React.ReactNode;
  className?: string;
}

function makeKey(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function ModalNavigator({ children, className }: ModalNavigatorProps) {
  // Collect modal screen definitions from children
  const { screens, content } = React.useMemo(() => {
    const screenMap = new Map<string, ModalScreenDefinition>();
    const contentChildren: React.ReactNode[] = [];

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === Screen) {
        const { name, component } = child.props as ModalScreenProps;
        screenMap.set(name, { name, component });
      } else {
        contentChildren.push(child);
      }
    });

    return { screens: screenMap, content: contentChildren };
  }, [children]);

  // Modal stack (supports stacking modals on modals)
  const [modalStack, setModalStack] = React.useState<RouteEntry[]>([]);

  const presentModal = React.useCallback(
    (name: string, params?: Record<string, unknown>) => {
      setModalStack((prev) => [
        ...prev,
        { key: makeKey(), name, params },
      ]);
    },
    []
  );

  const dismissModal = React.useCallback(() => {
    setModalStack((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  const modalContextValue = React.useMemo<ModalNavigationContextValue>(
    () => ({ presentModal, dismissModal }),
    [presentModal, dismissModal]
  );

  // Provide a minimal StackContext for modal screens so useNavigation() doesn't throw
  const modalStackNav = React.useMemo<StackNavigationContextValue>(
    () => ({
      push: () => {},
      pop: dismissModal,
      goBack: dismissModal,
      canGoBack: () => modalStack.length > 0,
      replace: () => {},
      reset: () => {},
    }),
    [dismissModal, modalStack.length]
  );

  const handleDragEnd = React.useCallback(
    (_: unknown, info: PanInfo) => {
      const threshold = window.innerHeight * SWIPE_DISMISS_THRESHOLD;
      if (info.offset.y > threshold || info.velocity.y > 400) {
        dismissModal();
      }
    },
    [dismissModal]
  );

  const hasModals = modalStack.length > 0;

  return (
    <ModalContext.Provider value={modalContextValue}>
      <div className={cn("relative h-full w-full", className)}>
        {/* Main content behind modals — scales down when modal is presented.
            borderRadius is set statically on the wrapper to avoid paint;
            only scale (GPU-composited transform) is animated. */}
        <div
          className="h-full w-full overflow-hidden"
          style={{ borderRadius: hasModals ? "12px" : "0px" }}
        >
          <motion.div
            className="h-full w-full"
            animate={hasModals ? { scale: 0.94 } : { scale: 1 }}
            transition={modalSpring}
            style={{ transformOrigin: "top center" }}
          >
            {content}
          </motion.div>
        </div>

        {/* Modal overlay stack */}
        <AnimatePresence>
          {modalStack.map((modal, i) => {
            const screen = screens.get(modal.name);
            if (!screen) return null;
            const Component = screen.component;

            return (
              <React.Fragment key={modal.key}>
                {/* Backdrop */}
                <motion.div
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  variants={modalBackdropVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  onClick={dismissModal}
                  style={{ zIndex: 50 + i * 2 }}
                />

                {/* Modal card */}
                <motion.div
                  className="absolute inset-x-0 top-[6%] bottom-0 overflow-hidden rounded-t-xl bg-background"
                  variants={modalVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={modalSpring}
                  drag="y"
                  dragDirectionLock
                  dragConstraints={{ top: 0 }}
                  dragElastic={{ top: 0, bottom: 0.4 }}
                  dragMomentum={false}
                  onDragEnd={handleDragEnd}
                  style={{ zIndex: 51 + i * 2 }}
                >
                  {/* Drag handle */}
                  <div className="flex justify-center py-2">
                    <div className="h-1 w-8 rounded-full bg-muted-foreground/30" />
                  </div>

                  <StackContext.Provider value={modalStackNav}>
                    <RouteContext.Provider
                      value={{
                        name: modal.name,
                        key: modal.key,
                        params: modal.params ?? {},
                      }}
                    >
                      <Component />
                    </RouteContext.Provider>
                  </StackContext.Provider>
                </motion.div>
              </React.Fragment>
            );
          })}
        </AnimatePresence>
      </div>
    </ModalContext.Provider>
  );
}

ModalNavigator.Screen = Screen;
ModalNavigator.displayName = "ModalNavigator";

export { ModalNavigator };
