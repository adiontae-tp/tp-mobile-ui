import { Toaster as SonnerToaster, toast } from "sonner";

function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "bg-background text-foreground border-border shadow-lg rounded-lg",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
        },
      }}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    />
  );
}

export { Toaster, toast };
