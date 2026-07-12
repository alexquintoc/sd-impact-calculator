import assert from "node:assert/strict";
import test from "node:test";
import v2Criteria from "../../../../../../packages/standard-core/src/criteria.v2.json";
import type { CalculatorCriteriaData } from "../../calculator/registry";
import { analyzeProjectDescription } from "./scanProjectDescription";
import {
  getImpactSnapshotCriteriaVersion,
  getImpactSnapshotCriterionIds,
  parseImpactSnapshotImport,
  restoreImpactSnapshotState,
  serializeImpactSnapshot,
} from "./impactSnapshotImport";

const criteriaData = v2Criteria as CalculatorCriteriaData;
const criteriaVersion = getImpactSnapshotCriteriaVersion(criteriaData);
const validCriterionIds = getImpactSnapshotCriterionIds(criteriaData);
const context = {
  currentCriteriaVersion: criteriaVersion,
  validCriterionIds,
};

const description =
  "We designed a bilingual exhibition guide for a local museum. It was printed locally on recycled paper, used minimal ink coverage, and was developed through workshops with community members.";

function makeFixture() {
  return serializeImpactSnapshot(analyzeProjectDescription(description, criteriaData), criteriaVersion);
}

test("imports a current valid exported JSON file", () => {
  const fixture = makeFixture();
  const parsed = parseImpactSnapshotImport(JSON.stringify(fixture), context);

  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.value.snapshot.project.description, description);
  assert.deepEqual(parsed.value.warnings, []);
});

test("rejects invalid JSON syntax", () => {
  const parsed = parseImpactSnapshotImport("{not json", context);

  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.equal(parsed.reason, "invalid-json");
});

test("rejects an unrelated JSON object", () => {
  const parsed = parseImpactSnapshotImport(JSON.stringify({ hello: "world" }), context);

  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.equal(parsed.reason, "invalid-structure");
});

test("rejects missing required fields", () => {
  const fixture = makeFixture() as Record<string, unknown>;
  delete fixture.project;

  const parsed = parseImpactSnapshotImport(JSON.stringify(fixture), context);

  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.equal(parsed.reason, "missing-required-fields");
});

test("rejects incorrect field types", () => {
  const fixture = makeFixture();
  fixture.criteria = [{ ...fixture.criteria[0], confidence: 12 }];

  const parsed = parseImpactSnapshotImport(JSON.stringify(fixture), context);

  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.equal(parsed.reason, "incorrect-field-types");
});

test("rejects an unsupported schema version", () => {
  const fixture = { ...makeFixture(), schemaVersion: 999 };
  const parsed = parseImpactSnapshotImport(JSON.stringify(fixture), context);

  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.equal(parsed.reason, "unsupported-schema-version");
});

test("accepts the prior supported schema version without metadata", () => {
  const { schemaVersion, criteriaVersion: _criteriaVersion, exportedAt, ...legacyFixture } = makeFixture();
  const parsed = parseImpactSnapshotImport(JSON.stringify(legacyFixture), context);

  assert.equal(schemaVersion, 1);
  assert.equal(typeof exportedAt, "string");
  assert.equal(parsed.ok, true);
});

test("warns on criteria-version mismatch", () => {
  const fixture = { ...makeFixture(), criteriaVersion: "older-draft" };
  const parsed = parseImpactSnapshotImport(JSON.stringify(fixture), context);

  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.value.warnings[0]?.type, "criteria-version-mismatch");
});

test("warns on unknown criterion ids", () => {
  const fixture = makeFixture();
  fixture.criteria = [{ ...fixture.criteria[0], id: "NO-LONGER-EXISTS" }];

  const parsed = parseImpactSnapshotImport(JSON.stringify(fixture), context);

  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.deepEqual(parsed.value.unknownCriterionIds, ["NO-LONGER-EXISTS"]);
});

test("invalid imports do not replace existing state", () => {
  const current = makeFixture();
  const parsed = parseImpactSnapshotImport("[]", context);
  const next = parsed.ok ? restoreImpactSnapshotState(parsed.value, criteriaData) : current;

  assert.equal(next, current);
});

test("exporting and immediately importing restores an equivalent project state", () => {
  const fixture = makeFixture();
  const parsed = parseImpactSnapshotImport(JSON.stringify(fixture), context);

  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;

  const restored = restoreImpactSnapshotState(parsed.value, criteriaData);
  assert.equal(restored.project.description, fixture.project.description);
  assert.equal(restored.summary.totalLikelyCriteria, fixture.summary.totalLikelyCriteria);
  assert.equal(restored.summary.totalPossibleCriteria, fixture.summary.totalPossibleCriteria);
  assert.equal(restored.criteria.length, fixture.criteria.length);
});
