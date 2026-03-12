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
  { path: "/bottom-sheet", title: "Bottom Sheet", desc: "Draggable bottom panels with snap points." },
  { path: "/action-sheet", title: "Action Sheet", desc: "iOS-style action menus." },
  { path: "/toast", title: "Toast", desc: "Non-intrusive notifications." },
  { path: "/bottom-tabs", title: "Bottom Tabs", desc: "Tab bar with animated indicator and badges." },
  { path: "/toolbar-sheet", title: "Toolbar Sheet", desc: "Apple Maps-style persistent toolbar sheet." },
  { path: "/navigation", title: "Navigation", desc: "Stack, tabs, modals, and shared element transitions." },
  { path: "/view-switcher", title: "View Switcher", desc: "Render different UIs per viewport size." },
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

      {/* Getting Started */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Getting Started</h2>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">1. Initialize your project</h3>
          <p className="text-sm text-muted-foreground">
            Sets up the <code className="rounded bg-muted px-1.5 py-0.5 text-xs">@/components/ui</code> directory,
            installs shared dependencies, and configures path aliases.
          </p>
          <CodeBlock code={`npx mobile-ui init`} filename="terminal" />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">2. Add the components you need</h3>
          <p className="text-sm text-muted-foreground">
            Each component is copied into your project as source code. Add one or many at once.
          </p>
          <CodeBlock code={`npx mobile-ui add button card input navigation view-switcher`} filename="terminal" />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">3. Import and use them</h3>
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

      {/* Using with Desktop Libraries */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Using with Desktop Libraries</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Mobile UI is designed to coexist with desktop component libraries like shadcn/ui.
          Use the <Link to="/view-switcher" className="font-medium text-primary hover:underline">View Switcher</Link> to
          render different component trees per viewport — mobile-ui components on phones,
          shadcn or any other library on desktop.
        </p>
        <CodeBlock
          code={`import { View } from "@/components/ui/view-switcher"
import { MobileNav } from "./mobile-nav"     // mobile-ui components
import { DesktopNav } from "./desktop-nav"   // shadcn components

export function AppLayout({ children }) {
  return (
    <>
      <View.Mobile>
        <MobileNav />
      </View.Mobile>

      <View.Desktop>
        <DesktopNav />
      </View.Desktop>

      {children}
    </>
  )
}`}
          filename="app-layout.tsx"
        />
        <div className="rounded-lg border bg-muted/30 p-4 text-sm">
          <p className="font-medium">Breakpoints</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li><code className="rounded bg-muted px-1.5 py-0.5 text-xs">View.Mobile</code> — below 768px</li>
            <li><code className="rounded bg-muted px-1.5 py-0.5 text-xs">View.Tablet</code> — 768px to 1023px</li>
            <li><code className="rounded bg-muted px-1.5 py-0.5 text-xs">View.Desktop</code> — 1024px and above</li>
            <li><code className="rounded bg-muted px-1.5 py-0.5 text-xs">View.MobileAndTablet</code> — below 1024px</li>
            <li><code className="rounded bg-muted px-1.5 py-0.5 text-xs">View.TabletAndDesktop</code> — 768px and above</li>
          </ul>
          <p className="mt-2 text-muted-foreground">
            These are CSS-only — zero JavaScript, no hydration flash. For imperative logic,
            use the <code className="rounded bg-muted px-1.5 py-0.5 text-xs">useViewport()</code> hook.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Navigation</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A complete mobile navigation system with platform-detected transitions — iOS slide with swipe-back,
          Android fade-up. Composable: nest tabs inside stacks, present modals over tabs.
          See the <Link to="/navigation" className="font-medium text-primary hover:underline">Navigation</Link> docs for the full API.
        </p>
        <CodeBlock
          code={`import {
  StackNavigator, TabNavigator, ModalNavigator,
  useNavigation, useRoute,
} from "@/components/ui/navigation"

<ModalNavigator>
  <ModalNavigator.Screen name="compose" component={ComposeModal} />

  <TabNavigator initialTab="home">
    <TabNavigator.Tab name="home" icon={<Home />} label="Home">
      <StackNavigator initialRoute="feed">
        <StackNavigator.Screen name="feed" component={Feed} title="Feed" />
        <StackNavigator.Screen name="post" component={Post} title="Post" />
      </StackNavigator>
    </TabNavigator.Tab>

    <TabNavigator.Tab name="profile" icon={<User />} label="Profile">
      <ProfileScreen />
    </TabNavigator.Tab>
  </TabNavigator>
</ModalNavigator>`}
          filename="app-shell.tsx"
        />
      </div>

      {/* MCP Server */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">AI / LLM Integration</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Mobile UI ships with an MCP server that lets AI assistants explore the component library,
          read source code and props, understand the theme, and scaffold new components.
        </p>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Claude Desktop</h3>
          <p className="text-sm text-muted-foreground">
            Add this to your <code className="rounded bg-muted px-1.5 py-0.5 text-xs">claude_desktop_config.json</code>:
          </p>
          <CodeBlock
            code={`{
  "mcpServers": {
    "mobile-ui": {
      "command": "node",
      "args": ["/path/to/mobile-ui/mcp-server/server.js"]
    }
  }
}`}
            filename="claude_desktop_config.json"
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Claude Code</h3>
          <p className="text-sm text-muted-foreground">
            Add the MCP server from the project directory:
          </p>
          <CodeBlock
            code={`claude mcp add mobile-ui node mcp-server/server.js`}
            filename="terminal"
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">CLAUDE.md</h3>
          <p className="text-sm text-muted-foreground">
            The repo includes a <code className="rounded bg-muted px-1.5 py-0.5 text-xs">CLAUDE.md</code> file
            at the root with full project context — structure, components, patterns, and conventions.
            Claude Code and other LLM tools will automatically read this when working in the repo.
          </p>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4 text-sm">
          <p className="font-medium">Available MCP Tools</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li><code className="rounded bg-muted px-1.5 py-0.5 text-xs">list_components</code> — List all components with file paths</li>
            <li><code className="rounded bg-muted px-1.5 py-0.5 text-xs">get_component</code> — Get source, exports, and props for a component</li>
            <li><code className="rounded bg-muted px-1.5 py-0.5 text-xs">get_theme</code> — Get CSS variables, colors, breakpoints</li>
            <li><code className="rounded bg-muted px-1.5 py-0.5 text-xs">get_demo</code> — Get demo page and preview source</li>
            <li><code className="rounded bg-muted px-1.5 py-0.5 text-xs">scaffold_component</code> — Generate boilerplate for a new component</li>
            <li><code className="rounded bg-muted px-1.5 py-0.5 text-xs">get_project_structure</code> — Get full project overview and conventions</li>
          </ul>
        </div>
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
