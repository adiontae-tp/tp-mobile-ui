/** Version embedded in copied component files for update tracking. */
export const REGISTRY_VERSION = "0.3.0";

/** @type {Record<string, { file: string, dependencies: string[], internalDeps: string[], description: string }>} */
export const registry = {
  button: {
    file: "button.tsx",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge", "@radix-ui/react-slot", "lucide-react"],
    internalDeps: [],
    description: "Button with variants, sizes, loading state, and touch feedback.",
  },
  text: {
    file: "text.tsx",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Semantic typography component with variant-based styling.",
  },
  input: {
    file: "input.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Touch-friendly text input with icon slots.",
  },
  separator: {
    file: "separator.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Visual divider for content sections.",
  },
  card: {
    file: "card.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Flexible content container with compound sub-components.",
  },
  badge: {
    file: "badge.tsx",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Compact pill-shaped status indicators.",
  },
  avatar: {
    file: "avatar.tsx",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Circular user image with fallback initials.",
  },
  switch: {
    file: "switch.tsx",
    dependencies: ["@radix-ui/react-switch", "clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Toggle control built on Radix Switch.",
  },
  checkbox: {
    file: "checkbox.tsx",
    dependencies: ["@radix-ui/react-checkbox", "lucide-react", "clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Selection control built on Radix Checkbox.",
  },
  page: {
    file: "page.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Page layout container with content scroll area and bottom-anchored footer.",
  },
  header: {
    file: "header.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Sticky top navigation bar with safe area support.",
  },
  tabs: {
    file: "tabs.tsx",
    dependencies: ["@radix-ui/react-tabs", "clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Tabbed navigation panels built on Radix Tabs.",
  },
  toast: {
    file: "toast.tsx",
    dependencies: ["sonner"],
    internalDeps: [],
    description: "Toast notifications powered by Sonner.",
  },
  "bottom-sheet": {
    file: "bottom-sheet.tsx",
    dependencies: ["react-modal-sheet", "@radix-ui/react-slot", "clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Draggable bottom panel with spring animations and snap points.",
  },
  "action-sheet": {
    file: "action-sheet.tsx",
    dependencies: ["@radix-ui/react-dialog", "framer-motion", "clsx", "tailwind-merge"],
    internalDeps: ["bottom-sheet", "separator"],
    description: "iOS-style action menu built on Bottom Sheet.",
  },
  "bottom-tabs": {
    file: "bottom-tabs.tsx",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Bottom tab bar with animated active indicator.",
  },
  drawer: {
    file: "drawer.tsx",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Slide-out drawer panel with swipe gestures.",
  },
  list: {
    file: "list.tsx",
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    internalDeps: [],
    description: "iOS-style grouped list with sections and accessories.",
  },
  "footer-buttons": {
    file: "footer-buttons.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Sticky footer bar for one or two action buttons.",
  },
  "footer-sheet": {
    file: "footer-sheet.tsx",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Bottom sheet with built-in footer buttons and snap points.",
  },
  "toolbar-sheet": {
    file: "toolbar-sheet.tsx",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Bottom toolbar with expandable sheet content.",
  },
  "view-switcher": {
    file: "view-switcher.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Responsive viewport-aware layout switcher.",
  },
  "week-calendar": {
    file: "week-calendar.tsx",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Swipeable week calendar with date selection.",
  },
  chat: {
    file: "chat.tsx",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
    internalDeps: ["avatar"],
    description: "Mobile chat interface with message bubbles, typing indicator, and auto-growing input.",
  },
  calendar: {
    file: "calendar.tsx",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Full month calendar grid with single, range, and multiple selection modes.",
  },
  "date-picker": {
    file: "date-picker.tsx",
    dependencies: ["react-modal-sheet", "@radix-ui/react-slot", "clsx", "tailwind-merge"],
    internalDeps: ["bottom-sheet", "calendar", "separator"],
    description: "Modal date picker presenting a calendar inside a bottom sheet.",
  },
  "time-picker": {
    file: "time-picker.tsx",
    dependencies: ["framer-motion", "react-modal-sheet", "@radix-ui/react-slot", "clsx", "tailwind-merge"],
    internalDeps: ["bottom-sheet", "separator"],
    description: "iOS-style scroll wheel time picker with 12h/24h formats.",
  },
  navigation: {
    file: "navigation/",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
    internalDeps: ["bottom-tabs"],
    description: "Stack, tab, and modal navigators with shared element transitions.",
  },
};
