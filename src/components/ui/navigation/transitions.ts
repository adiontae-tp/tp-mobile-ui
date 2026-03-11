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

/* ── Stack variants ──────────────────────────────────────────────── */

export const iosStackVariants: Variants = {
  enter: (direction: "forward" | "back") => ({
    x: direction === "forward" ? "100%" : "-30%",
    boxShadow: direction === "forward" ? "-8px 0 24px rgba(0,0,0,0.15)" : "none",
  }),
  center: {
    x: "0%",
    boxShadow: "0px 0 0px rgba(0,0,0,0)",
  },
  exit: (direction: "forward" | "back") => ({
    x: direction === "forward" ? "-30%" : "100%",
    boxShadow: direction === "back" ? "-8px 0 24px rgba(0,0,0,0.15)" : "none",
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

/* ── Helpers ─────────────────────────────────────────────────────── */

export function getStackVariants(platform: Platform): Variants {
  return platform === "android" ? androidStackVariants : iosStackVariants;
}

export function getStackSpring(platform: Platform): Transition {
  return platform === "android" ? androidSpring : iosSpring;
}
