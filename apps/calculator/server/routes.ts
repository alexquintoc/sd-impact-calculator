import type { Express } from "express";
import type { Server } from "http";
import express from "express";
import fs from "fs";
import path from "path";
import { getAllBaselines, getBaseline, getBaselinesForProjectSlug } from "./baselines";
import { getAllProjects, getProject } from "./projects";
import { getAllUpdates, getUpdate } from "./updates";

function serveKnowledgeBase(app: Express) {
  const knowledgeBasePath = path.resolve(
    process.cwd(),
    "..",
    "..",
    "docs",
    "book",
  );

  if (!fs.existsSync(knowledgeBasePath)) {
    return;
  }

  app.use(
    "/knowledge-base",
    express.static(knowledgeBasePath, {
      extensions: ["html"],
      redirect: true,
    }),
  );
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/admin", (_req, res) => {
    res.redirect(302, "/admin/index.html");
  });

  app.get("/quick-project-scan", (_req, res) => {
    res.redirect(301, "/impact-snapshot");
  });

  app.get("/quick-project-scan/", (_req, res) => {
    res.redirect(301, "/impact-snapshot");
  });

  app.get("/quick-project-scan/embed", (req, res) => {
    const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    res.redirect(301, `/impact-snapshot/embed${query}`);
  });

  app.get("/quick-project-scan/embed/", (req, res) => {
    const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    res.redirect(301, `/impact-snapshot/embed${query}`);
  });

  app.get("/project-scan", (_req, res) => {
    res.redirect(301, "/impact-snapshot");
  });

  app.get("/project-scan/", (_req, res) => {
    res.redirect(301, "/impact-snapshot");
  });

  app.get("/api/projects", (_req, res) => {
    res.json({ projects: getAllProjects() });
  });

  app.get("/api/projects/:slug", (req, res) => {
    const project = getProject(req.params.slug);

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.json({
      project: {
        ...project,
        linkedBaselines: getBaselinesForProjectSlug(req.params.slug),
      },
    });
  });

  app.get("/api/baselines", (_req, res) => {
    res.json({ baselines: getAllBaselines() });
  });

  app.get("/api/baselines/:slug", (req, res) => {
    const baseline = getBaseline(req.params.slug);

    if (!baseline) {
      res.status(404).json({ message: "Baseline not found" });
      return;
    }

    res.json({ baseline });
  });
  app.get("/api/updates", (_req, res) => res.json({ updates: getAllUpdates() }));
  app.get("/api/updates/:slug", (req, res) => { const update = getUpdate(req.params.slug); if (!update) return res.status(404).json({ message: "Update not found" }); res.json({ update }); });

  serveKnowledgeBase(app);

  return httpServer;
}
