import * as React from "react";
import { cn } from "@/lib/utils";

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, title, leftAction, rightAction, children, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        "sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg",
        className
      )}
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
      {...props}
    >
      <div className="flex h-11 items-center justify-between px-4">
        <div className="flex min-w-[2.75rem] items-center">{leftAction}</div>
        <div className="flex-1 text-center text-base font-semibold truncate px-2">
          {title || children}
        </div>
        <div className="flex min-w-[2.75rem] items-center justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  )
);
Header.displayName = "Header";

export { Header };
