import { useEffect } from "react";
import { useNavigation, useRoute } from "./use-navigation";

/**
 * Optional hook to sync navigation state with the browser URL.
 *
 * Call this inside a screen component to keep the browser URL
 * in sync with the in-memory navigation stack.
 *
 * @param basePath - Base path prefix for URL sync (e.g., "/app")
 */
export function useRouterSync(basePath: string = "") {
  const route = useRoute();

  useEffect(() => {
    const targetPath = `${basePath}/${route.name}`;
    if (window.location.pathname !== targetPath) {
      window.history.replaceState(null, "", targetPath);
    }
  }, [route.name, basePath]);
}

/**
 * Hook that listens for Android back button (popstate) and dispatches
 * pop or dismissModal actions. Use this at the root of your navigator.
 */
export function useAndroidBack() {
  const nav = useNavigation();

  useEffect(() => {
    const handlePopState = () => {
      if (nav.canGoBack()) {
        nav.goBack();
      } else if ("dismissModal" in nav) {
        (nav as { dismissModal: () => void }).dismissModal();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [nav]);
}
