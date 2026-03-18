import type { Variants, Transition } from "framer-motion";
import type { Platform } from "./types";

/* ── Spring configs ──────────────────────────────────────────────── */

export const iosSpring: Transition = {
  type: "spring",
  damping: 28,
  stiffness: 260,
  mass: 0.8,
};

export const androidSpring: Transition = {
  type: "spring",
  damping: 24,
  stiffness: 300,
  mass: 0.6,
};

export const modalSpring: Transition = {
  type: "spring",
  damping: 28,
  stiffness: 260,
  mass: 0.8,
};

export const snappySpring: Transition = {
  type: "spring",
  damping: 26,
  stiffness: 350,
  mass: 0.6,
};

export const gentleSpring: Transition = {
  type: "spring",
  damping: 30,
  stiffness: 200,
  mass: 1.0,
};

/* ── Transition type ─────────────────────────────────────────────── */

export type TransitionType =
  | "ios"
  | "android"
  | "fade"
  | "slide-up"
  | "slide-down"
  | "zoom"
  | "flip"
  | "cover-vertical"
  | "none";

/* ── Stack variants ──────────────────────────────────────────────── */

export const iosStackVariants: Variants = {
  enter: (direction: "forward" | "back") => ({
    x: direction === "forward" ? "100%" : "-30%",
  }),
  center: {
    x: "0%",
  },
  exit: (direction: "forward" | "back") => ({
    x: direction === "forward" ? "-30%" : "100%",
  }),
};

/** Opacity values for the shadow overlay on the incoming screen (iOS only). */
export const iosShadowVariants: Variants = {
  enter: (direction: "forward" | "back") => ({
    opacity: direction === "forward" ? 1 : 0,
  }),
  center: { opacity: 0 },
  exit: (direction: "forward" | "back") => ({
    opacity: direction === "back" ? 1 : 0,
  }),
};

export const androidStackVariants: Variants = {
  enter: {
    y: "6%",
    opacity: 0,
    scale: 0.96,
  },
  center: {
    y: "0%",
    opacity: 1,
    scale: 1,
  },
  exit: {
    y: "6%",
    opacity: 0,
    scale: 0.96,
  },
};

/* ── Fade ────────────────────────────────────────────────────────── */

export const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

/* ── Slide up (page present) ─────────────────────────────────────── */

export const slideUpVariants: Variants = {
  enter: (direction: "forward" | "back") => ({
    y: direction === "forward" ? "100%" : "-10%",
    opacity: direction === "forward" ? 1 : 0.8,
  }),
  center: { y: "0%", opacity: 1 },
  exit: (direction: "forward" | "back") => ({
    y: direction === "forward" ? "-10%" : "100%",
    opacity: direction === "forward" ? 0.8 : 1,
  }),
};

/* ── Slide down (notification-style) ─────────────────────────────── */

export const slideDownVariants: Variants = {
  enter: (direction: "forward" | "back") => ({
    y: direction === "forward" ? "-100%" : "10%",
    opacity: direction === "forward" ? 1 : 0.8,
  }),
  center: { y: "0%", opacity: 1 },
  exit: (direction: "forward" | "back") => ({
    y: direction === "forward" ? "10%" : "-100%",
    opacity: direction === "forward" ? 0.8 : 1,
  }),
};

/* ── Zoom (scale in/out with fade) ───────────────────────────────── */

export const zoomVariants: Variants = {
  enter: (direction: "forward" | "back") => ({
    scale: direction === "forward" ? 0.85 : 1.1,
    opacity: 0,
  }),
  center: { scale: 1, opacity: 1 },
  exit: (direction: "forward" | "back") => ({
    scale: direction === "forward" ? 1.1 : 0.85,
    opacity: 0,
  }),
};

/* ── Flip (3D perspective) ───────────────────────────────────────── */

export const flipVariants: Variants = {
  enter: (direction: "forward" | "back") => ({
    rotateY: direction === "forward" ? 90 : -90,
    opacity: 0,
  }),
  center: { rotateY: 0, opacity: 1 },
  exit: (direction: "forward" | "back") => ({
    rotateY: direction === "forward" ? -90 : 90,
    opacity: 0,
  }),
};

/* ── Cover vertical (iOS-style card push from bottom) ────────────── */

export const coverVerticalVariants: Variants = {
  enter: (direction: "forward" | "back") => ({
    y: direction === "forward" ? "100%" : "0%",
    scale: direction === "forward" ? 1 : 0.94,
  }),
  center: { y: "0%", scale: 1 },
  exit: (direction: "forward" | "back") => ({
    y: direction === "forward" ? "0%" : "100%",
    scale: direction === "forward" ? 0.94 : 1,
  }),
};

/* ── None (instant) ──────────────────────────────────────────────── */

export const noneVariants: Variants = {
  enter: {},
  center: {},
  exit: {},
};

/* ── Modal variants ──────────────────────────────────────────────── */

export const modalVariants: Variants = {
  enter: {
    y: "100%",
  },
  center: {
    y: "0%",
  },
  exit: {
    y: "100%",
  },
};

export const modalBackdropVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

/* ── Tab content transitions ─────────────────────────────────────── */

export type TabAnimation = "none" | "crossfade" | "slide";

export const tabCrossfadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export const tabSlideVariants: Variants = {
  enter: (direction: 1 | -1) => ({
    x: direction > 0 ? "30%" : "-30%",
    opacity: 0,
  }),
  center: { x: "0%", opacity: 1 },
  exit: (direction: 1 | -1) => ({
    x: direction > 0 ? "-30%" : "30%",
    opacity: 0,
  }),
};

export const tabTransitionSpring: Transition = {
  type: "spring",
  damping: 28,
  stiffness: 300,
  mass: 0.7,
};

/* ── Helpers ─────────────────────────────────────────────────────── */

export function getStackVariants(platform: Platform): Variants {
  return platform === "android" ? androidStackVariants : iosStackVariants;
}

export function getStackSpring(platform: Platform): Transition {
  return platform === "android" ? androidSpring : iosSpring;
}

const variantMap: Record<TransitionType, Variants> = {
  ios: iosStackVariants,
  android: androidStackVariants,
  fade: fadeVariants,
  "slide-up": slideUpVariants,
  "slide-down": slideDownVariants,
  zoom: zoomVariants,
  flip: flipVariants,
  "cover-vertical": coverVerticalVariants,
  none: noneVariants,
};

const springMap: Record<TransitionType, Transition> = {
  ios: iosSpring,
  android: androidSpring,
  fade: { duration: 0.25, ease: "easeInOut" },
  "slide-up": snappySpring,
  "slide-down": snappySpring,
  zoom: gentleSpring,
  flip: { type: "spring", damping: 20, stiffness: 200, mass: 0.8 },
  "cover-vertical": modalSpring,
  none: { duration: 0 },
};

export function getTransitionVariants(type: TransitionType): Variants {
  return variantMap[type];
}

export function getTransitionSpring(type: TransitionType): Transition {
  return springMap[type];
}
