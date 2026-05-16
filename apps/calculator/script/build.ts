import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { cp, rm, readFile } from "fs/promises";
import { spawnSync } from "child_process";
import path from "path";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building knowledge base...");
  buildKnowledgeBase();
  await copyKnowledgeBase();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

function buildKnowledgeBase() {
  const root = path.resolve("..", "..");
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const command = process.platform === "win32" ? "cmd.exe" : npmCommand;
  const args =
    process.platform === "win32"
      ? ["/d", "/s", "/c", `call ${npmCommand} run docs:build`]
      : ["run", "docs:build"];

  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    throw new Error("npm run docs:build failed");
  }
}

async function copyKnowledgeBase() {
  const root = path.resolve("..", "..");
  const source = path.join(root, "docs", "book");
  const destination = path.resolve("dist", "public", "knowledge-base");

  await rm(destination, { recursive: true, force: true });
  await cp(source, destination, { recursive: true });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
