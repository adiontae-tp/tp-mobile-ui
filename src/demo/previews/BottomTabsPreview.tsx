import { useState } from "react";
import {
  BottomTabs,
  BottomTabsBar,
  BottomTabsContent,
  BottomTabsTab,
} from "@/components/ui/bottom-tabs";
import { Page, PageContent, PageFooter, ScrollView } from "@/components/ui/page";
import { Home, Search, Bell, User } from "lucide-react";

export function BottomTabsPreview() {
  const [tab, setTab] = useState("home");

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
          <BottomTabsBar>
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
