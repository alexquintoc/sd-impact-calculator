import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { WorkspaceProvider, useWorkspace } from "./WorkspaceProvider";
import { loadSavedProject } from "../../../../../packages/standard-core/src/project/storage";
(globalThis as unknown as { React: typeof React }).React = React;
test("provider migrates, updates titles, closes without reopening, and preserves records", () => {
  const values = new Map<string, string>(); let fail = false;
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { if (fail) throw new Error("quota"); values.set(key, value); }, removeItem: (key: string) => values.delete(key) };
  Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: storage } });
  let workspace!: ReturnType<typeof useWorkspace>;
  function Probe() { workspace = useWorkspace(); return null; }
  let renderer!: ReactTestRenderer;
  const mount = () => act(() => { renderer = create(React.createElement(WorkspaceProvider, { children: React.createElement(Probe) })); });
  try {
    mount(); assert.equal(workspace.project, null);
    act(() => { assert.ok(workspace.createNewProject({ title: "One", id: "one" })); });
    act(() => workspace.updateProjectMetadata({ title: "Edited" })); assert.equal(workspace.project?.project.title, "Edited");
    fail = true; act(() => { assert.equal(workspace.closeProject(), false); }); assert.equal(workspace.project?.project.title, "Edited");
    fail = false; act(() => { assert.ok(workspace.closeProject()); }); assert.equal(workspace.project, null);
    act(() => renderer.unmount()); mount(); assert.equal(workspace.project, null);
    const saved = loadSavedProject("one", storage); assert.ok(saved?.success); if (saved?.success) assert.equal(saved.project.project.title, "Edited");
    act(() => { workspace.createNewProject({ title: "Two", id: "two" }); });
    assert.ok(loadSavedProject("one", storage)?.success);
    act(() => { workspace.clearProject(); }); assert.equal(workspace.project, null); assert.ok(loadSavedProject("one", storage)?.success);
    act(() => { assert.ok(workspace.reopenProject("one")); }); assert.equal(workspace.project?.project.title, "Edited");
  } finally { act(() => renderer.unmount()); Reflect.deleteProperty(globalThis, "window"); }
});
