import { PROJECT_STORAGE_KEY } from "./constants";
import { importProject } from "./importProject";
import type { ImportProjectResult, SDStandardProject } from "./types";
import { validateProject } from "./validateProject";

export interface StorageLike { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }
function resolveStorage(storage?: StorageLike): StorageLike | null {
  if (storage) return storage;
  try { return typeof window !== "undefined" && window.localStorage ? window.localStorage : null; } catch { return null; }
}
export function saveProjectLocally(project: SDStandardProject, storage?: StorageLike): boolean {
  const target = resolveStorage(storage); if (!target || !validateProject(project).valid) return false;
  try { target.setItem(PROJECT_STORAGE_KEY, JSON.stringify(project)); return true; } catch { return false; }
}
export function loadProjectLocally(storage?: StorageLike): ImportProjectResult | null {
  const target = resolveStorage(storage); if (!target) return null;
  try { const value = target.getItem(PROJECT_STORAGE_KEY); return value === null ? null : importProject(value); } catch { return null; }
}
export function removeLocalProject(storage?: StorageLike): boolean { const target = resolveStorage(storage); if (!target) return false; try { target.removeItem(PROJECT_STORAGE_KEY); return true; } catch { return false; } }
export function hasLocalProject(storage?: StorageLike): boolean { const target = resolveStorage(storage); if (!target) return false; try { return target.getItem(PROJECT_STORAGE_KEY) !== null; } catch { return false; } }
