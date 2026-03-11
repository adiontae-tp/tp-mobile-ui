import { ComponentPage } from "@/demo/ComponentPage";
import { BottomSheetPreview } from "@/demo/previews/BottomSheetPreview";

const usage = `import {
  BottomSheet, BottomSheetTrigger,
  BottomSheetContent, BottomSheetHeader,
  BottomSheetTitle, BottomSheetDescription,
} from "@/components/ui/bottom-sheet"

const [open, setOpen] = useState(false)

// Basic usage
<BottomSheet open={open} onOpenChange={setOpen}>
  <BottomSheetTrigger asChild>
    <Button>Open Sheet</Button>
  </BottomSheetTrigger>
  <BottomSheetContent onClose={() => setOpen(false)}>
    <BottomSheetHeader>
      <BottomSheetTitle>Title</BottomSheetTitle>
      <BottomSheetDescription>
        Drag down or tap outside to dismiss.
      </BottomSheetDescription>
    </BottomSheetHeader>
    <p>Sheet content here.</p>
  </BottomSheetContent>
</BottomSheet>

// With snap points (iOS-style detents)
<BottomSheetContent
  onClose={() => setOpen(false)}
  snapPoints={[0.25, 0.5, 0.85]}
  defaultSnapPoint={1}
  onSnapPointChange={(index) => console.log(index)}
>
  ...
</BottomSheetContent>`;

export function BottomSheetDemo() {
  return (
    <ComponentPage
      title="Bottom Sheet"
      description="Draggable bottom panel with spring animations and snap points. Built on Radix Dialog for accessibility and framer-motion for gesture support. Supports iOS-style detents — define snap points as viewport fractions (e.g. 25%, 50%, 85%)."
      usage={usage}
    >
      <BottomSheetPreview />
    </ComponentPage>
  );
}
