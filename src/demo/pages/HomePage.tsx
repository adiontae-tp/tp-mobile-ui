import { Link } from "react-router-dom";
import { PhonePreview } from "@/demo/PhonePreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/demo/CodeBlock";
import { Search } from "lucide-react";

const components = [
  { path: "/button", title: "Button", desc: "Clickable actions with multiple variants and sizes." },
  { path: "/text", title: "Text", desc: "Semantic typography components." },
  { path: "/input", title: "Input", desc: "Text input with icon slots and mobile keyboards." },
  { path: "/card", title: "Card", desc: "Flexible content containers." },
  { path: "/badge", title: "Badge", desc: "Compact status indicators." },
  { path: "/avatar", title: "Avatar", desc: "User profile images with fallback." },
  { path: "/separator", title: "Separator", desc: "Visual dividers for content." },
  { path: "/switch", title: "Switch", desc: "Toggle controls for settings." },
  { path: "/checkbox", title: "Checkbox", desc: "Selection controls for forms." },
  { path: "/tabs", title: "Tabs", desc: "Tabbed navigation panels." },
  { path: "/header", title: "Header", desc: "Top navigation bars with actions." },
  { path: "/bottom-sheet", title: "Bottom Sheet", desc: "Draggable bottom panels." },
  { path: "/action-sheet", title: "Action Sheet", desc: "iOS-style action menus." },
  { path: "/toast", title: "Toast", desc: "Non-intrusive notifications." },
  { path: "/toolbar-sheet", title: "Toolbar Sheet", desc: "Apple Maps-style persistent toolbar sheet." },
];

export function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Mobile UI
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Mobile-first components built with React and Tailwind CSS.
            Use the CLI to add components to your project — you own the code.
            Customize everything. No abstraction layer.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/button">
              <Button size="lg">Browse Components</Button>
            </Link>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">1. Initialize your project</p>
            <CodeBlock
              code={`npx mobile-ui init`}
              filename="terminal"
            />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium">2. Add the components you need</p>
            <CodeBlock
              code={`npx mobile-ui add button card input`}
              filename="terminal"
            />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium">3. Import and use them</p>
            <CodeBlock
              code={`import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function MyPage() {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-3">
        <Button>Primary Action</Button>
        <Button variant="outline">Secondary</Button>
      </CardContent>
    </Card>
  )
}`}
              filename="my-page.tsx"
            />
          </div>
        </div>

        {/* Hero phone preview */}
        <PhonePreview className="hidden lg:flex">
          <div className="flex flex-col gap-4 p-5">
            <div className="space-y-1">
              <p className="text-lg font-semibold">Welcome back</p>
              <p className="text-sm text-muted-foreground">What would you like to do today?</p>
            </div>
            <Input placeholder="Search..." startIcon={<Search className="h-4 w-4" />} />
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Notifications</CardTitle>
                <CardDescription className="text-xs">Manage your alerts</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between p-3 pt-0">
                <span className="text-sm">Push notifications</span>
                <Switch defaultChecked />
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Badge>Active</Badge>
              <Badge variant="secondary">3 new</Badge>
            </div>
            <Button className="w-full">Continue</Button>
            <Button variant="outline" className="w-full">Settings</Button>
          </div>
        </PhonePreview>
      </div>

      {/* Component grid */}
      <div>
        <h2 className="mb-6 text-2xl font-semibold">Components</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((c) => (
            <Link key={c.path} to={c.path}>
              <div className="group rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-accent/50">
                <h3 className="font-medium group-hover:text-primary">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
