import type { Platform } from "./types";

let cachedPlatform: Platform | null = null;

export function detectPlatform(): Platform {
  if (cachedPlatform) return cachedPlatform;

  if (typeof navigator === "undefined") {
    cachedPlatform = "ios";
    return cachedPlatform;
  }

  const ua = navigator.userAgent;

  if (/android/i.test(ua)) {
    cachedPlatform = "android";
  } else if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
    cachedPlatform = "ios";
  } else {
    // Desktop fallback — use iOS transitions (they feel natural on desktop too)
    cachedPlatform = "ios";
  }

  return cachedPlatform;
}
