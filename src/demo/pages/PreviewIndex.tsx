import { Link } from "react-router-dom";

const components = [
  { path: "button", title: "Button" },
  { path: "text", title: "Text" },
  { path: "input", title: "Input" },
  { path: "card", title: "Card" },
  { path: "badge", title: "Badge" },
  { path: "avatar", title: "Avatar" },
  { path: "separator", title: "Separator" },
  { path: "switch", title: "Switch" },
  { path: "checkbox", title: "Checkbox" },
  { path: "tabs", title: "Tabs" },
  { path: "header", title: "Header" },
  { path: "bottom-sheet", title: "Bottom Sheet" },
  { path: "action-sheet", title: "Action Sheet" },
  { path: "toast", title: "Toast" },
];

export function PreviewIndex() {
  return (
    <div className="flex flex-col">
      {components.map((c) => (
        <Link
          key={c.path}
          to={c.path}
          className="flex min-h-touch items-center border-b px-4 text-sm font-medium active:bg-accent"
        >
          {c.title}
        </Link>
      ))}
    </div>
  );
}
