import type { Express } from "express";
import type { Server } from "http";
import express from "express";
import fs from "fs";
import path from "path";

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
  serveKnowledgeBase(app);

  // Static app - no API routes required.
  return httpServer;
}
