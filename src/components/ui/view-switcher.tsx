import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Breakpoints ─────────────────────────────────────────────────── */

/** Default breakpoints (matches Tailwind v4 defaults). */
const BREAKPOINTS = {
  /** Mobile: 0 – 767px */
  mobile: 768,
  /** Tablet: 768 – 1023px */
  tablet: 1024,
  /** Desktop: 1024px+ */
} as const;

export type Viewport = "mobile" | "tablet" | "desktop";

/* ── CSS-only view components ────────────────────────────────────── */

interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Renders children only on mobile viewports (< 768px).
 * Uses CSS `display` toggle — no JS, no hydration flash.
 */
const Mobile = React.forwardRef<HTMLDivElement, ViewProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("contents md:!hidden", className)}
      {...props}
    />
  )
);
Mobile.displayName = "View.Mobile";

/**
 * Renders children only on tablet viewports (768px – 1023px).
 */
const Tablet = React.forwardRef<HTMLDivElement, ViewProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("hidden md:contents lg:!hidden", className)}
      {...props}
    />
  )
);
Tablet.displayName = "View.Tablet";

/**
 * Renders children only on desktop viewports (>= 1024px).
 */
const Desktop = React.forwardRef<HTMLDivElement, ViewProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("hidden lg:contents", className)}
      {...props}
    />
  )
);
Desktop.displayName = "View.Desktop";

/**
 * Renders children on mobile and tablet viewports (< 1024px).
 */
const MobileAndTablet = React.forwardRef<HTMLDivElement, ViewProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("contents lg:!hidden", className)}
      {...props}
    />
  )
);
MobileAndTablet.displayName = "View.MobileAndTablet";

/**
 * Renders children on tablet and desktop viewports (>= 768px).
 */
const TabletAndDesktop = React.forwardRef<HTMLDivElement, ViewProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("hidden md:contents", className)}
      {...props}
    />
  )
);
TabletAndDesktop.displayName = "View.TabletAndDesktop";

/* ── Compound component ──────────────────────────────────────────── */

const View = {
  Mobile,
  Tablet,
  Desktop,
  MobileAndTablet,
  TabletAndDesktop,
};

export { View };

/* ── Hook ────────────────────────────────────────────────────────── */

/**
 * Returns the current viewport tier: `"mobile"`, `"tablet"`, or `"desktop"`.
 *
 * Uses `matchMedia` listeners — only re-renders on breakpoint crossings.
 * For rendering different component trees prefer the CSS-only `<View.*>`
 * components which avoid any JS overhead.
 */
export function useViewport(): Viewport {
  const [viewport, setViewport] = React.useState<Viewport>(() => {
    if (typeof window === "undefined") return "mobile";
    const w = window.innerWidth;
    if (w < BREAKPOINTS.mobile) return "mobile";
    if (w < BREAKPOINTS.tablet) return "tablet";
    return "desktop";
  });

  React.useEffect(() => {
    const mqlTablet = window.matchMedia(`(min-width: ${BREAKPOINTS.mobile}px)`);
    const mqlDesktop = window.matchMedia(`(min-width: ${BREAKPOINTS.tablet}px)`);

    const update = () => {
      if (mqlDesktop.matches) setViewport("desktop");
      else if (mqlTablet.matches) setViewport("tablet");
      else setViewport("mobile");
    };

    mqlTablet.addEventListener("change", update);
    mqlDesktop.addEventListener("change", update);
    update();

    return () => {
      mqlTablet.removeEventListener("change", update);
      mqlDesktop.removeEventListener("change", update);
    };
  }, []);

  return viewport;
}
