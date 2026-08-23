import type { ExportProjectResult, SDStandardProject } from "./types";
import { validateProject } from "./validateProject";

export function safeProjectFilename(title: string): string {
  const slug = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
  return `sd-standard-project-${slug || "untitled"}.json`;
}
export function exportProject(project: SDStandardProject, now = new Date()): ExportProjectResult {
  const validation = validateProject(project);
  if (!validation.valid) throw new Error(`Cannot export an invalid project: ${validation.errors.map((item) => item.message).join(" ")}`);
  const exportedProject: SDStandardProject = { ...project, application: { ...project.application, exportedAt: now.toISOString(), generator: { ...project.application.generator } } };
  return { project: exportedProject, json: JSON.stringify(exportedProject, null, 2), filename: safeProjectFilename(project.project.title) };
}
