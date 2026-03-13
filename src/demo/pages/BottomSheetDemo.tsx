import { ComponentPage } from "@/demo/ComponentPage";
import { BottomSheetPreview } from "@/demo/previews/BottomSheetPreview";

const usage = `import {
  BottomSheet, BottomSheetTrigger,
  BottomSheetContent, BottomSheetHeader,
  BottomSheetTitle, BottomSheetDescription,
  useBottomSheet,
} from "@/components/ui/bottom-sheet"

const [open, setOpen] = useState(false)

// Default detents (25%, 50%, 90%)
<BottomSheet open={open} onOpenChange={setOpen}>
  <BottomSheetTrigger asChild>
    <Button>Open Sheet</Button>
  </BottomSheetTrigger>
  <BottomSheetContent>
    <BottomSheetHeader>
      <BottomSheetTitle>Title</BottomSheetTitle>
      <BottomSheetDescription>
        Drag to snap between detents.
      </BottomSheetDescription>
    </BottomSheetHeader>
    <p>Sheet content here.</p>
  </BottomSheetContent>
</BottomSheet>

// Custom detents
<BottomSheet
  detents={["25%", "50%", "85%"]}
  defaultDetent={1}
  onDetentChange={(index) => console.log(index)}
>
  ...
</BottomSheet>

// Pixel + percentage detents
<BottomSheet detents={[120, "50%", "90%"]}>
  ...
</BottomSheet>

// Non-dismissible (always visible)
<BottomSheet detents={[96, "45%", "90%"]} dismissible={false}>
  ...
</BottomSheet>`;

export function BottomSheetDemo() {
  return (
    <ComponentPage
      title="Bottom Sheet"
      description="Native-feeling draggable bottom sheet with multiple detents (snap points). Built on react-modal-sheet for smooth drag physics and proper scroll handoff. Every sheet has detents by default — drag up and down to snap between them, swipe down to dismiss."
      usage={usage}
    >
      <BottomSheetPreview />
    </ComponentPage>
  );
}
