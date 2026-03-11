import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function ToastPreview() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Button onClick={() => toast("Hello! This is a toast.")}>
        Default Toast
      </Button>
      <Button variant="secondary" onClick={() => toast.success("Operation completed.")}>
        Success Toast
      </Button>
      <Button variant="destructive" onClick={() => toast.error("Something went wrong.")}>
        Error Toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event scheduled", {
            description: "Friday, March 14, 2026 at 5:00 PM",
            action: { label: "Undo", onClick: () => toast("Undone!") },
          })
        }
      >
        Toast with Action
      </Button>
    </div>
  );
}
