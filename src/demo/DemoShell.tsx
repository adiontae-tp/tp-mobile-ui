import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Moon, Sun, Menu, X } from "lucide-react";

const navSections = [
  {
    title: "Getting Started",
    items: [{ path: "/", label: "Introduction" }],
  },
  {
    title: "Core",
    items: [
      { path: "/button", label: "Button" },
      { path: "/text", label: "Text" },
      { path: "/input", label: "Input" },
      { path: "/separator", label: "Separator" },
    ],
  },
  {
    title: "Display",
    items: [
      { path: "/card", label: "Card" },
      { path: "/list", label: "List" },
      { path: "/badge", label: "Badge" },
      { path: "/avatar", label: "Avatar" },
    ],
  },
  {
    title: "Form",
    items: [
      { path: "/switch", label: "Switch" },
      { path: "/checkbox", label: "Checkbox" },
    ],
  },
  {
    title: "Navigation",
    items: [
      { path: "/header", label: "Header" },
      { path: "/tabs", label: "Tabs" },
      { path: "/bottom-tabs", label: "Bottom Tabs" },
      { path: "/drawer", label: "Drawer" },
      { path: "/navigation", label: "Navigation" },
    ],
  },
  {
    title: "Overlays",
    items: [
      { path: "/bottom-sheet", label: "Bottom Sheet" },
      { path: "/action-sheet", label: "Action Sheet" },
      { path: "/toast", label: "Toast" },
      { path: "/toolbar-sheet", label: "Toolbar Sheet" },
    ],
  },
  {
    title: "Layout",
    items: [
      { path: "/footer-buttons", label: "Footer Buttons" },
      { path: "/view-switcher", label: "View Switcher" },
      { path: "/week-calendar", label: "Week Calendar" },
    ],
  },
];

export function DemoShell() {
  const location = useLocation();
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDark = () => {
    setDark((d) => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  };

  const sidebar = (
    <nav className="flex flex-col gap-6 p-6">
      {navSections.map((section) => (
        <div key={section.title}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {section.title}
          </h3>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                    location.pathname === item.path
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-lg md:px-6">
        <div className="flex items-center gap-3">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="text-lg font-bold tracking-tight">
            Mobile UI
          </Link>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            v0.1
          </span>
        </div>
        <button
          onClick={toggleDark}
          className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-r md:block">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
            {sidebar}
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed inset-y-14 left-0 z-40 w-64 overflow-y-auto border-r bg-background md:hidden">
              {sidebar}
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-8 md:px-8 lg:px-16 xl:px-24">
          <div className="mx-auto max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
