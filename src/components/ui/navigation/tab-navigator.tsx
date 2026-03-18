import * as React from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  BottomTabs,
  BottomTabsBar,
  BottomTabsTab,
} from "@/components/ui/bottom-tabs";
import { cn } from "@/lib/utils";
import { TabContext } from "./use-navigation";
import {
  tabCrossfadeVariants,
  tabSlideVariants,
  tabTransitionSpring,
  type TabAnimation,
} from "./transitions";
import type { TabDefinition, TabNavigationContextValue } from "./types";

/* ── TabNavigator.Tab (config-only) ──────────────────────────────── */

interface TabProps {
  name: string;
  icon: React.ReactNode;
  label: string;
  badge?: boolean | number | string;
  children: React.ReactNode;
}

function Tab(_props: TabProps) {
  return null;
}
Tab.displayName = "TabNavigator.Tab";

/* ── TabNavigator ────────────────────────────────────────────────── */

interface TabNavigatorProps {
  initialTab: string;
  children: React.ReactNode;
  className?: string;
  /** Tab content transition animation. @default "none" */
  animation?: TabAnimation;
}

function TabNavigator({ initialTab, children, className, animation = "none" }: TabNavigatorProps) {
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const lastTapRef = React.useRef<{ tab: string; time: number }>({ tab: "", time: 0 });
  const prevTabIndexRef = React.useRef(0);

  // Collect tab definitions from children
  const tabs = React.useMemo(() => {
    const list: TabDefinition[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === Tab) {
        const { name, icon, label, badge, children: tabChildren } = child.props as TabProps;
        list.push({ name, icon, label, badge, children: tabChildren });
      }
    });
    return list;
  }, [children]);

  // Compute slide direction based on tab index
  const activeIndex = tabs.findIndex((t) => t.name === activeTab);
  const direction = activeIndex >= prevTabIndexRef.current ? 1 : -1;

  // Double-tap detection for popping to root
  const handleTabPress = React.useCallback(
    (tabName: string) => {
      const now = Date.now();
      const last = lastTapRef.current;

      if (last.tab === tabName && now - last.time < 300) {
        window.dispatchEvent(
          new CustomEvent("navigation:popToRoot", { detail: { tab: tabName } })
        );
        lastTapRef.current = { tab: "", time: 0 };
      } else {
        lastTapRef.current = { tab: tabName, time: now };
      }

      // Track previous index for direction before switching
      prevTabIndexRef.current = tabs.findIndex((t) => t.name === activeTab);

      setActiveTab(tabName);
    },
    [tabs, activeTab]
  );

  const tabContextValue = React.useMemo<TabNavigationContextValue>(
    () => ({
      switchTab: setActiveTab,
      activeTab,
    }),
    [activeTab]
  );

  const isAnimated = animation !== "none";
  const variants = animation === "slide" ? tabSlideVariants : tabCrossfadeVariants;

  return (
    <TabContext.Provider value={tabContextValue}>
      <BottomTabs
        value={activeTab}
        onValueChange={handleTabPress}
        className={cn("h-full", className)}
      >
        <div className="flex h-full flex-col">
          {/* Tab content */}
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {isAnimated ? (
              <AnimatePresence initial={false} custom={direction} mode="sync">
                {tabs.map((tab) =>
                  activeTab === tab.name ? (
                    <motion.div
                      key={tab.name}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={tabTransitionSpring}
                      className="absolute inset-0"
                    >
                      {tab.children}
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>
            ) : (
              /* Static: all tabs stay mounted, hidden via display:none */
              tabs.map((tab) => (
                <div
                  key={tab.name}
                  className="absolute inset-0"
                  style={{ display: activeTab === tab.name ? "block" : "none" }}
                >
                  {tab.children}
                </div>
              ))
            )}
          </div>

          <BottomTabsBar>
            {tabs.map((tab) => (
              <BottomTabsTab
                key={tab.name}
                value={tab.name}
                icon={tab.icon}
                label={tab.label}
                badge={tab.badge}
              />
            ))}
          </BottomTabsBar>
        </div>
      </BottomTabs>
    </TabContext.Provider>
  );
}

TabNavigator.Tab = Tab;
TabNavigator.displayName = "TabNavigator";

export { TabNavigator };
