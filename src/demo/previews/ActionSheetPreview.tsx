import { useState, useRef } from "react";
import { ActionSheet } from "@/components/ui/action-sheet";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Copy, Edit, Share2, Trash2 } from "lucide-react";

export function ActionSheetPreview() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative flex flex-col gap-4 p-4" style={{ minHeight: 480 }}>
      <p className="text-sm text-muted-foreground">Tap to show iOS-style actions.</p>
      <ActionSheet
        open={open}
        onOpenChange={setOpen}
        container={containerRef.current}
        actions={[
          { label: "Share", icon: <Share2 className="h-5 w-5" />, onSelect: () => toast("Shared!") },
          { label: "Copy Link", icon: <Copy className="h-5 w-5" />, onSelect: () => toast("Link copied") },
          { label: "Edit", icon: <Edit className="h-5 w-5" />, onSelect: () => toast("Edit mode") },
          { label: "Delete", icon: <Trash2 className="h-5 w-5" />, onSelect: () => toast.error("Deleted"), destructive: true },
        ]}
      >
        <Button>Show Actions</Button>
      </ActionSheet>
    </div>
  );
}
