import { normalizeProject } from "./normalizeProject";
import type { ImportProjectResult, ProjectValidationIssue } from "./types";
import { validateProject } from "./validateProject";

export function importProject(input: string | unknown): ImportProjectResult {
  let parsed: unknown = input;
  if (typeof input === "string") {
    try { parsed = JSON.parse(input) as unknown; }
    catch { const issue: ProjectValidationIssue = { code: "MALFORMED_JSON", path: "", message: "The selected file is not valid JSON.", severity: "error" }; return { success: false, errors: [issue], warnings: [] }; }
  }
  const normalized = normalizeProject(parsed);
  const validation = validateProject(normalized);
  if (!validation.valid) return { success: false, errors: validation.errors, warnings: validation.warnings };
  return { success: true, project: normalized as import("./types").SDStandardProject, warnings: validation.warnings };
}
