import { Toaster as SonnerToaster, toast } from "sonner";

function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      visibleToasts={3}
      toastOptions={{
        classNames: {
          toast:
            "bg-background text-foreground border-border shadow-lg rounded-lg !transform-gpu",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
        },
        style: {
          // Spring-like cubic bezier for sonner's CSS transitions
          transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          transitionDuration: "350ms",
        },
      }}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    />
  );
}

export { Toaster, toast };
