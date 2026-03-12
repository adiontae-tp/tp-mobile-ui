import * as React from "react";
import {
  BottomTabs,
  BottomTabsBar,
  BottomTabsTab,
} from "@/components/ui/bottom-tabs";
import { cn } from "@/lib/utils";
import { TabContext } from "./use-navigation";
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
}

function TabNavigator({ initialTab, children, className }: TabNavigatorProps) {
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const lastTapRef = React.useRef<{ tab: string; time: number }>({ tab: "", time: 0 });

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

  // Double-tap detection for popping to root
  const handleTabPress = React.useCallback(
    (tabName: string) => {
      const now = Date.now();
      const last = lastTapRef.current;

      if (last.tab === tabName && now - last.time < 300) {
        // Double-tap on active tab: dispatch popToRoot event
        window.dispatchEvent(
          new CustomEvent("navigation:popToRoot", { detail: { tab: tabName } })
        );
        lastTapRef.current = { tab: "", time: 0 };
      } else {
        lastTapRef.current = { tab: tabName, time: now };
      }

      setActiveTab(tabName);
    },
    []
  );

  const tabContextValue = React.useMemo<TabNavigationContextValue>(
    () => ({
      switchTab: setActiveTab,
      activeTab,
    }),
    [activeTab]
  );

  return (
    <TabContext.Provider value={tabContextValue}>
      <BottomTabs
        value={activeTab}
        onValueChange={handleTabPress}
        className={cn("relative h-full", className)}
      >
        {/* Tab content — all tabs stay mounted, hidden via display:none */}
        <div className="relative flex-1 overflow-hidden">
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className="absolute inset-0"
              style={{ display: activeTab === tab.name ? "block" : "none" }}
            >
              {tab.children}
            </div>
          ))}
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
      </BottomTabs>
    </TabContext.Provider>
  );
}

TabNavigator.Tab = Tab;
TabNavigator.displayName = "TabNavigator";

export { TabNavigator };
