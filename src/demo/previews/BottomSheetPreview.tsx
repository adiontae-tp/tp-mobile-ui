import { useState } from "react";
import {
  BottomSheet, BottomSheetTrigger, BottomSheetContent,
  BottomSheetHeader, BottomSheetTitle, BottomSheetDescription,
} from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

export function BottomSheetPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-sm text-muted-foreground">Drag the handle down to dismiss, or tap the overlay.</p>
      <BottomSheet open={open} onOpenChange={setOpen}>
        <BottomSheetTrigger asChild>
          <Button>Open Bottom Sheet</Button>
        </BottomSheetTrigger>
        <BottomSheetContent onClose={() => setOpen(false)}>
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
    </div>
  );
}
