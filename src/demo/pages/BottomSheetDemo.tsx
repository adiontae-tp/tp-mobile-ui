import { ComponentPage } from "@/demo/ComponentPage";
import { BottomSheetPreview } from "@/demo/previews/BottomSheetPreview";

const usage = `import {
  BottomSheet, BottomSheetTrigger,
  BottomSheetContent, BottomSheetHeader,
  BottomSheetTitle, BottomSheetDescription,
} from "@/components/ui/bottom-sheet"

const [open, setOpen] = useState(false)

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
</BottomSheet>`;

export function BottomSheetDemo() {
  return (
    <ComponentPage
      title="Bottom Sheet"
      description="Draggable bottom panel with spring animations. Built on Radix Dialog for accessibility and framer-motion for gesture support. Swipe down to dismiss."
      usage={usage}
    >
      <BottomSheetPreview />
    </ComponentPage>
  );
}
