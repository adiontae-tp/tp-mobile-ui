import { useState, useRef } from "react";
import {
  BottomSheet, BottomSheetTrigger, BottomSheetContent,
  BottomSheetHeader, BottomSheetTitle, BottomSheetDescription,
} from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

export function BottomSheetPreview() {
  const [open, setOpen] = useState(false);
  const [snappable, setSnappable] = useState(false);
  const [nonModal, setNonModal] = useState(false);
  const [snapIndex, setSnapIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative flex flex-col gap-4 p-4" style={{ minHeight: 480 }}>
      <p className="text-sm text-muted-foreground">
        Drag the handle down to dismiss, or tap the overlay.
      </p>

      <BottomSheet open={open} onOpenChange={setOpen} modal={false}>
        <BottomSheetTrigger asChild>
          <Button>Open Bottom Sheet</Button>
        </BottomSheetTrigger>
        <BottomSheetContent onClose={() => setOpen(false)} container={containerRef.current}>
          <BottomSheetHeader>
            <BottomSheetTitle>Sheet Title</BottomSheetTitle>
            <BottomSheetDescription>
              This is a draggable bottom sheet with spring physics.
            </BottomSheetDescription>
          </BottomSheetHeader>
          <div className="flex flex-col gap-3 py-4">
            <p className="text-sm">
              Bottom sheets are a common mobile pattern for contextual content
              without leaving the current screen.
            </p>
            <Button onClick={() => setOpen(false)}>Done</Button>
          </div>
        </BottomSheetContent>
      </BottomSheet>

      <BottomSheet open={snappable} onOpenChange={setSnappable} modal={false}>
        <BottomSheetTrigger asChild>
          <Button variant="secondary">With Snap Points</Button>
        </BottomSheetTrigger>
        <BottomSheetContent
          onClose={() => setSnappable(false)}
          container={containerRef.current}
          snapPoints={[0.25, 0.5, 0.85]}
          defaultSnapPoint={1}
          onSnapPointChange={setSnapIndex}
        >
          <BottomSheetHeader>
            <BottomSheetTitle>Snap Points</BottomSheetTitle>
            <BottomSheetDescription>
              Snapped to: {["25%", "50%", "85%"][snapIndex]} of viewport
            </BottomSheetDescription>
          </BottomSheetHeader>
          <div className="flex flex-col gap-3 py-4">
            <p className="text-sm">
              Drag up and down to snap between 25%, 50%, and 85% of the
              viewport height — just like iOS sheet detents.
            </p>
            <p className="text-sm text-muted-foreground">
              A fast swipe down will dismiss. A slow drag settles to the
              nearest snap point, with velocity bias toward the direction
              you're dragging.
            </p>
            <Button onClick={() => setSnappable(false)}>Done</Button>
          </div>
        </BottomSheetContent>
      </BottomSheet>

      <BottomSheet open={nonModal} onOpenChange={setNonModal} modal={false}>
        <BottomSheetTrigger asChild>
          <Button variant="outline">Non-modal (interact behind)</Button>
        </BottomSheetTrigger>
        <BottomSheetContent
          onClose={() => setNonModal(false)}
          container={containerRef.current}
        >
          <BottomSheetHeader>
            <BottomSheetTitle>Non-modal Sheet</BottomSheetTitle>
            <BottomSheetDescription>
              No overlay — you can still interact with the content behind.
            </BottomSheetDescription>
          </BottomSheetHeader>
          <div className="flex flex-col gap-3 py-4">
            <p className="text-sm">
              Set <code className="rounded bg-muted px-1 text-xs">modal=false</code> to
              skip the dimmed overlay and allow passthrough interaction.
            </p>
            <Button onClick={() => setNonModal(false)}>Done</Button>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </div>
  );
}
