import { ComponentPage } from "@/demo/ComponentPage";
import { BottomSheetPreview } from "@/demo/previews/BottomSheetPreview";

const usage = `import {
  BottomSheet, BottomSheetTrigger,
  BottomSheetContent, BottomSheetHeader,
  BottomSheetTitle, BottomSheetDescription,
  useBottomSheet,
} from "@/components/ui/bottom-sheet"

const [open, setOpen] = useState(false)

// Basic usage
<BottomSheet open={open} onOpenChange={setOpen}>
  <BottomSheetTrigger asChild>
    <Button>Open Sheet</Button>
  </BottomSheetTrigger>
  <BottomSheetContent>
    <BottomSheetHeader>
      <BottomSheetTitle>Title</BottomSheetTitle>
      <BottomSheetDescription>
        Drag down or tap outside to dismiss.
      </BottomSheetDescription>
    </BottomSheetHeader>
    <p>Sheet content here.</p>
  </BottomSheetContent>
</BottomSheet>

// With detents (iOS-style snap points)
<BottomSheet
  open={open}
  onOpenChange={setOpen}
  detents={["25%", "50%", "85%"]}
  defaultDetent={1}
  onDetentChange={(index) => console.log(index)}
>
  <BottomSheetContent>...</BottomSheetContent>
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
      description="Native-feeling draggable bottom sheet with spring physics, multiple detents, and proper drag-scroll handoff. Supports pixel, percentage, and content-based snap points. No Radix Dialog dependency — built for persistent, non-modal use cases alongside traditional modal sheets."
      usage={usage}
    >
      <BottomSheetPreview />
    </ComponentPage>
  );
}
