import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Page ────────────────────────────────────────────────────────── */

const Page = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative flex h-full flex-col", className)}
      style={{ contain: "layout size style" }}
      {...props}
    />
  )
);
Page.displayName = "Page";

/* ── PageContent ─────────────────────────────────────────────────── */

const PageContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative flex min-h-0 flex-1 flex-col overflow-hidden", className)}
      {...props}
    />
  )
);
PageContent.displayName = "PageContent";

/* ── PageFooter ──────────────────────────────────────────────────── */

const PageFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative shrink-0", className)}
      {...props}
    />
  )
);
PageFooter.displayName = "PageFooter";

/* ── ScrollView ──────────────────────────────────────────────────── */

const ScrollView = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain", className)}
      {...props}
    />
  )
);
ScrollView.displayName = "ScrollView";

/* ── Exports ─────────────────────────────────────────────────────── */

export { Page, PageContent, PageFooter, ScrollView };
