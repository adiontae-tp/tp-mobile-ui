import { ComponentPage } from "@/demo/ComponentPage";
import { ToastPreview } from "@/demo/previews/ToastPreview";

const usage = `import { toast } from "@/components/ui/toast"
// Add <Toaster /> to your app root

// Simple
toast("Hello!")

// Variants
toast.success("Saved successfully.")
toast.error("Something went wrong.")

// With action
toast("Event created", {
  description: "Friday at 5:00 PM",
  action: {
    label: "Undo",
    onClick: () => toast("Undone!"),
  },
})`;

export function ToastDemo() {
  return (
    <ComponentPage
      title="Toast"
      description="Non-intrusive notification toasts powered by Sonner. Positioned at bottom-center for mobile with swipe-to-dismiss support."
      usage={usage}
    >
      <ToastPreview />
    </ComponentPage>
  );
}
