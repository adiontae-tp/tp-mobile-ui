import { ComponentPage } from "@/demo/ComponentPage";
import { BottomTabsPreview } from "@/demo/previews/BottomTabsPreview";

const usage = `import {
  BottomTabs, BottomTabsBar,
  BottomTabsContent, BottomTabsTab,
} from "@/components/ui/bottom-tabs"
import { Home, Search, Bell, User } from "lucide-react"

const [tab, setTab] = useState("home")

<BottomTabs value={tab} onValueChange={setTab}>
  <BottomTabsContent value="home">
    <p>Home screen</p>
  </BottomTabsContent>

  <BottomTabsContent value="search">
    <p>Search screen</p>
  </BottomTabsContent>

  <BottomTabsBar>
    <BottomTabsTab value="home" icon={<Home />} label="Home" />
    <BottomTabsTab value="search" icon={<Search />} label="Search" />
    <BottomTabsTab
      value="alerts"
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
</BottomTabs>`;

export function BottomTabsDemo() {
  return (
    <ComponentPage
      title="Bottom Tabs"
      description="Native-style bottom tab bar with animated active indicator, icon + label layout, and notification badges. Fixed to the bottom of the viewport with safe area support."
      usage={usage}
    >
      <BottomTabsPreview />
    </ComponentPage>
  );
}
