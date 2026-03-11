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
    dependencies: ["@radix-ui/react-dialog", "framer-motion", "clsx", "tailwind-merge"],
    internalDeps: [],
    description: "Draggable bottom panel with spring animations.",
  },
  "action-sheet": {
    file: "action-sheet.tsx",
    dependencies: ["@radix-ui/react-dialog", "framer-motion", "clsx", "tailwind-merge"],
    internalDeps: ["bottom-sheet", "separator"],
    description: "iOS-style action menu built on Bottom Sheet.",
  },
};
