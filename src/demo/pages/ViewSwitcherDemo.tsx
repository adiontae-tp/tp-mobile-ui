import { ComponentPage } from "@/demo/ComponentPage";
import { ViewSwitcherPreview } from "@/demo/previews/ViewSwitcherPreview";

const usage = `import { View, useViewport } from "@/components/ui/view-switcher"

// CSS-only — zero JS, no hydration flash
<View.Mobile>
  {/* Your mobile UI components */}
  <MobileNav />
</View.Mobile>

<View.Tablet>
  {/* Tablet-optimized layout */}
  <SidebarLayout />
</View.Tablet>

<View.Desktop>
  {/* shadcn or any desktop library */}
  <ShadcnDashboard />
</View.Desktop>

// Combo views
<View.MobileAndTablet>
  {/* Visible below 1024px */}
</View.MobileAndTablet>

<View.TabletAndDesktop>
  {/* Visible at 768px+ */}
</View.TabletAndDesktop>

// Hook for imperative logic
const viewport = useViewport() // "mobile" | "tablet" | "desktop"`;

export function ViewSwitcherDemo() {
  return (
    <ComponentPage
      title="View Switcher"
      description="Render different component trees per viewport — mobile, tablet, desktop. CSS-only display toggle with zero JS overhead. Use mobile-first components on small screens and shadcn on desktop."
      usage={usage}
    >
      <ViewSwitcherPreview />
    </ComponentPage>
  );
}
