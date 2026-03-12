import type { ReactNode } from "react";

/* ── Route Entry ─────────────────────────────────────────────────── */

export interface RouteEntry {
  /** Unique key for AnimatePresence (crypto.randomUUID) */
  key: string;
  /** Route name matching a registered Screen */
  name: string;
  /** Params passed to the screen */
  params?: Record<string, unknown>;
}

/* ── Stack State ─────────────────────────────────────────────────── */

export interface StackState {
  routes: RouteEntry[];
  index: number;
  direction: "forward" | "back";
}

/* ── Actions ─────────────────────────────────────────────────────── */

export type NavigationAction =
  | { type: "PUSH"; name: string; params?: Record<string, unknown> }
  | { type: "POP" }
  | { type: "REPLACE"; name: string; params?: Record<string, unknown> }
  | { type: "RESET"; name: string; params?: Record<string, unknown> }
  | { type: "POP_TO_ROOT" };

export type TabAction = { type: "SWITCH_TAB"; name: string };

export type ModalAction =
  | { type: "PRESENT_MODAL"; name: string; params?: Record<string, unknown> }
  | { type: "DISMISS_MODAL" };

/* ── Screen Props ────────────────────────────────────────────────── */

export interface ScreenDefinition {
  name: string;
  component: React.ComponentType<Record<string, never>>;
  title?: string | ((params: Record<string, unknown>) => string);
  headerRight?: ReactNode;
  headerShown?: boolean;
}

export interface StackScreenProps {
  name: string;
  component: React.ComponentType<Record<string, never>>;
  /** Static title string, or a function receiving route params. */
  title?: string | ((params: Record<string, unknown>) => string);
  /** Content rendered on the right side of the header. */
  headerRight?: ReactNode;
  /** Set to false to hide the built-in header for this screen. Defaults to true. */
  headerShown?: boolean;
}

export interface TabDefinition {
  name: string;
  icon: ReactNode;
  label: string;
  badge?: boolean | number | string;
  children: ReactNode;
}

export interface ModalScreenDefinition {
  name: string;
  component: React.ComponentType<Record<string, never>>;
}

/* ── Navigation Context Values ───────────────────────────────────── */

export interface StackNavigationContextValue {
  push: (name: string, params?: Record<string, unknown>) => void;
  pop: () => void;
  goBack: () => void;
  canGoBack: () => boolean;
  replace: (name: string, params?: Record<string, unknown>) => void;
  reset: (name: string, params?: Record<string, unknown>) => void;
}

export interface TabNavigationContextValue {
  switchTab: (name: string) => void;
  activeTab: string;
}

export interface ModalNavigationContextValue {
  presentModal: (name: string, params?: Record<string, unknown>) => void;
  dismissModal: () => void;
}

export interface RouteContextValue {
  name: string;
  key: string;
  params: Record<string, unknown>;
}

/* ── Platform ────────────────────────────────────────────────────── */

export type Platform = "ios" | "android" | "desktop";
