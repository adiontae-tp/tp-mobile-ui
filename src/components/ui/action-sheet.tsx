import * as React from "react";
import {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetContent,
} from "@/components/ui/bottom-sheet";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export interface ActionSheetAction {
  label: string;
  icon?: React.ReactNode;
  onSelect: () => void;
  destructive?: boolean;
}

export interface ActionSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  actions: ActionSheetAction[];
  cancelLabel?: string;
  children?: React.ReactNode;
  /** Portal target element for contained rendering. */
  container?: HTMLElement | null;
}

function ActionSheet({
  open,
  onOpenChange,
  actions,
  cancelLabel = "Cancel",
  children,
  container,
}: ActionSheetProps) {
  const handleAction = (action: ActionSheetAction) => {
    action.onSelect();
    onOpenChange?.(false);
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} modal={!container} container={container} detents={["content"]}>
      {children && <BottomSheetTrigger asChild>{children}</BottomSheetTrigger>}
      <BottomSheetContent>
        <div className="flex flex-col">
          {actions.map((action, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Separator />}
              <button
                className={cn(
                  "flex min-h-touch w-full items-center gap-3 px-2 py-3 text-base font-medium transition-colors active:bg-accent rounded-md",
                  action.destructive && "text-destructive"
                )}
                onClick={() => handleAction(action)}
              >
                {action.icon && (
                  <span className="flex h-5 w-5 items-center justify-center">
                    {action.icon}
                  </span>
                )}
                {action.label}
              </button>
            </React.Fragment>
          ))}
        </div>
        <Separator className="my-2" />
        <button
          className="flex min-h-touch w-full items-center justify-center rounded-md py-3 text-base font-semibold text-muted-foreground active:bg-accent"
          onClick={() => onOpenChange?.(false)}
        >
          {cancelLabel}
        </button>
      </BottomSheetContent>
    </BottomSheet>
  );
}

export { ActionSheet };
