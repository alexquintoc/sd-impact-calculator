# SD Standard project files

This module defines the portable SD Standard project format. Schema version `0.1.0` stores project metadata, stages and types, components, criterion assessments, strategies, notes, and application/export metadata.

Version 0.1 intentionally excludes evidence uploads, accounts, cloud storage, collaborators, automated reports, suppliers, organization profiles, full calculations, and public sharing.

```ts
import { createBlankProject, exportProject, importProject, validateProject } from "@sd-standard/standard-core";

const project = createBlankProject({ title: "New project", stage: "planning", projectTypes: ["print"] });
const validation = validateProject(project);
const exported = exportProject(project);
const imported = importProject(exported.json);
```

Criterion assessments store only IDs. `criteria.v2.json` remains the source of criterion labels, descriptions, pillars, and scoring information. Validation rejects IDs that are absent from that file.

The four assessment concepts are distinct:

- **Relevance** describes how strongly a criterion applies to the project.
- **Criterion status** describes progress reviewing or implementing that criterion.
- **Assessment response** describes the level of assessment evidence or improvement.
- **Strategy status** describes the decision and delivery state of one strategy.

`saveProjectLocally`, `loadProjectLocally`, `hasLocalProject`, and `removeLocalProject` use the versioned key `sd-standard:project:v0.1`. They are safe during server rendering and validate stored data before returning it.

Future schema versions should be added through explicit migrations. Import should identify the source version, migrate into a new object without destroying unknown fields, validate the result, and retain older readers/tests for as long as those versions remain supported.

## Workspace actions and selectors

The `workspace` export contains immutable actions for project metadata, components, assessments, scopes, and strategies. UI code should use these actions rather than editing nested objects directly. Derived component, assessment, strategy, status, pillar, and reference counts are selectors and are never stored in project JSON.

The React workspace uses the same project object and storage key. Navigation, filters, selected criteria, dialogs, and import previews remain temporary interface state. Meaningful project actions update `updatedAt`; interface-only changes do not.
