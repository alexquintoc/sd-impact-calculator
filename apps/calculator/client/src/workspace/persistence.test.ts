import assert from "node:assert/strict";
import { test } from "node:test";
import type { SDStandardProject } from "../../../../../packages/standard-core/src/project/types";
import type { SaveState } from "../../../../../packages/standard-core/src/project/workspace/types";
import { createPersistenceCoordinator } from "./persistence";

type FakeTimer = ReturnType<typeof setTimeout>;

function makeProject(title: string): SDStandardProject {
  return {
    schema: { name: "sd-standard-project", version: "0.1.0" },
    standard: { criteriaVersion: "criteria-v2", criteriaSource: "criteria.v2.json" },
    project: { id: title.toLowerCase(), title, description: "", stage: "planning", projectTypes: [], createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
    components: [], criteriaAssessments: [], projectNotes: "",
    application: { lastView: "overview", completedSections: [], exportedAt: null, generator: { name: "SD Standard", version: "" } },
  };
}

function harness(saveResult = true) {
  const callbacks = new Map<FakeTimer, () => void>();
  const states: SaveState[] = [];
  const saved: SDStandardProject[] = [];
  let timerId = 0;
  const coordinator = createPersistenceCoordinator({
    save(project) { saved.push(project); return saveResult; },
    onStateChange(state) { states.push(state); },
    setTimer(callback) { const id = ++timerId as unknown as FakeTimer; callbacks.set(id, callback); return id; },
    clearTimer(timer) { callbacks.delete(timer); },
  });
  return { callbacks, coordinator, saved, states };
}

test("debounced persistence saves only the latest project", () => {
  const first = makeProject("First");
  const second = makeProject("Second");
  const { callbacks, coordinator, saved, states } = harness();
  coordinator.schedule(first);
  coordinator.schedule(second);
  assert.equal(callbacks.size, 1);
  callbacks.values().next().value?.();
  assert.deepEqual(saved.map((project) => project.project.title), ["Second"]);
  assert.deepEqual(states, ["dirty", "dirty", "saving", "saved"]);
});

test("cancel prevents a stale project from being saved after replacement", () => {
  const { callbacks, coordinator, saved } = harness();
  coordinator.schedule(makeProject("Stale"));
  const staleCallback = callbacks.values().next().value;
  coordinator.cancel();
  staleCallback?.();
  assert.equal(saved.length, 0);
  assert.equal(coordinator.flush(makeProject("Imported")), true);
  assert.deepEqual(saved.map((project) => project.project.title), ["Imported"]);
});

test("persistence failures produce an error state", () => {
  const { coordinator, states } = harness(false);
  assert.equal(coordinator.flush(makeProject("Project")), false);
  assert.deepEqual(states, ["saving", "error"]);
});
