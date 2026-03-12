import { ComponentPage } from "@/demo/ComponentPage";
import { ToolbarSheetPreview } from "@/demo/previews/ToolbarSheetPreview";

const usage = `import {
  ToolbarSheet, ToolbarSheetBar, ToolbarSheetAction,
  ToolbarSheetInfo, ToolbarSheetSeparator, ToolbarSheetContent,
  useToolbarSheet, type SnapPoint,
} from "@/components/ui/toolbar-sheet"
import { X, Volume2, Map } from "lucide-react"

// Apple Maps-style directions toolbar
<ToolbarSheet
  defaultSnap="peek"
  onSnapChange={(snap) => console.log(snap)}
>
  {/* Always-visible toolbar */}
  <ToolbarSheetBar>
    <ToolbarSheetAction variant="destructive" icon={<X />} label="End" />
    <div className="flex-1" />
    <ToolbarSheetAction variant="muted" icon={<Volume2 />} />
    <ToolbarSheetAction variant="muted" icon={<Map />} label="Overview" />
  </ToolbarSheetBar>

  {/* Subtitle row */}
  <ToolbarSheetInfo>
    <span className="font-semibold text-foreground">14 min</span>
    <span>·</span><span>6.2 mi</span>
    <span>·</span><span>Fastest Route</span>
  </ToolbarSheetInfo>

  <ToolbarSheetSeparator />

  {/* Scrollable content visible when expanded */}
  <ToolbarSheetContent>
    {/* Turn-by-turn directions, details, etc. */}
  </ToolbarSheetContent>
</ToolbarSheet>

// Programmatic control via hook
function SheetChild() {
  const { snap, snapTo } = useToolbarSheet()
  return <button onClick={() => snapTo("full")}>Expand</button>
}`;

export function ToolbarSheetDemo() {
  return (
    <ComponentPage
      title="Toolbar Sheet"
      description="Apple Maps-style non-modal bottom sheet with a persistent toolbar. Always visible at the bottom in a collapsed state, draggable through peek/half/full snap points. Content behind stays interactive — no overlay."
      usage={usage}
      props={[
        { name: "peekHeight", type: "number", default: "96", description: "Height in px of the collapsed toolbar state." },
        { name: "halfDetent", type: "number", default: "0.45", description: "Half-expanded height as a fraction of viewport (0–1)." },
        { name: "fullDetent", type: "number", default: "0.92", description: "Fully expanded height as a fraction of viewport (0–1)." },
        { name: "defaultSnap", type: '"peek" | "half" | "full"', default: '"peek"', description: "Initial snap point." },
        { name: "snap", type: '"peek" | "half" | "full"', description: "Controlled snap point." },
        { name: "onSnapChange", type: "(snap: SnapPoint) => void", description: "Called when the sheet settles on a snap point." },
      ]}
    >
      <ToolbarSheetPreview />
    </ComponentPage>
  );
}
