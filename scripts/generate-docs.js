const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const criteriaPath = path.join(
  root,
  "packages",
  "standard-core",
  "src",
  "criteria.json"
);

const termsPath = path.join(
  root,
  "packages",
  "standard-core",
  "src",
  "terms.json"
);

const docsGeneratedDir = path.join(root, "docs", "src", "generated");
const docsCriteriaDir = path.join(docsGeneratedDir, "criteria");
const docsTermsDir = path.join(docsGeneratedDir, "terms");
const docsPillarsDir = path.join(docsGeneratedDir, "pillars");

const criteriaMetaPath = path.join(
  root,
  "packages",
  "standard-core",
  "src",
  "generated",
  "criteria-meta.json"
);

const GENERATED_WARNING = [
  "<!-- AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY. -->",
  "<!-- Edit packages/standard-core/src/criteria.json or terms.json instead. -->",
  ""
].join("\n");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content.trim() + "\n", "utf8");
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function cleanGeneratedMarkdown(dir) {
  if (!fs.existsSync(dir)) return;

  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) continue;
    if (!file.endsWith(".md")) continue;

    fs.unlinkSync(fullPath);
  }
}

function slugToTitle(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function unique(values) {
  return [...new Set(values)];
}

function getAllCriterionIds(criteriaData) {
  return new Set(
    criteriaData.pillars.flatMap((pillar) =>
      pillar.criteria.map((criterion) => criterion.id)
    )
  );
}

function getAllTermIds(termsData) {
  return new Set(termsData.map((term) => term.id));
}

function validateLinks(criteriaData, termsData) {
  const criterionIds = getAllCriterionIds(criteriaData);
  const termIds = getAllTermIds(termsData);

  for (const term of termsData) {
    for (const criterionId of term.relatedCriteria || []) {
      if (!criterionIds.has(criterionId)) {
        throw new Error(
          `Term "${term.id}" references missing criterion "${criterionId}"`
        );
      }
    }

    for (const relatedTermId of term.relatedTerms || []) {
      if (!termIds.has(relatedTermId)) {
        throw new Error(
          `Term "${term.id}" references missing related term "${relatedTermId}"`
        );
      }
    }
  }

  for (const pillar of criteriaData.pillars) {
    for (const criterion of pillar.criteria) {
      for (const termId of criterion.terms || []) {
        if (!termIds.has(termId)) {
          throw new Error(
            `Criterion "${criterion.id}" references missing term "${termId}"`
          );
        }
      }
    }
  }
}

function generateCriteriaDocs(criteriaData) {
  ensureDir(docsCriteriaDir);
  cleanGeneratedMarkdown(docsCriteriaDir);

  const indexLines = [
    GENERATED_WARNING,
    "# Criteria Reference",
    "",
    "This section contains the criteria used in the SD Standard, grouped by pillar.",
    ""
  ];

  for (const pillar of criteriaData.pillars) {
    indexLines.push(`## ${pillar.label}`, "");

    for (const criterion of pillar.criteria) {
      const examples = (criterion.examples || [])
        .map((example) => `- ${example}`)
        .join("\n");

      const relatedTerms = (criterion.terms || [])
        .map((termId) => `- [${slugToTitle(termId)}](../terms/${termId}.md)`)
        .join("\n");

      const contentParts = [
        GENERATED_WARNING,
        `# ${criterion.id}: ${criterion.label}`,
        "",
        `**Pillar:** ${pillar.label}  `,
        `**Points:** ${criterion.points}`,
        ""
      ];

      if (criterion.summary) {
        contentParts.push("## Summary", criterion.summary, "");
      }

      if (criterion.description) {
        contentParts.push("## Description", criterion.description, "");
      }

      if (criterion.whyItMatters) {
        contentParts.push("## Why it matters", criterion.whyItMatters, "");
      }

      if (examples) {
        contentParts.push("## Examples", examples, "");
      }

      if (relatedTerms) {
        contentParts.push("## Related terms", relatedTerms, "");
      }

      const filePath = path.join(docsCriteriaDir, `${criterion.id}.md`);
      writeFile(filePath, contentParts.join("\n"));

      indexLines.push(`- [${criterion.id}: ${criterion.label}](${criterion.id}.md)`);
    }

    indexLines.push("");
  }

  writeFile(path.join(docsCriteriaDir, "README.md"), indexLines.join("\n"));
}

function generateTermsDocs(termsData) {
  ensureDir(docsTermsDir);
  cleanGeneratedMarkdown(docsTermsDir);

  const sortedTerms = [...termsData].sort((a, b) =>
    a.title.localeCompare(b.title, "en", { sensitivity: "base" })
  );

  const indexLines = [
    GENERATED_WARNING,
    "# Terms Index",
    "",
    "This section contains key concepts and definitions referenced in the SD Standard.",
    ""
  ];

  for (const term of sortedTerms) {
    const relatedCriteria = (term.relatedCriteria || [])
      .map((criterionId) => `- [${criterionId}](../criteria/${criterionId}.md)`)
      .join("\n");

    const relatedTerms = (term.relatedTerms || [])
      .map((termId) => `- [${slugToTitle(termId)}](${termId}.md)`)
      .join("\n");

    const contentParts = [
      GENERATED_WARNING,
      `# ${term.title}`,
      ""
    ];

    if (term.definition) {
      contentParts.push("## Definition", term.definition, "");
    }

    if (term.whyItMatters) {
      contentParts.push("## Why it matters", term.whyItMatters, "");
    }

    if (relatedCriteria) {
      contentParts.push("## Related criteria", relatedCriteria, "");
    }

    if (relatedTerms) {
      contentParts.push("## Related terms", relatedTerms, "");
    }

    const filePath = path.join(docsTermsDir, `${term.id}.md`);
    writeFile(filePath, contentParts.join("\n"));

    indexLines.push(`- [${term.title}](${term.id}.md)`);
  }

  writeFile(path.join(docsTermsDir, "README.md"), indexLines.join("\n"));
}

function generatePillarDocs(criteriaData) {
  ensureDir(docsPillarsDir);
  cleanGeneratedMarkdown(docsPillarsDir);

  const thresholds = criteriaData.thresholds || {};

  const indexLines = [
    GENERATED_WARNING,
    "# Pillars",
    "",
    "This section contains overview pages for each SD Standard pillar.",
    ""
  ];

  for (const pillar of criteriaData.pillars) {
    const threshold = thresholds[pillar.id];

    const criteriaLinks = pillar.criteria
      .map(
        (criterion) =>
          `- [${criterion.id}: ${criterion.label}](../criteria/${criterion.id}.md)`
      )
      .join("\n");

    const relatedTermIds = unique(
      pillar.criteria.flatMap((criterion) => criterion.terms || [])
    );

    const relatedTerms = relatedTermIds
      .map((termId) => `- [${slugToTitle(termId)}](../terms/${termId}.md)`)
      .join("\n");

    const totalAvailablePoints = pillar.criteria.reduce(
      (sum, criterion) => sum + (criterion.points || 0),
      0
    );

    const contentParts = [
      GENERATED_WARNING,
      `# ${pillar.label}`,
      ""
    ];

    if (typeof threshold !== "undefined") {
      contentParts.push(`**Threshold:** ${threshold}  `);
    }

    contentParts.push(`**Total available points:** ${totalAvailablePoints}`, "");

    contentParts.push(
      "## Criteria in this pillar",
      criteriaLinks || "No criteria listed.",
      ""
    );

    if (relatedTerms) {
      contentParts.push("## Related terms", relatedTerms, "");
    }

    const filePath = path.join(docsPillarsDir, `${pillar.id}.md`);
    writeFile(filePath, contentParts.join("\n"));

    indexLines.push(`- [${pillar.label}](${pillar.id}.md)`);
  }

  writeFile(path.join(docsPillarsDir, "README.md"), indexLines.join("\n"));
}

function generateCriteriaMeta(criteriaData) {
  ensureDir(path.dirname(criteriaMetaPath));

  const meta = {};

  for (const pillar of criteriaData.pillars) {
    for (const criterion of pillar.criteria) {
      meta[criterion.id] = {
        id: criterion.id,
        label: criterion.label,
        points: criterion.points,
        pillarId: pillar.id,
        pillarLabel: pillar.label,
        summary: criterion.summary || criterion.description || "",
        description: criterion.description || "",
        whyItMatters: criterion.whyItMatters || "",
        url: `/generated/criteria/${criterion.id.replace(/-/g, "")}.html`
      };
    }
  }

  writeJson(criteriaMetaPath, meta);
}

function main() {
  if (!fs.existsSync(criteriaPath)) {
    throw new Error(`Missing criteria file: ${criteriaPath}`);
  }

  if (!fs.existsSync(termsPath)) {
    throw new Error(`Missing terms file: ${termsPath}`);
  }

  ensureDir(docsGeneratedDir);
  ensureDir(docsCriteriaDir);
  ensureDir(docsTermsDir);
  ensureDir(docsPillarsDir);

  const criteriaData = JSON.parse(fs.readFileSync(criteriaPath, "utf8"));
  const termsData = JSON.parse(fs.readFileSync(termsPath, "utf8"));

  validateLinks(criteriaData, termsData);
  generateCriteriaDocs(criteriaData);
  generateTermsDocs(termsData);
  generatePillarDocs(criteriaData);
  generateCriteriaMeta(criteriaData);

  console.log("Docs and criteria metadata generated successfully.");
}

main();