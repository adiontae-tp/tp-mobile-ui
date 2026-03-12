#!/usr/bin/env node

/**
 * MCP Server for mobile-ui component library.
 *
 * Provides tools for LLMs to explore, understand, and scaffold components.
 * Protocol: JSON-RPC over stdio (MCP specification 2024-11-05).
 *
 * Usage:
 *   node mcp-server/server.js
 *
 * Claude Desktop config (claude_desktop_config.json):
 *   {
 *     "mcpServers": {
 *       "mobile-ui": {
 *         "command": "node",
 *         "args": ["<path-to-repo>/mcp-server/server.js"]
 *       }
 *     }
 *   }
 */

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname, basename, resolve } from "path";
import { createInterface } from "readline";

// ── Paths ───────────────────────────────────────────────────────────

const ROOT = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")));
const PROJECT_ROOT = resolve(ROOT, "..");
const UI_DIR = join(PROJECT_ROOT, "src", "components", "ui");
const NAV_DIR = join(UI_DIR, "navigation");
const DEMO_DIR = join(PROJECT_ROOT, "src", "demo");
const PAGES_DIR = join(DEMO_DIR, "pages");
const PREVIEWS_DIR = join(DEMO_DIR, "previews");
const HOOKS_DIR = join(PROJECT_ROOT, "src", "hooks");
const LIB_DIR = join(PROJECT_ROOT, "src", "lib");

// ── Component Registry ──────────────────────────────────────────────

function getComponents() {
  const components = [];

  // Top-level UI components
  const files = readdirSync(UI_DIR).filter(
    (f) => f.endsWith(".tsx") && !f.startsWith(".")
  );
  for (const file of files) {
    const name = file.replace(".tsx", "");
    components.push({
      name,
      file: `src/components/ui/${file}`,
      type: "component",
    });
  }

  // Navigation sub-components
  if (existsSync(NAV_DIR)) {
    const navFiles = readdirSync(NAV_DIR).filter(
      (f) => (f.endsWith(".tsx") || f.endsWith(".ts")) && !f.startsWith(".")
    );
    for (const file of navFiles) {
      const name = `navigation/${file.replace(/\.(tsx?|ts)$/, "")}`;
      components.push({
        name,
        file: `src/components/ui/navigation/${file}`,
        type: "navigation",
      });
    }
  }

  return components;
}

function getComponentSource(name) {
  // Try direct match
  let filePath = join(UI_DIR, `${name}.tsx`);
  if (existsSync(filePath)) return readFileSync(filePath, "utf-8");

  // Try navigation subdir
  filePath = join(NAV_DIR, `${name}.tsx`);
  if (existsSync(filePath)) return readFileSync(filePath, "utf-8");
  filePath = join(NAV_DIR, `${name}.ts`);
  if (existsSync(filePath)) return readFileSync(filePath, "utf-8");

  return null;
}

function getExports(source) {
  const exports = [];
  const exportRe = /export\s+(?:function|const|class|type|interface)\s+(\w+)/g;
  let m;
  while ((m = exportRe.exec(source))) {
    exports.push(m[1]);
  }
  // Also catch `export { Foo, Bar }`
  const namedRe = /export\s*\{([^}]+)\}/g;
  while ((m = namedRe.exec(source))) {
    m[1].split(",").forEach((s) => {
      const name = s.trim().split(/\s+as\s+/).pop().trim();
      if (name) exports.push(name);
    });
  }
  return [...new Set(exports)];
}

function getProps(source) {
  const props = [];
  // Match interface lines with JSDoc comments
  const interfaceRe = /interface\s+\w*Props[^{]*\{([^}]+)\}/gs;
  let m;
  while ((m = interfaceRe.exec(source))) {
    const body = m[1];
    const propRe = /(?:\/\*\*\s*(.*?)\s*\*\/\s*)?(\w+)(\?)?:\s*([^;]+);/g;
    let p;
    while ((p = propRe.exec(body))) {
      props.push({
        name: p[2],
        optional: !!p[3],
        type: p[4].trim(),
        description: p[1] || "",
      });
    }
  }
  return props;
}

// ── Tool Implementations ────────────────────────────────────────────

const tools = {
  list_components: {
    description:
      "List all available mobile-ui components with their file paths and types.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler() {
      const components = getComponents();
      const grouped = { component: [], navigation: [] };
      for (const c of components) {
        grouped[c.type]?.push(c) ?? (grouped[c.type] = [c]);
      }
      return {
        total: components.length,
        components: grouped.component?.map((c) => `${c.name} — ${c.file}`) ?? [],
        navigation: grouped.navigation?.map((c) => `${c.name} — ${c.file}`) ?? [],
      };
    },
  },

  get_component: {
    description:
      "Get the full source code, exports, and props for a component. Pass the component name (e.g. 'button', 'bottom-sheet', 'navigation/stack-navigator').",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Component name, e.g. 'button', 'header', 'navigation/types'",
        },
      },
      required: ["name"],
    },
    handler({ name }) {
      const source = getComponentSource(name);
      if (!source) {
        return { error: `Component "${name}" not found. Use list_components to see available components.` };
      }
      return {
        name,
        exports: getExports(source),
        props: getProps(source),
        source,
      };
    },
  },

  get_theme: {
    description:
      "Get the project's theme configuration: CSS variables, color tokens, spacing, animations, and breakpoints.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler() {
      const css = readFileSync(join(PROJECT_ROOT, "src", "app.css"), "utf-8");
      return {
        file: "src/app.css",
        breakpoints: {
          mobile: "< 768px",
          tablet: "768px – 1023px (md:)",
          desktop: ">= 1024px (lg:)",
        },
        touchTarget: "2.75rem (44px) — use min-h-touch",
        safeAreas: "pb-safe-bottom, pt-safe-top, pl-safe-left, pr-safe-right",
        source: css,
      };
    },
  },

  get_demo: {
    description:
      "Get the demo page and/or preview source for a component. Useful for understanding usage patterns.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Component name in kebab-case, e.g. 'button', 'bottom-sheet', 'navigation'",
        },
      },
      required: ["name"],
    },
    handler({ name }) {
      const pascal = name
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("");
      const result = { name };

      const demoPath = join(PAGES_DIR, `${pascal}Demo.tsx`);
      if (existsSync(demoPath)) {
        result.demo = readFileSync(demoPath, "utf-8");
        result.demoFile = `src/demo/pages/${pascal}Demo.tsx`;
      }

      const previewPath = join(PREVIEWS_DIR, `${pascal}Preview.tsx`);
      if (existsSync(previewPath)) {
        result.preview = readFileSync(previewPath, "utf-8");
        result.previewFile = `src/demo/previews/${pascal}Preview.tsx`;
      }

      if (!result.demo && !result.preview) {
        return { error: `No demo or preview found for "${name}". Check the name is in kebab-case.` };
      }
      return result;
    },
  },

  scaffold_component: {
    description:
      "Generate the boilerplate files for a new mobile-ui component: the component file, preview, demo page. Does NOT modify App.tsx or DemoShell — you must register routes manually.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Component name in kebab-case, e.g. 'date-picker'",
        },
        description: {
          type: "string",
          description: "One-line description of the component",
        },
      },
      required: ["name", "description"],
    },
    handler({ name, description }) {
      const pascal = name
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("");

      const componentPath = join(UI_DIR, `${name}.tsx`);
      const previewPath = join(PREVIEWS_DIR, `${pascal}Preview.tsx`);
      const demoPath = join(PAGES_DIR, `${pascal}Demo.tsx`);

      const created = [];

      if (!existsSync(componentPath)) {
        writeFileSync(
          componentPath,
          `import * as React from "react";
import { cn } from "@/lib/utils";

interface ${pascal}Props extends React.HTMLAttributes<HTMLDivElement> {
  // Add props here
}

const ${pascal} = React.forwardRef<HTMLDivElement, ${pascal}Props>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("", className)}
      {...props}
    >
      {children}
    </div>
  )
);
${pascal}.displayName = "${pascal}";

export { ${pascal} };
`
        );
        created.push(`src/components/ui/${name}.tsx`);
      }

      if (!existsSync(previewPath)) {
        writeFileSync(
          previewPath,
          `import { ${pascal} } from "@/components/ui/${name}";

export function ${pascal}Preview() {
  return (
    <div className="space-y-6 p-4">
      <div>
        <p className="text-lg font-semibold">${pascal}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          ${description}
        </p>
      </div>

      <${pascal}>
        {/* Preview content */}
      </${pascal}>
    </div>
  );
}
`
        );
        created.push(`src/demo/previews/${pascal}Preview.tsx`);
      }

      if (!existsSync(demoPath)) {
        writeFileSync(
          demoPath,
          `import { ComponentPage } from "@/demo/ComponentPage";
import { ${pascal}Preview } from "@/demo/previews/${pascal}Preview";

const usage = \`import { ${pascal} } from "@/components/ui/${name}"

<${pascal}>
  {/* content */}
</${pascal}>\`;

export function ${pascal}Demo() {
  return (
    <ComponentPage
      title="${pascal}"
      description="${description}"
      usage={usage}
    >
      <${pascal}Preview />
    </ComponentPage>
  );
}
`
        );
        created.push(`src/demo/pages/${pascal}Demo.tsx`);
      }

      return {
        created,
        nextSteps: [
          `Add route imports and <Route> entries to src/App.tsx`,
          `Add to sidebar in src/demo/DemoShell.tsx (navSections)`,
          `Add to src/demo/pages/PreviewIndex.tsx`,
        ],
      };
    },
  },

  get_project_structure: {
    description:
      "Get an overview of the project structure, tech stack, and conventions. Start here to understand the codebase.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler() {
      const claudemd = existsSync(join(PROJECT_ROOT, "CLAUDE.md"))
        ? readFileSync(join(PROJECT_ROOT, "CLAUDE.md"), "utf-8")
        : null;

      const pkg = JSON.parse(
        readFileSync(join(PROJECT_ROOT, "package.json"), "utf-8")
      );

      return {
        name: pkg.name,
        version: pkg.version,
        stack: {
          runtime: "React 19 + TypeScript",
          styling: "Tailwind CSS v4",
          animation: "framer-motion",
          bundler: "Vite",
          ui_primitives: "Radix UI",
        },
        scripts: pkg.scripts,
        conventions: claudemd || "See CLAUDE.md in the project root for full conventions.",
      };
    },
  },
};

// ── MCP Protocol Handler ────────────────────────────────────────────

const SERVER_INFO = {
  name: "mobile-ui",
  version: "0.1.0",
};

const CAPABILITIES = {
  tools: {},
};

function handleRequest(method, params) {
  switch (method) {
    case "initialize":
      return {
        protocolVersion: "2024-11-05",
        serverInfo: SERVER_INFO,
        capabilities: CAPABILITIES,
      };

    case "notifications/initialized":
      return undefined; // notification, no response

    case "tools/list":
      return {
        tools: Object.entries(tools).map(([name, t]) => ({
          name,
          description: t.description,
          inputSchema: t.inputSchema,
        })),
      };

    case "tools/call": {
      const { name, arguments: args } = params;
      const tool = tools[name];
      if (!tool) {
        return {
          isError: true,
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
        };
      }
      try {
        const result = tool.handler(args || {});
        return {
          content: [
            {
              type: "text",
              text: typeof result === "string" ? result : JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          isError: true,
          content: [{ type: "text", text: `Error: ${err.message}` }],
        };
      }
    }

    default:
      throw { code: -32601, message: `Method not found: ${method}` };
  }
}

// ── stdio transport ─────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin });
let buffer = "";

process.stdin.setEncoding("utf-8");

rl.on("line", (line) => {
  try {
    const msg = JSON.parse(line);
    const { id, method, params } = msg;

    const result = handleRequest(method, params);

    // Notifications (no id) don't get a response
    if (id !== undefined && result !== undefined) {
      const response = JSON.stringify({ jsonrpc: "2.0", id, result });
      process.stdout.write(response + "\n");
    } else if (id !== undefined) {
      // Still need to respond to requests even if handler returned undefined
      const response = JSON.stringify({ jsonrpc: "2.0", id, result: {} });
      process.stdout.write(response + "\n");
    }
  } catch (err) {
    if (err.code) {
      // JSON-RPC error
      const response = JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: { code: err.code, message: err.message },
      });
      process.stdout.write(response + "\n");
    }
    // Silently ignore parse errors on non-JSON lines
  }
});

process.stderr.write("mobile-ui MCP server started\n");
