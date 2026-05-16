const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "public", "admin");
const target = path.join(root, "apps", "calculator", "client", "public", "admin");

if (!fs.existsSync(source)) {
  console.warn("Tina admin assets were not found at public/admin; skipping sync.");
  process.exit(0);
}

fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.cpSync(source, target, { recursive: true });

console.log("Synced Tina admin assets into apps/calculator/client/public/admin.");
