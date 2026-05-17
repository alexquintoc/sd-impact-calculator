import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { cp, rm, readFile } from "fs/promises";
import { spawnSync } from "child_process";
import path from "path";
import {
  getAllBaselines,
  getBaseline,
  getBaselinesForProjectSlug,
} from "../server/baselines";
import { getAllProjects, getProject } from "../server/projects";

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

  console.log("building static data...");
  await writeStaticData();

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

async function writeStaticData() {
  const outputRoot = path.resolve("dist", "public", "data");
  const projectsRoot = path.join(outputRoot, "projects");
  const baselinesRoot = path.join(outputRoot, "baselines");
  const projects = getAllProjects();
  const baselines = getAllBaselines();

  await rm(outputRoot, { recursive: true, force: true });
  await writeJson(path.join(outputRoot, "projects.json"), { projects });
  await writeJson(path.join(outputRoot, "baselines.json"), { baselines });

  await Promise.all(
    projects.map((project) => {
      const projectDetail = getProject(project.slug);
      return writeJson(path.join(projectsRoot, `${project.slug}.json`), {
        project: projectDetail
          ? {
              ...projectDetail,
              linkedBaselines: getBaselinesForProjectSlug(project.slug),
            }
          : project,
      });
    }),
  );

  await Promise.all(
    baselines.map((baseline) =>
      writeJson(path.join(baselinesRoot, `${baseline.slug}.json`), {
        baseline: getBaseline(baseline.slug) ?? baseline,
      }),
    ),
  );
}

async function writeJson(filePath: string, value: unknown) {
  const { mkdir, writeFile } = await import("fs/promises");

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
