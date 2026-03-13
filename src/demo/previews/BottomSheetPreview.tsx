import { useState, useRef } from "react";
import {
  BottomSheet, BottomSheetTrigger, BottomSheetContent,
  BottomSheetHeader, BottomSheetTitle, BottomSheetDescription,
} from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

export function BottomSheetPreview() {
  const [open, setOpen] = useState(false);
  const [snapIndex, setSnapIndex] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative flex flex-col gap-4 p-4" style={{ minHeight: 480 }}>
      <p className="text-sm text-muted-foreground">
        Drag up and down to snap between detents. Swipe down to dismiss.
      </p>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        detents={["25%", "50%", "85%"]}
        defaultDetent={1}
        onDetentChange={setSnapIndex}
      >
        <BottomSheetTrigger asChild>
          <Button>Open Bottom Sheet</Button>
        </BottomSheetTrigger>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetTitle>Bottom Sheet</BottomSheetTitle>
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
              nearest detent, with velocity bias toward the direction
              you're dragging.
            </p>
            <Button onClick={() => setOpen(false)}>Done</Button>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </div>
  );
}
