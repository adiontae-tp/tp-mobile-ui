import { copyFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, "src");
const dist = join(__dirname, "dist");
const registrySrc = join(__dirname, "..", "src");
const registryDest = join(__dirname, "registry");

// Copy CLI source to dist
mkdirSync(dist, { recursive: true });
for (const file of readdirSync(src)) {
  copyFileSync(join(src, file), join(dist, file));
}

// Copy component files to registry
mkdirSync(join(registryDest, "ui"), { recursive: true });
mkdirSync(join(registryDest, "lib"), { recursive: true });

const uiDir = join(registrySrc, "components", "ui");
for (const file of readdirSync(uiDir)) {
  copyFileSync(join(uiDir, file), join(registryDest, "ui", file));
}

copyFileSync(
  join(registrySrc, "lib", "utils.ts"),
  join(registryDest, "lib", "utils.ts")
);

if (existsSync(join(registrySrc, "app.css"))) {
  copyFileSync(join(registrySrc, "app.css"), join(registryDest, "app.css"));
}

console.log("CLI built successfully.");
console.log("Registry files copied.");
