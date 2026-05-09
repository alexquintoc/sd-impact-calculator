const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const calculatorDist = path.join(root, "apps", "calculator", "dist", "public");
const briefGeneratorDist = path.join(root, "apps", "brief-generator", "dist");
const docsBookDir = path.join(root, "docs", "book");
const docsSourceDir = path.join(root, "docs", "src");

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function resolveCommand(command, args) {
  if (process.platform === "win32" && command === npmCommand) {
    return {
      command: "cmd.exe",
      args: ["/d", "/s", "/c", `call ${npmCommand} ${args.join(" ")}`],
    };
  }

  return { command, args };
}

function createEnv(overrides = {}) {
  const env = {};
  const seen = new Set();

  for (const [key, value] of Object.entries(process.env)) {
    const normalizedKey = process.platform === "win32" ? key.toLowerCase() : key;

    if (seen.has(normalizedKey)) continue;

    seen.add(normalizedKey);
    env[key] = value;
  }

  return { ...env, ...overrides };
}

function run(command, args, options = {}) {
  const resolved = resolveCommand(command, args);
  const result = spawnSync(resolved.command, resolved.args, {
    cwd: options.cwd ?? root,
    env: createEnv(options.env),
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
}

function runOptional(command, args, options = {}) {
  const resolved = resolveCommand(command, args);
  const result = spawnSync(resolved.command, resolved.args, {
    cwd: options.cwd ?? root,
    env: createEnv(options.env),
    stdio: "inherit",
    shell: false,
  });

  return result.status === 0;
}

function copyDirectory(source, destination) {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing build output: ${source}`);
  }

  fs.mkdirSync(destination, { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
}

function writeIndexPage() {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SD Standard</title>
    <style>
      :root {
        --accent: #28775e;
        --accent-strong: #1f604d;
        --background: #f7f5ef;
        --border: #d9d4c8;
        --focus: #85bba8;
        --shadow: 0 18px 50px rgba(45, 39, 28, 0.08);
        --surface: #fffdf8;
        --text: #5f5a50;
        --text-strong: #1f241f;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: var(--text);
        background: var(--background);
      }

      * { box-sizing: border-box; }
      body { min-width: 320px; min-height: 100vh; margin: 0; }
      main {
        display: flex;
        min-height: 100vh;
        width: min(1120px, calc(100% - 32px));
        margin: 0 auto;
        padding: 56px 0;
        flex-direction: column;
        justify-content: center;
      }
      .eyebrow {
        color: var(--accent);
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        margin: 0 0 6px;
        text-transform: uppercase;
      }
      h1, h2, strong { color: var(--text-strong); }
      h1 {
        max-width: 760px;
        margin: 8px 0 14px;
        font-size: clamp(2.4rem, 7vw, 4.7rem);
        line-height: 0.98;
        letter-spacing: 0;
      }
      h2 { margin: 0 0 14px; font-size: 1.55rem; line-height: 1.2; }
      p { margin: 0; line-height: 1.65; }
      .subtitle { max-width: 760px; font-size: 1.1rem; line-height: 1.6; }
      .resource-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 20px;
        margin-top: 44px;
      }
      .resource-card {
        display: flex;
        min-height: 280px;
        flex-direction: column;
        justify-content: space-between;
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 28px;
        color: inherit;
        background: var(--surface);
        box-shadow: var(--shadow);
        text-decoration: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
      }
      .resource-card:hover {
        border-color: var(--accent);
        box-shadow: 0 24px 60px rgba(45, 39, 28, 0.12);
        transform: translateY(-4px);
      }
      .resource-card:focus-visible {
        outline: 3px solid var(--focus);
        outline-offset: 3px;
      }
      .resource-card__accent {
        display: block;
        width: 64px;
        height: 8px;
        margin-bottom: 24px;
        border-radius: 999px;
        background: var(--accent);
      }
      .resource-card strong {
        margin-top: 36px;
        color: var(--accent);
      }
      @media (max-width: 820px) {
        main { padding: 36px 0; }
        .resource-grid { grid-template-columns: 1fr; }
        .resource-card { min-height: 220px; }
      }
    </style>
  </head>
  <body>
    <main>
      <section>
        <p class="eyebrow">Sustainable Design Standard</p>
        <h1>SD Standard</h1>
        <p class="subtitle">Tools and resources for applying sustainable design criteria to communication design projects.</p>
      </section>
      <section class="resource-grid" aria-label="SD Standard resources">
        <a class="resource-card" href="/knowledge-base/">
          <span>
            <span class="resource-card__accent"></span>
            <h2>Knowledge Base</h2>
            <p>Explore the SD Standard criteria, terms, and guidance notes.</p>
          </span>
          <strong>Open Knowledge Base -&gt;</strong>
        </a>
        <a class="resource-card" href="/calculator/">
          <span>
            <span class="resource-card__accent"></span>
            <h2>Impact Calculator</h2>
            <p>Evaluate a design project against the SD Standard criteria.</p>
          </span>
          <strong>Open Impact Calculator -&gt;</strong>
        </a>
        <a class="resource-card" href="/brief-generator/">
          <span>
            <span class="resource-card__accent"></span>
            <h2>Design Brief Generator</h2>
            <p>Generate ambitious design brief concepts by balancing environment, society, culture, and finance.</p>
          </span>
          <strong>Open Brief Generator -&gt;</strong>
        </a>
      </section>
    </main>
  </body>
</html>
`;

  fs.writeFileSync(path.join(distDir, "index.html"), html, "utf8");
}

function writeRedirects() {
  const redirects = [
    "/calculator/* /calculator/index.html 200",
    "/brief-generator/* /brief-generator/index.html 200",
    "",
  ].join("\n");

  fs.writeFileSync(path.join(distDir, "_redirects"), redirects, "utf8");
}

function getSummaryLinks() {
  const summaryPath = path.join(docsSourceDir, "SUMMARY.md");

  if (!fs.existsSync(summaryPath)) {
    return [];
  }

  const summary = fs.readFileSync(summaryPath, "utf8");
  const links = [];
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkPattern.exec(summary))) {
    const [, label, href] = match;

    if (href.startsWith("http")) continue;

    links.push({
      label,
      href: href.replace(/\.md($|#)/, ".html$1"),
    });
  }

  return links;
}

function writeFallbackKnowledgeBase(destination) {
  const links = getSummaryLinks();
  const introPath = path.join(docsSourceDir, "README.md");
  const intro = fs.existsSync(introPath)
    ? fs
        .readFileSync(introPath, "utf8")
        .split("\n")
        .filter((line) => line.trim() && !line.startsWith("#"))
        .slice(0, 2)
        .join(" ")
    : "Explore the SD Standard criteria, terms, and guidance notes.";

  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(
    path.join(destination, "index.html"),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SD Standard Knowledge Base</title>
    <style>
      :root {
        --accent: #28775e;
        --background: #f7f5ef;
        --border: #d9d4c8;
        --surface: #fffdf8;
        --text: #5f5a50;
        --text-strong: #1f241f;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: var(--text);
        background: var(--background);
      }
      * { box-sizing: border-box; }
      body { margin: 0; }
      main { width: min(960px, calc(100% - 32px)); margin: 0 auto; padding: 56px 0; }
      a { color: var(--accent); font-weight: 700; }
      h1, h2 { color: var(--text-strong); }
      h1 { margin: 0 0 16px; font-size: clamp(2.4rem, 7vw, 4.7rem); line-height: 0.98; }
      p { max-width: 720px; line-height: 1.65; }
      ul { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); padding: 0; list-style: none; }
      li { border: 1px solid var(--border); border-radius: 8px; padding: 14px 16px; background: var(--surface); }
    </style>
  </head>
  <body>
    <main>
      <a href="/">Back to SD Standard</a>
      <h1>Knowledge Base</h1>
      <p>${intro}</p>
      <h2>Reference Pages</h2>
      <ul>
        ${links
          .map((link) => `<li><a href="${link.href}">${link.label}</a></li>`)
          .join("\n        ")}
      </ul>
    </main>
  </body>
</html>
`,
    "utf8",
  );
}

function buildKnowledgeBase(destination) {
  const builtDocs = runOptional(npmCommand, ["run", "docs:build"]);

  if (builtDocs || fs.existsSync(docsBookDir)) {
    copyDirectory(docsBookDir, destination);
    return;
  }

  console.warn(
    "Knowledge base build failed and docs/book was unavailable. Writing a simple fallback index from docs/src.",
  );
  writeFallbackKnowledgeBase(destination);
}

function buildSite() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });

  console.log("building root index page...");
  writeIndexPage();

  console.log("building impact calculator...");
  run(npmCommand, ["--workspace", "apps/calculator", "run", "build"], {
    env: { VITE_BASE_PATH: "/calculator/" },
  });
  copyDirectory(calculatorDist, path.join(distDir, "calculator"));

  console.log("building brief generator...");
  run(npmCommand, ["--workspace", "apps/brief-generator", "run", "build"], {
    env: { VITE_BASE_PATH: "/brief-generator/" },
  });
  copyDirectory(briefGeneratorDist, path.join(distDir, "brief-generator"));

  console.log("building or copying knowledge base...");
  buildKnowledgeBase(path.join(distDir, "knowledge-base"));

  writeRedirects();
  console.log("unified site built in dist/");
}

buildSite();
