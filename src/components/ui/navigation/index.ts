// Navigation system
export { StackNavigator } from "./stack-navigator";
export { TabNavigator } from "./tab-navigator";
export { ModalNavigator } from "./modal-navigator";
export { SharedElement } from "./shared-element";

// Hooks
export { useNavigation, useRoute } from "./use-navigation";

// Platform detection
export { detectPlatform } from "./platform";

// Optional router sync
export { useRouterSync, useAndroidBack } from "./router-adapter";

// Transitions
export type { TransitionType, TabAnimation } from "./transitions";

// Types
export type {
  RouteEntry,
  StackState,
  NavigationAction,
  TabAction,
  ModalAction,
  ScreenDefinition,
  StackScreenProps,
  TabDefinition,
  ModalScreenDefinition,
  StackNavigationContextValue,
  TabNavigationContextValue,
  ModalNavigationContextValue,
  RouteContextValue,
  Platform,
} from "./types";
