import { useState } from "react";
import {
  BottomTabs,
  BottomTabsBar,
  BottomTabsContent,
  BottomTabsTab,
} from "@/components/ui/bottom-tabs";
import { Page, PageContent, PageFooter, ScrollView } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { Home, Search, Bell, User } from "lucide-react";

const fillColors = [
  { label: "None", value: undefined },
  { label: "Indigo", value: "#4f46e5" },
  { label: "Emerald", value: "#059669" },
  { label: "Rose", value: "#e11d48" },
  { label: "Slate", value: "#1e293b" },
];

export function BottomTabsPreview() {
  const [tab, setTab] = useState("home");
  const [fillIndex, setFillIndex] = useState(0);
  const fill = fillColors[fillIndex].value;

  return (
    <BottomTabs value={tab} onValueChange={setTab}>
      <Page>
        <PageContent>
          <ScrollView>
            <BottomTabsContent value="home" className="p-4">
              <p className="text-lg font-semibold">Home</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This is the home tab. Tap the icons below to switch tabs. The active
                indicator animates between tabs with spring physics.
              </p>
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">Bar Fill Color</p>
                <div className="flex flex-wrap gap-2">
                  {fillColors.map((c, i) => (
                    <Button
                      key={c.label}
                      size="sm"
                      variant={fillIndex === i ? "default" : "outline"}
                      onClick={() => setFillIndex(i)}
                    >
                      {c.label}
                    </Button>
                  ))}
                </div>
              </div>
            </BottomTabsContent>

            <BottomTabsContent value="search" className="p-4">
              <p className="text-lg font-semibold">Search</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The search tab. Notice the smooth layout animation on the active
                indicator pill.
              </p>
            </BottomTabsContent>

            <BottomTabsContent value="notifications" className="p-4">
              <p className="text-lg font-semibold">Notifications</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Notifications tab with a badge count. Badges can be a dot (boolean)
                or a number.
              </p>
            </BottomTabsContent>

            <BottomTabsContent value="profile" className="p-4">
              <p className="text-lg font-semibold">Profile</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The profile tab with a dot badge indicator.
              </p>
            </BottomTabsContent>
          </ScrollView>
        </PageContent>

        <PageFooter>
          <BottomTabsBar fill={fill} className={fill ? "text-white border-white/20" : ""}>
            <BottomTabsTab value="home" icon={<Home />} label="Home" />
            <BottomTabsTab value="search" icon={<Search />} label="Search" />
            <BottomTabsTab
              value="notifications"
              icon={<Bell />}
              label="Alerts"
              badge={3}
            />
            <BottomTabsTab
              value="profile"
              icon={<User />}
              label="Profile"
              badge={true}
            />
          </BottomTabsBar>
        </PageFooter>
      </Page>
    </BottomTabs>
  );
}
