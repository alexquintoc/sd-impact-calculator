import assert from "node:assert/strict";
import { test } from "node:test";
import { createBlankProject } from "./createProject";
import { PROJECT_STORAGE_KEY } from "./constants";
import { activateProjectLocally, closeProjectLocally, loadProjectLocally, loadSavedProject, saveProjectLocally, removeLocalProject, PROJECT_LIBRARY_KEY, type StorageLike } from "./storage";
const project = (id: string) => createBlankProject({ id, title: id });
function memory() {
  const values = new Map<string, string>();
  let fail = false;
  const storage: StorageLike = { getItem: key => values.get(key) ?? null, setItem: (key, value) => { if (fail) throw new Error("quota"); values.set(key, value); }, removeItem: key => { values.delete(key); } };
  return { values, storage, fail: () => { fail = true; } };
}
test("legacy migration preserves content and is idempotent", () => {
  const { values, storage } = memory(); const original = project("legacy");
  values.set(PROJECT_STORAGE_KEY, JSON.stringify(original));
  assert.deepEqual(loadProjectLocally(storage), loadProjectLocally(storage));
  assert.equal(loadProjectLocally(storage)?.success, true);
  assert.ok(values.has(PROJECT_LIBRARY_KEY));
  assert.equal(values.has(PROJECT_STORAGE_KEY), false);
});
test("close saves latest edits and never reopens on subsequent load or save", () => {
  const { storage } = memory(); const current = project("one");
  assert.ok(activateProjectLocally(current, storage)); current.project.title = "Latest";
  assert.ok(closeProjectLocally(current, storage)); assert.equal(loadProjectLocally(storage), null);
  const saved = loadSavedProject("one", storage); assert.ok(saved?.success);
  if (saved?.success) assert.equal(saved.project.project.title, "Latest");
  assert.ok(saveProjectLocally(current, storage)); assert.equal(loadProjectLocally(storage), null);
});
test("create and import after close preserve previous records; deletion is selective", () => {
  const { storage } = memory(); const one = project("one"); const two = project("two");
  activateProjectLocally(one, storage); closeProjectLocally(one, storage); activateProjectLocally(two, storage);
  assert.ok(loadSavedProject("one", storage)?.success); assert.ok(removeLocalProject(storage));
  assert.equal(loadSavedProject("two", storage), null); assert.ok(loadSavedProject("one", storage)?.success);
  assert.equal(loadProjectLocally(storage), null);
});
test("close write failure preserves the active record", () => {
  const { storage, fail } = memory(); const one = project("one"); activateProjectLocally(one, storage); fail();
  assert.equal(closeProjectLocally(one, storage), false); assert.ok(loadProjectLocally(storage)?.success);
});
test("migration write failure and corrupt data never destroy the source", () => {
  const { storage, values, fail } = memory(); const raw = JSON.stringify(project("legacy"));
  values.set(PROJECT_STORAGE_KEY, raw); fail(); assert.equal(loadProjectLocally(storage)?.success, false);
  assert.equal(values.get(PROJECT_STORAGE_KEY), raw); assert.equal(values.has(PROJECT_LIBRARY_KEY), false);
  values.set(PROJECT_STORAGE_KEY, "broken"); assert.equal(loadProjectLocally(storage)?.success, false);
  assert.equal(activateProjectLocally(project("new"), storage), false); assert.equal(values.get(PROJECT_STORAGE_KEY), "broken");
});
test("migration backup cannot resurrect a closed or deleted project", () => {
  const { values, storage } = memory(); const one = project("one"); values.set(PROJECT_STORAGE_KEY, JSON.stringify(one));
  loadProjectLocally(storage); values.set(PROJECT_STORAGE_KEY, JSON.stringify(one));
  closeProjectLocally(one, storage); assert.equal(loadProjectLocally(storage), null);
  activateProjectLocally(one, storage); removeLocalProject(storage); assert.equal(loadProjectLocally(storage), null);
});
