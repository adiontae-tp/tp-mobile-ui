import * as React from "react";
import { motion, AnimatePresence, type Variants, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Preset types ────────────────────────────────────────────────── */

export type TransitionPreset =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale"
  | "scale-up"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom"
  | "flip-x"
  | "flip-y"
  | "blur"
  | "pop";

/* ── Variant presets ─────────────────────────────────────────────── */

const presets: Record<TransitionPreset, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "fade-up": {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -16 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.92 },
  },
  "scale-up": {
    hidden: { opacity: 0, scale: 0.85, y: 12 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -6 },
  },
  "slide-up": {
    hidden: { y: "100%" },
    visible: { y: "0%" },
    exit: { y: "100%" },
  },
  "slide-down": {
    hidden: { y: "-100%" },
    visible: { y: "0%" },
    exit: { y: "-100%" },
  },
  "slide-left": {
    hidden: { x: "100%" },
    visible: { x: "0%" },
    exit: { x: "-100%" },
  },
  "slide-right": {
    hidden: { x: "-100%" },
    visible: { x: "0%" },
    exit: { x: "100%" },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
  },
  "flip-x": {
    hidden: { opacity: 0, rotateY: 90 },
    visible: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: -90 },
  },
  "flip-y": {
    hidden: { opacity: 0, rotateX: 90 },
    visible: { opacity: 1, rotateX: 0 },
    exit: { opacity: 0, rotateX: -90 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(8px)" },
  },
  pop: {
    hidden: { opacity: 0, scale: 0.6 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
};

/* ── Spring configs ──────────────────────────────────────────────── */

const springs: Record<string, Transition> = {
  snappy: { type: "spring", damping: 22, stiffness: 380, mass: 0.5 },
  smooth: { type: "spring", damping: 26, stiffness: 200, mass: 0.8 },
  bouncy: { type: "spring", damping: 14, stiffness: 300, mass: 0.6 },
  gentle: { type: "spring", damping: 30, stiffness: 180, mass: 1.0 },
};

/* ── Transition component ────────────────────────────────────────── */

export interface TransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The type of entrance/exit animation. @default "fade-up" */
  type?: TransitionPreset;
  /** Delay before animation starts (seconds). @default 0 */
  delay?: number;
  /** Duration for non-spring transitions (seconds). */
  duration?: number;
  /** Spring feel. @default "snappy" */
  spring?: "snappy" | "smooth" | "bouncy" | "gentle";
  /** Whether the element is visible. Controls AnimatePresence. @default true */
  show?: boolean;
  /** Animate on mount. @default true */
  animateOnMount?: boolean;
  /** Custom variants (overrides type preset). */
  variants?: Variants;
}

const TransitionInner = React.forwardRef<HTMLDivElement, TransitionProps>(
  (
    {
      type = "fade-up",
      delay = 0,
      duration,
      spring = "snappy",
      show = true,
      animateOnMount = true,
      variants: customVariants,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const variants = customVariants ?? presets[type];
    const needsPerspective = type === "flip-x" || type === "flip-y";

    const transition: Transition = {
      ...springs[spring],
      delay,
      ...(duration !== undefined ? { duration, type: "tween", ease: "easeOut" } : {}),
    };

    return (
      <AnimatePresence mode="wait">
        {show && (
          <motion.div
            ref={ref}
            className={cn(className)}
            variants={variants}
            initial={animateOnMount ? "hidden" : false}
            animate="visible"
            exit="exit"
            transition={transition}
            style={{
              ...style,
              perspective: needsPerspective ? 1200 : undefined,
            }}
            {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
TransitionInner.displayName = "Transition";

/* ── TransitionGroup (staggered children) ────────────────────────── */

export interface TransitionGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stagger delay between children (seconds). @default 0.05 */
  stagger?: number;
  /** Delay before the first child animates (seconds). @default 0 */
  delay?: number;
  /** Whether to animate. @default true */
  show?: boolean;
}

const TransitionGroup = React.forwardRef<HTMLDivElement, TransitionGroupProps>(
  ({ stagger = 0.05, delay = 0, show = true, className, children, ...props }, ref) => {
    const containerVariants: Variants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: stagger,
          delayChildren: delay,
        },
      },
      exit: {
        transition: {
          staggerChildren: stagger * 0.5,
          staggerDirection: -1,
        },
      },
    };

    return (
      <AnimatePresence>
        {show && (
          <motion.div
            ref={ref}
            className={cn(className)}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
TransitionGroup.displayName = "TransitionGroup";

/* ── TransitionChild (for use inside TransitionGroup) ─────────────── */

export interface TransitionChildProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The animation preset. @default "fade-up" */
  type?: TransitionPreset;
  /** Spring feel. @default "snappy" */
  spring?: "snappy" | "smooth" | "bouncy" | "gentle";
}

const TransitionChild = React.forwardRef<HTMLDivElement, TransitionChildProps>(
  ({ type = "fade-up", spring = "snappy", className, children, style, ...props }, ref) => {
    const variants = presets[type];
    const needsPerspective = type === "flip-x" || type === "flip-y";

    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        variants={variants}
        transition={springs[spring]}
        style={{
          ...style,
          perspective: needsPerspective ? 1200 : undefined,
        }}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
      >
        {children}
      </motion.div>
    );
  }
);
TransitionChild.displayName = "TransitionChild";

/* ── Export ───────────────────────────────────────────────────────── */

const Transition = Object.assign(TransitionInner, {
  Group: TransitionGroup,
  Child: TransitionChild,
});

export { Transition };
