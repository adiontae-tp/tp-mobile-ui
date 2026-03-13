import { useState } from "react";
import { cn } from "@/lib/utils";
import { Palette } from "lucide-react";

interface ThemePreset {
  name: string;
  color: string; // Display swatch color
  vars: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

const presets: ThemePreset[] = [
  {
    name: "Default",
    color: "#171717",
    vars: {
      light: {
        "--primary": "oklch(0.205 0 0)",
        "--primary-foreground": "oklch(0.985 0 0)",
        "--accent": "oklch(0.965 0 0)",
        "--accent-foreground": "oklch(0.205 0 0)",
        "--ring": "oklch(0.708 0 0)",
      },
      dark: {
        "--primary": "oklch(0.985 0 0)",
        "--primary-foreground": "oklch(0.205 0 0)",
        "--accent": "oklch(0.269 0 0)",
        "--accent-foreground": "oklch(0.985 0 0)",
        "--ring": "oklch(0.439 0 0)",
      },
    },
  },
  {
    name: "Blue",
    color: "#2563eb",
    vars: {
      light: {
        "--primary": "oklch(0.55 0.2 260)",
        "--primary-foreground": "oklch(0.985 0 0)",
        "--accent": "oklch(0.95 0.04 260)",
        "--accent-foreground": "oklch(0.3 0.15 260)",
        "--ring": "oklch(0.55 0.2 260)",
      },
      dark: {
        "--primary": "oklch(0.65 0.2 260)",
        "--primary-foreground": "oklch(0.15 0 0)",
        "--accent": "oklch(0.25 0.06 260)",
        "--accent-foreground": "oklch(0.9 0.04 260)",
        "--ring": "oklch(0.65 0.2 260)",
      },
    },
  },
  {
    name: "Green",
    color: "#16a34a",
    vars: {
      light: {
        "--primary": "oklch(0.55 0.17 155)",
        "--primary-foreground": "oklch(0.985 0 0)",
        "--accent": "oklch(0.95 0.04 155)",
        "--accent-foreground": "oklch(0.3 0.12 155)",
        "--ring": "oklch(0.55 0.17 155)",
      },
      dark: {
        "--primary": "oklch(0.65 0.17 155)",
        "--primary-foreground": "oklch(0.15 0 0)",
        "--accent": "oklch(0.25 0.05 155)",
        "--accent-foreground": "oklch(0.9 0.04 155)",
        "--ring": "oklch(0.65 0.17 155)",
      },
    },
  },
  {
    name: "Purple",
    color: "#9333ea",
    vars: {
      light: {
        "--primary": "oklch(0.5 0.22 300)",
        "--primary-foreground": "oklch(0.985 0 0)",
        "--accent": "oklch(0.95 0.04 300)",
        "--accent-foreground": "oklch(0.35 0.15 300)",
        "--ring": "oklch(0.5 0.22 300)",
      },
      dark: {
        "--primary": "oklch(0.65 0.22 300)",
        "--primary-foreground": "oklch(0.15 0 0)",
        "--accent": "oklch(0.25 0.06 300)",
        "--accent-foreground": "oklch(0.9 0.04 300)",
        "--ring": "oklch(0.65 0.22 300)",
      },
    },
  },
  {
    name: "Rose",
    color: "#e11d48",
    vars: {
      light: {
        "--primary": "oklch(0.55 0.22 10)",
        "--primary-foreground": "oklch(0.985 0 0)",
        "--accent": "oklch(0.95 0.04 10)",
        "--accent-foreground": "oklch(0.35 0.15 10)",
        "--ring": "oklch(0.55 0.22 10)",
      },
      dark: {
        "--primary": "oklch(0.65 0.2 10)",
        "--primary-foreground": "oklch(0.15 0 0)",
        "--accent": "oklch(0.25 0.06 10)",
        "--accent-foreground": "oklch(0.9 0.04 10)",
        "--ring": "oklch(0.65 0.2 10)",
      },
    },
  },
  {
    name: "Orange",
    color: "#ea580c",
    vars: {
      light: {
        "--primary": "oklch(0.58 0.2 50)",
        "--primary-foreground": "oklch(0.985 0 0)",
        "--accent": "oklch(0.95 0.04 50)",
        "--accent-foreground": "oklch(0.35 0.15 50)",
        "--ring": "oklch(0.58 0.2 50)",
      },
      dark: {
        "--primary": "oklch(0.68 0.18 50)",
        "--primary-foreground": "oklch(0.15 0 0)",
        "--accent": "oklch(0.25 0.06 50)",
        "--accent-foreground": "oklch(0.9 0.04 50)",
        "--ring": "oklch(0.68 0.18 50)",
      },
    },
  },
  {
    name: "Teal",
    color: "#0d9488",
    vars: {
      light: {
        "--primary": "oklch(0.55 0.14 185)",
        "--primary-foreground": "oklch(0.985 0 0)",
        "--accent": "oklch(0.95 0.03 185)",
        "--accent-foreground": "oklch(0.3 0.1 185)",
        "--ring": "oklch(0.55 0.14 185)",
      },
      dark: {
        "--primary": "oklch(0.65 0.14 185)",
        "--primary-foreground": "oklch(0.15 0 0)",
        "--accent": "oklch(0.25 0.05 185)",
        "--accent-foreground": "oklch(0.9 0.03 185)",
        "--ring": "oklch(0.65 0.14 185)",
      },
    },
  },
];

function applyTheme(preset: ThemePreset) {
  const isDark = document.documentElement.classList.contains("dark");
  const vars = isDark ? preset.vars.dark : preset.vars.light;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

function clearTheme() {
  const root = document.documentElement;
  const keys = ["--primary", "--primary-foreground", "--accent", "--accent-foreground", "--ring"];
  for (const key of keys) {
    root.style.removeProperty(key);
  }
}

export function ThemeSwitcher() {
  const [active, setActive] = useState("Default");
  const [open, setOpen] = useState(false);

  const handleSelect = (preset: ThemePreset) => {
    setActive(preset.name);
    if (preset.name === "Default") {
      clearTheme();
    } else {
      applyTheme(preset);
    }
  };

  // Re-apply on dark mode toggle (observed via MutationObserver would be complex,
  // so we re-apply whenever the popover opens)
  const handleOpen = () => {
    setOpen((o) => {
      if (!o) {
        // Re-apply current theme on open to sync with dark mode
        const preset = presets.find((p) => p.name === active);
        if (preset && preset.name !== "Default") {
          applyTheme(preset);
        }
      }
      return !o;
    });
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
        title="Change theme color"
      >
        <Palette className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 rounded-lg border bg-card p-3 shadow-lg">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Brand Color</p>
            <div className="flex gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleSelect(preset)}
                  title={preset.name}
                  className={cn(
                    "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
                    active === preset.name
                      ? "border-foreground scale-110"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: preset.color }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
