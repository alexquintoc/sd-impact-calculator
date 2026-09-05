import { PROJECT_STORAGE_KEY } from "./constants";
import { importProject } from "./importProject";
import type { ImportProjectResult, SDStandardProject } from "./types";
import { validateProject } from "./validateProject";

export const PROJECT_LIBRARY_KEY = "sd-standard:projects:v1";
export interface StorageLike { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }
interface Library { version: 1; activeId: string | null; records: Record<string, unknown> }
function resolveStorage(storage?: StorageLike): StorageLike | null {
  if (storage) return storage;
  try { return typeof window !== "undefined" ? window.localStorage : null; } catch { return null; }
}

// An atomic write commits saved records and the independent active pointer.
function read(target: StorageLike): Library {
  const raw = target.getItem(PROJECT_LIBRARY_KEY);
  if (raw !== null) {
    const value = JSON.parse(raw);
    if (value?.version !== 1 || (value.activeId !== null && typeof value.activeId !== "string") || !value.records || typeof value.records !== "object" || Array.isArray(value.records)) throw new Error("Invalid local project library");
    return value;
  }
  const legacy = target.getItem(PROJECT_STORAGE_KEY);
  if (legacy === null) return { version: 1, activeId: null, records: {} };
  const result = importProject(legacy);
  if (!result.success) throw new Error("Invalid legacy project");
  const id = result.project.project.id;
  const library: Library = { version: 1, activeId: id, records: { [id]: result.project } };
  // Commit before retiring the old key. If cleanup fails, the migrated library
  // still takes precedence, including after Close or Delete.
  target.setItem(PROJECT_LIBRARY_KEY, JSON.stringify(library));
  try { target.removeItem(PROJECT_STORAGE_KEY); } catch { /* A harmless recovery copy may remain. */ }
  return library;
}
function write(operation: (library: Library) => Library, storage?: StorageLike): boolean {
  const target = resolveStorage(storage); if (!target) return false;
  try { target.setItem(PROJECT_LIBRARY_KEY, JSON.stringify(operation(read(target)))); return true; } catch { return false; }
}
/** Saving edits never changes the active pointer. */
export function saveProjectLocally(project: SDStandardProject, storage?: StorageLike): boolean {
  if (!validateProject(project).valid) return false;
  return write((library) => ({ ...library, records: { ...library.records, [project.project.id]: project } }), storage);
}
export function activateProjectLocally(project: SDStandardProject, storage?: StorageLike): boolean {
  if (!validateProject(project).valid) return false;
  return write((library) => ({ ...library, activeId: project.project.id, records: { ...library.records, [project.project.id]: project } }), storage);
}
export function loadSavedProject(id: string, storage?: StorageLike): ImportProjectResult | null {
  const target = resolveStorage(storage); if (!target) return null;
  try { const library = read(target); return Object.prototype.hasOwnProperty.call(library.records, id) ? importProject(library.records[id]) : null; } catch { return null; }
}
export function loadProjectLocally(storage?: StorageLike): ImportProjectResult | null {
  const target = resolveStorage(storage); if (!target) return null;
  try { const library = read(target); return library.activeId === null ? null : importProject(library.records[library.activeId]); }
  catch { return importProject("{}"); }
}
export function closeProjectLocally(project: SDStandardProject, storage?: StorageLike): boolean {
  if (!validateProject(project).valid) return false;
  return write((library) => ({ ...library, activeId: null, records: { ...library.records, [project.project.id]: project } }), storage);
}
/** Delete only the active record, keeping all other saved projects. */
export function removeLocalProject(storage?: StorageLike): boolean {
  return write((library) => {
    const records = { ...library.records };
    if (library.activeId !== null) delete records[library.activeId];
    return { ...library, activeId: null, records };
  }, storage);
}
export function hasLocalProject(storage?: StorageLike): boolean {
  const target = resolveStorage(storage); if (!target) return false;
  try { return read(target).activeId !== null; } catch { return true; }
}
export function listSavedProjects(storage?: StorageLike): Array<{ id: string; title: string }> {
  const target = resolveStorage(storage); if (!target) return [];
  try { return Object.values(read(target).records).flatMap((value) => { const result = importProject(value); return result.success ? [{ id: result.project.project.id, title: result.project.project.title }] : []; }); } catch { return []; }
}
export function clearInvalidProjectStorage(storage?: StorageLike): boolean {
  const target = resolveStorage(storage); if (!target) return false;
  try {
    if (target.getItem(PROJECT_LIBRARY_KEY) !== null) return removeLocalProject(target);
    target.removeItem(PROJECT_STORAGE_KEY); return true;
  } catch { return false; }
}
