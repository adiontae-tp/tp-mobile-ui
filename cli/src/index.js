#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "fs";
import { join, dirname, resolve } from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { registry } from "./registry.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const registryDir = join(__dirname, "..", "registry");

// ── Colors ──────────────────────────────────────────────────────────────
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;

// ── Helpers ─────────────────────────────────────────────────────────────
function detectPackageManager() {
  const cwd = process.cwd();
  if (existsSync(join(cwd, "bun.lockb")) || existsSync(join(cwd, "bun.lock"))) return "bun";
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

function installDeps(deps) {
  if (deps.length === 0) return;

  // Filter out already-installed deps
  const pkgPath = join(process.cwd(), "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    const installed = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
    deps = deps.filter((d) => !installed[d]);
  }
  if (deps.length === 0) return;

  const pm = detectPackageManager();
  const cmd =
    pm === "yarn"
      ? `yarn add ${deps.join(" ")}`
      : `${pm} install ${deps.join(" ")}`;

  console.log(dim(`  Installing: ${deps.join(", ")}...`));
  try {
    execSync(cmd, { stdio: "pipe", cwd: process.cwd() });
  } catch {
    console.log(yellow(`  ⚠ Could not auto-install. Run manually:`));
    console.log(dim(`    ${cmd}`));
  }
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function resolveComponentsDir() {
  // Look for src/ directory
  const cwd = process.cwd();
  const srcDir = join(cwd, "src");
  if (existsSync(srcDir)) {
    return join(srcDir, "components", "ui");
  }
  return join(cwd, "components", "ui");
}

function resolveLibDir() {
  const cwd = process.cwd();
  const srcDir = join(cwd, "src");
  if (existsSync(srcDir)) {
    return join(srcDir, "lib");
  }
  return join(cwd, "lib");
}

// ── Commands ────────────────────────────────────────────────────────────

function cmdInit() {
  console.log();
  console.log(bold("  mobile-ui init"));
  console.log();

  const componentsDir = resolveComponentsDir();
  const libDir = resolveLibDir();

  // 1. Create directories
  ensureDir(componentsDir);
  ensureDir(libDir);
  console.log(green("  ✓") + " Created " + dim(componentsDir));
  console.log(green("  ✓") + " Created " + dim(libDir));

  // 2. Copy utils.ts
  const utilsSrc = join(registryDir, "lib", "utils.ts");
  const utilsDest = join(libDir, "utils.ts");
  if (existsSync(utilsDest)) {
    console.log(yellow("  ○") + " lib/utils.ts already exists, skipping");
  } else {
    copyFileSync(utilsSrc, utilsDest);
    console.log(green("  ✓") + " Created lib/utils.ts");
  }

  // 3. Show CSS theme instructions
  const cssSource = join(registryDir, "app.css");
  if (existsSync(cssSource)) {
    const cssDest = resolve(componentsDir, "..", "..", "app.css");
    // Check if user has a main css file
    const possibleCss = ["app.css", "globals.css", "index.css"].map((f) =>
      join(dirname(componentsDir), "..", f)
    );
    const existingCss = possibleCss.find((f) => existsSync(f));

    if (existingCss) {
      console.log();
      console.log(
        yellow("  !") +
          " Add the theme variables from the CSS below to your existing stylesheet:"
      );
      console.log(dim(`    ${existingCss}`));
    } else {
      copyFileSync(cssSource, cssDest);
      console.log(green("  ✓") + " Created app.css with theme variables");
    }
  }

  // 4. Install base deps
  console.log();
  installDeps(["clsx", "tailwind-merge"]);

  console.log();
  console.log(green("  Done!") + " Your project is ready for mobile-ui components.");
  console.log();
  console.log("  Add components with:");
  console.log(cyan("    npx mobile-ui add button"));
  console.log();
}

function cmdAdd(componentNames) {
  if (componentNames.length === 0) {
    console.log(red("  Error:") + " Specify at least one component name.");
    console.log(dim("  Example: npx mobile-ui add button card"));
    process.exit(1);
  }

  // Resolve all components including internal dependencies
  const toInstall = new Set();
  const queue = [...componentNames];

  while (queue.length > 0) {
    const name = queue.pop();
    if (toInstall.has(name)) continue;

    const entry = registry[name];
    if (!entry) {
      console.log(red(`  Error:`) + ` Unknown component "${name}".`);
      console.log(dim("  Run ") + cyan("npx mobile-ui list") + dim(" to see available components."));
      process.exit(1);
    }

    toInstall.add(name);
    for (const dep of entry.internalDeps) {
      if (!toInstall.has(dep)) queue.push(dep);
    }
  }

  console.log();
  console.log(bold("  mobile-ui add"));
  console.log();

  const componentsDir = resolveComponentsDir();
  const libDir = resolveLibDir();
  ensureDir(componentsDir);
  ensureDir(libDir);

  // Ensure utils.ts exists
  const utilsDest = join(libDir, "utils.ts");
  if (!existsSync(utilsDest)) {
    const utilsSrc = join(registryDir, "lib", "utils.ts");
    copyFileSync(utilsSrc, utilsDest);
    console.log(green("  ✓") + " Created lib/utils.ts");
  }

  // Copy each component
  const allDeps = new Set();
  const added = [];
  const skipped = [];

  for (const name of toInstall) {
    const entry = registry[name];
    const src = join(registryDir, "ui", entry.file);
    const dest = join(componentsDir, entry.file);

    if (existsSync(dest)) {
      skipped.push(name);
      console.log(yellow("  ○") + ` ${entry.file} already exists, skipping`);
    } else {
      copyFileSync(src, dest);
      added.push(name);
      console.log(green("  ✓") + ` Added ${entry.file}`);
    }

    for (const dep of entry.dependencies) {
      allDeps.add(dep);
    }
  }

  // Install npm dependencies
  console.log();
  installDeps([...allDeps]);

  // Summary
  console.log();
  if (added.length > 0) {
    console.log(green("  Done!") + ` Added ${added.length} component${added.length > 1 ? "s" : ""}:`);
    for (const name of added) {
      const entry = registry[name];
      console.log(dim(`    components/ui/${entry.file}`));
    }
  }
  if (skipped.length > 0) {
    console.log(dim(`  Skipped ${skipped.length} existing: ${skipped.join(", ")}`));
  }

  // Show internal deps that were auto-added
  const autoDeps = [...toInstall].filter((n) => !componentNames.includes(n));
  if (autoDeps.length > 0) {
    console.log(dim(`  Auto-added dependencies: ${autoDeps.join(", ")}`));
  }

  console.log();
  console.log("  Import with:");
  for (const name of added) {
    const entry = registry[name];
    const importName = entry.file.replace(".tsx", "");
    console.log(cyan(`    import { ... } from "@/components/ui/${importName}"`));
  }
  console.log();
}

function cmdList() {
  console.log();
  console.log(bold("  Available components:"));
  console.log();

  const maxLen = Math.max(...Object.keys(registry).map((k) => k.length));

  for (const [name, entry] of Object.entries(registry)) {
    const padded = name.padEnd(maxLen + 2);
    console.log(`  ${cyan(padded)} ${dim(entry.description)}`);
  }

  console.log();
  console.log("  Add with: " + cyan("npx mobile-ui add <name> [name...]"));
  console.log("  Add all:  " + cyan("npx mobile-ui add --all"));
  console.log();
}

function cmdAddAll() {
  cmdAdd(Object.keys(registry));
}

function cmdHelp() {
  console.log();
  console.log(bold("  mobile-ui") + dim(" — mobile-first React + Tailwind components"));
  console.log();
  console.log("  " + bold("Commands:"));
  console.log();
  console.log(`  ${cyan("init")}                   Set up your project (utils, theme, directories)`);
  console.log(`  ${cyan("add <name...>")}          Add components to your project`);
  console.log(`  ${cyan("add --all")}              Add all components`);
  console.log(`  ${cyan("list")}                   Show available components`);
  console.log(`  ${cyan("help")}                   Show this help message`);
  console.log();
  console.log("  " + bold("Examples:"));
  console.log();
  console.log(dim("    npx mobile-ui init"));
  console.log(dim("    npx mobile-ui add button card input"));
  console.log(dim("    npx mobile-ui add bottom-sheet"));
  console.log(dim("    npx mobile-ui list"));
  console.log();
}

// ── Main ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "init":
    cmdInit();
    break;
  case "add":
    if (args.includes("--all")) {
      cmdAddAll();
    } else {
      cmdAdd(args.slice(1));
    }
    break;
  case "list":
  case "ls":
    cmdList();
    break;
  case "help":
  case "--help":
  case "-h":
  case undefined:
    cmdHelp();
    break;
  default:
    console.log(red(`  Unknown command: ${command}`));
    cmdHelp();
    process.exit(1);
}
