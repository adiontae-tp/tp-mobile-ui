import * as React from "react";
import { cn } from "@/lib/utils";

interface FooterButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const FooterButtons = React.forwardRef<HTMLDivElement, FooterButtonsProps>(
  ({ className, children, ...props }, ref) => {
    const childCount = React.Children.count(children);

    return (
      <div
        ref={ref}
        className={cn(
          "sticky bottom-0 border-t border-border bg-background px-4 py-3 pb-[var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))]",
          childCount === 1 ? "flex [&>*]:w-full" : "grid grid-cols-2 gap-3",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FooterButtons.displayName = "FooterButtons";

export { FooterButtons };
