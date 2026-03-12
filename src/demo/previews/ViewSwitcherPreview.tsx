import { View, useViewport } from "@/components/ui/view-switcher";
import { Smartphone, Tablet, Monitor } from "lucide-react";

function ViewportBadge() {
  const viewport = useViewport();
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
      {viewport === "mobile" && <Smartphone className="h-3 w-3" />}
      {viewport === "tablet" && <Tablet className="h-3 w-3" />}
      {viewport === "desktop" && <Monitor className="h-3 w-3" />}
      {viewport}
    </span>
  );
}

export function ViewSwitcherPreview() {
  return (
    <div className="space-y-6 p-4">
      <div>
        <p className="text-lg font-semibold">View Switcher</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Resize the window to see different content appear. The hook-based badge
          below updates reactively.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Current viewport (hook)
        </p>
        <ViewportBadge />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          CSS-only view components
        </p>

        <View.Mobile>
          <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
            <Smartphone className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">Mobile View</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This content is only visible below 768px. Use your mobile-first
                components here.
              </p>
            </div>
          </div>
        </View.Mobile>

        <View.Tablet>
          <div className="flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-950">
            <Tablet className="h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="font-medium text-purple-900 dark:text-purple-100">Tablet View</p>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Visible between 768px and 1023px. Adapt your layout for
                medium screens.
              </p>
            </div>
          </div>
        </View.Tablet>

        <View.Desktop>
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
            <Monitor className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">Desktop View</p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Visible at 1024px and above. Use shadcn or any desktop-optimized
                library here.
              </p>
            </div>
          </div>
        </View.Desktop>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Combo views
        </p>

        <View.MobileAndTablet>
          <div className="rounded-lg border bg-muted/30 p-3 text-sm">
            <span className="font-medium">MobileAndTablet</span> — visible below 1024px
          </div>
        </View.MobileAndTablet>

        <View.TabletAndDesktop>
          <div className="rounded-lg border bg-muted/30 p-3 text-sm">
            <span className="font-medium">TabletAndDesktop</span> — visible at 768px and above
          </div>
        </View.TabletAndDesktop>
      </div>
    </div>
  );
}
