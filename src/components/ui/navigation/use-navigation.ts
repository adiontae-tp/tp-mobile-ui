import * as React from "react";
import type {
  StackState,
  NavigationAction,
  StackNavigationContextValue,
  TabNavigationContextValue,
  ModalNavigationContextValue,
  RouteContextValue,
  RouteEntry,
} from "./types";

/* ── Route key generator ─────────────────────────────────────────── */

function makeKey(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* ── Stack reducer ───────────────────────────────────────────────── */

export function stackReducer(state: StackState, action: NavigationAction): StackState {
  switch (action.type) {
    case "PUSH": {
      const entry: RouteEntry = {
        key: makeKey(),
        name: action.name,
        params: action.params,
      };
      return {
        routes: [...state.routes, entry],
        index: state.index + 1,
        direction: "forward",
      };
    }
    case "POP": {
      if (state.routes.length <= 1) return state;
      return {
        routes: state.routes.slice(0, -1),
        index: state.index - 1,
        direction: "back",
      };
    }
    case "REPLACE": {
      const entry: RouteEntry = {
        key: makeKey(),
        name: action.name,
        params: action.params,
      };
      const newRoutes = [...state.routes];
      newRoutes[newRoutes.length - 1] = entry;
      return {
        routes: newRoutes,
        index: state.index,
        direction: "forward",
      };
    }
    case "RESET": {
      const entry: RouteEntry = {
        key: makeKey(),
        name: action.name,
        params: action.params,
      };
      return {
        routes: [entry],
        index: 0,
        direction: "back",
      };
    }
    case "POP_TO_ROOT": {
      if (state.routes.length <= 1) return state;
      return {
        routes: [state.routes[0]],
        index: 0,
        direction: "back",
      };
    }
  }
}

/* ── Contexts ────────────────────────────────────────────────────── */

export const StackContext = React.createContext<StackNavigationContextValue | null>(null);
export const TabContext = React.createContext<TabNavigationContextValue | null>(null);
export const ModalContext = React.createContext<ModalNavigationContextValue | null>(null);
export const RouteContext = React.createContext<RouteContextValue>({
  name: "",
  key: "",
  params: {},
});

/* ── Hooks ───────────────────────────────────────────────────────── */

const noopStack: StackNavigationContextValue = {
  push: () => {},
  pop: () => {},
  goBack: () => {},
  canGoBack: () => false,
  replace: () => {},
  reset: () => {},
};

export function useNavigation() {
  const stack = React.useContext(StackContext);
  const tab = React.useContext(TabContext);
  const modal = React.useContext(ModalContext);

  if (!stack && !modal) {
    throw new Error("useNavigation must be used within a StackNavigator or ModalNavigator");
  }

  const s = stack ?? noopStack;

  return {
    // Stack
    push: s.push,
    pop: s.pop,
    goBack: s.goBack,
    canGoBack: s.canGoBack,
    replace: s.replace,
    reset: s.reset,
    // Tab (optional)
    ...(tab ? { switchTab: tab.switchTab, activeTab: tab.activeTab } : {}),
    // Modal (optional)
    ...(modal ? { presentModal: modal.presentModal, dismissModal: modal.dismissModal } : {}),
  };
}

export function useRoute(): RouteContextValue {
  return React.useContext(RouteContext);
}

/* ── Stack state initializer ─────────────────────────────────────── */

export function createInitialStackState(initialRoute: string): StackState {
  return {
    routes: [{ key: makeKey(), name: initialRoute }],
    index: 0,
    direction: "forward",
  };
}
