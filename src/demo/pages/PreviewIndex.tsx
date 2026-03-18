import { Link } from "react-router-dom";
import { ScrollView } from "@/components/ui/page";
import packageJson from "../../../package.json";

const sections = [
  {
    title: "Core",
    items: [
      { path: "button", title: "Button" },
      { path: "text", title: "Text" },
      { path: "input", title: "Input" },
      { path: "separator", title: "Separator" },
    ],
  },
  {
    title: "Display",
    items: [
      { path: "card", title: "Card" },
      { path: "list", title: "List" },
      { path: "badge", title: "Badge" },
      { path: "avatar", title: "Avatar" },
    ],
  },
  {
    title: "Form",
    items: [
      { path: "switch", title: "Switch" },
      { path: "checkbox", title: "Checkbox" },
      { path: "calendar", title: "Calendar" },
      { path: "date-picker", title: "Date Picker" },
      { path: "time-picker", title: "Time Picker" },
      { path: "sheet-input", title: "Sheet Input" },
    ],
  },
  {
    title: "Navigation",
    items: [
      { path: "header", title: "Header" },
      { path: "tabs", title: "Tabs" },
      { path: "bottom-tabs", title: "Bottom Tabs" },
      { path: "drawer", title: "Drawer" },
      { path: "navigation", title: "Navigation" },
    ],
  },
  {
    title: "Overlays",
    items: [
      { path: "bottom-sheet", title: "Bottom Sheet" },
      { path: "action-sheet", title: "Action Sheet" },
      { path: "toast", title: "Toast" },
      { path: "toolbar-sheet", title: "Toolbar Sheet" },
    ],
  },
  {
    title: "Communication",
    items: [
      { path: "chat", title: "Chat" },
    ],
  },
  {
    title: "Animation",
    items: [
      { path: "transition", title: "Transition" },
    ],
  },
  {
    title: "Layout",
    items: [
      { path: "footer-buttons", title: "Footer Buttons" },
      { path: "view-switcher", title: "View Switcher" },
      { path: "week-calendar", title: "Week Calendar" },
    ],
  },
];

export function PreviewIndex() {
  return (
    <ScrollView className="flex flex-col">
      {sections.map((section) => (
        <div key={section.title}>
          <div className="px-4 pt-4 pb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </span>
          </div>
          {section.items.map((c) => (
            <Link
              key={c.path}
              to={c.path}
              className="flex min-h-touch items-center border-b px-4 text-sm font-medium active:bg-accent"
            >
              {c.title}
            </Link>
          ))}
        </div>
      ))}
      <div className="px-4 py-6 text-center">
        <span className="text-xs text-muted-foreground">v{packageJson.version}</span>
      </div>
    </ScrollView>
  );
}
