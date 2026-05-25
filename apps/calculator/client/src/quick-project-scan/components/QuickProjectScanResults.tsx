import { useMemo, useState } from "react";
import { Clipboard, Download, FileText, RotateCcw } from "lucide-react";
import {
  buildSnapshotEmbedPayload,
  encodeSnapshotPayload,
  getCriteriaByStatus,
} from "@/quick-project-scan/lib/scanProjectDescription";
import { CriteriaCard } from "./CriteriaCard";
import type {
  ImpactSnapshot,
  ImpactSnapshotCriterion,
  ImpactSnapshotPillarId,
  SnapshotEmbedPayload,
} from "../types";

type QuickProjectScanResultsProps = {
  result: ImpactSnapshot;
  onStartAgain: () => void;
};

const PILLARS: Array<{ id: ImpactSnapshotPillarId; label: string }> = [
  { id: "environment", label: "Environment" },
  { id: "society", label: "Society" },
  { id: "culture", label: "Culture" },
  { id: "finance", label: "Finance" },
];

function makeDownload(result: ImpactSnapshot) {
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sd-standard-impact-snapshot.json";
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function makePdf(result: ImpactSnapshot) {
  const likelyCriteria = getCriteriaByStatus(result, "likely");
  const possibleCriteria = getCriteriaByStatus(result, "possible");
  const title = result.project.inferredTitle ?? "Impact snapshot";
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>SD Standard Impact Snapshot</title>
    <style>
      body {
        color: #1f241f;
        font-family: Arial, sans-serif;
        margin: 40px;
      }
      h1, h2, h3, p { margin: 0; }
      h1 { font-size: 30px; line-height: 1.15; }
      h2 { border-top: 1px solid #d9d4c8; font-size: 18px; margin-top: 28px; padding-top: 18px; }
      h3 { color: #28775e; font-size: 13px; letter-spacing: 0.06em; margin-top: 16px; text-transform: uppercase; }
      .eyebrow { color: #28775e; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
      .intro { color: #5f5a50; line-height: 1.55; margin-top: 12px; max-width: 760px; }
      .summary { display: grid; gap: 12px; grid-template-columns: repeat(4, 1fr); margin-top: 22px; }
      .pillar { border: 1px solid #d9d4c8; border-radius: 8px; padding: 12px; }
      .pillar strong { display: block; font-size: 14px; margin-bottom: 8px; }
      .counts { color: #5f5a50; font-size: 12px; line-height: 1.5; }
      .criterion { border: 1px solid #d9d4c8; border-radius: 8px; margin-top: 10px; padding: 12px; page-break-inside: avoid; }
      .criterion-title { font-size: 14px; font-weight: 800; }
      .meta { color: #28775e; font-size: 11px; font-weight: 800; letter-spacing: 0.06em; margin-bottom: 6px; text-transform: uppercase; }
      .body { color: #5f5a50; font-size: 12px; line-height: 1.55; margin-top: 8px; }
      .evidence { background: #f7f5ef; border-radius: 6px; color: #4f4a42; font-size: 12px; line-height: 1.5; margin-top: 8px; padding: 8px; }
      .questions li { color: #5f5a50; font-size: 12px; line-height: 1.5; margin: 7px 0; }
      @media print {
        body { margin: 28px; }
        .summary { grid-template-columns: repeat(2, 1fr); }
      }
    </style>
  </head>
  <body>
    <p class="eyebrow">SD Standard Impact Snapshot</p>
    <h1>${escapeHtml(title)}</h1>
    <p class="intro">Based on the description, this project appears to address ${result.summary.totalLikelyCriteria} criteria, with ${result.summary.totalPossibleCriteria} possible criteria to review. This is a rule-assisted mapping, not a certification or verification.</p>
    <div class="summary">
      ${PILLARS.map((pillar) => {
        const counts = result.summary.pillars[pillar.id];
        return `<div class="pillar"><strong>${pillar.label}</strong><p class="counts">${counts.likely} likely<br />${counts.possible} possible</p></div>`;
      }).join("")}
    </div>
    <h2>Likely criteria</h2>
    ${renderPdfCriteria(likelyCriteria)}
    <h2>Possible criteria</h2>
    ${renderPdfCriteria(possibleCriteria)}
    <h2>Missing information / questions</h2>
    <ul class="questions">
      ${result.missingInformation.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}
    </ul>
    <h2>Disclaimer</h2>
    <p class="body">${escapeHtml(result.disclaimer)}</p>
  </body>
</html>`;

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => printWindow.print(), 350);
}

function renderPdfCriteria(criteria: ImpactSnapshotCriterion[]) {
  if (criteria.length === 0) {
    return `<p class="body">Not enough evidence to show criteria in this section yet.</p>`;
  }

  return PILLARS.map((pillar) => {
    const pillarCriteria = criteria.filter((criterion) => criterion.pillarId === pillar.id);
    if (pillarCriteria.length === 0) return "";

    return `<h3>${pillar.label}</h3>${pillarCriteria
      .map(
        (criterion) => `<div class="criterion">
          <p class="meta">${escapeHtml(criterion.pillarLabel)} &middot; ${escapeHtml(criterion.status)}</p>
          <p class="criterion-title">${escapeHtml(`${criterion.id}: ${criterion.label}`)}</p>
          <p class="body">${escapeHtml(criterion.rationale)} Confidence: ${Math.round(
          criterion.confidence * 100
        )}%.</p>
          ${
            criterion.evidence
              ? `<p class="evidence">Evidence: "${escapeHtml(criterion.evidence)}"</p>`
              : ""
          }
        </div>`
      )
      .join("")}`;
  }).join("");
}

function getEmbedCode(payload: SnapshotEmbedPayload) {
  const baseUrl = window.location.origin;
  const snapshot = encodeSnapshotPayload(payload);
  return `<iframe
  src="${baseUrl}/impact-snapshot/embed?snapshot=${snapshot}"
  width="100%"
  height="520"
  style="border:0; border-radius:16px; overflow:hidden;"
  title="SD Standard impact snapshot">
</iframe>`;
}

function PillarSummaryCard({
  result,
  pillar,
}: {
  result: ImpactSnapshot;
  pillar: { id: ImpactSnapshotPillarId; label: string };
}) {
  const counts = result.summary.pillars[pillar.id];
  const total = counts.likely + counts.possible;
  const maxTotal = Math.max(
    1,
    ...PILLARS.map((item) => {
      const itemCounts = result.summary.pillars[item.id];
      return itemCounts.likely + itemCounts.possible;
    })
  );
  const width = Math.max(8, Math.round((total / maxTotal) * 100));

  return (
    <article className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-extrabold text-[#1f241f]">{pillar.label}</h3>
        <span className="rounded-full bg-[#e5efe9] px-3 py-1 text-xs font-extrabold text-[#28775e]">
          {total} signals
        </span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e5e1d7]">
        <div className="h-full rounded-full bg-[#28775e]" style={{ width: `${width}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-md bg-white px-3 py-2">
          <p className="text-2xl font-extrabold text-[#1f241f]">{counts.likely}</p>
          <p className="text-xs font-bold uppercase tracking-[0.06em] text-[#5f5a50]">Likely</p>
        </div>
        <div className="rounded-md bg-white px-3 py-2">
          <p className="text-2xl font-extrabold text-[#1f241f]">{counts.possible}</p>
          <p className="text-xs font-bold uppercase tracking-[0.06em] text-[#5f5a50]">Possible</p>
        </div>
      </div>
    </article>
  );
}

function CriteriaSection({
  title,
  intro,
  criteria,
}: {
  title: string;
  intro: string;
  criteria: ImpactSnapshotCriterion[];
}) {
  const grouped = PILLARS.map((pillar) => ({
    ...pillar,
    criteria: criteria.filter((criterion) => criterion.pillarId === pillar.id),
  })).filter((pillar) => pillar.criteria.length > 0);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold text-[#1f241f]">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f5a50]">{intro}</p>
      </div>

      {grouped.length === 0 ? (
        <div className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-5 text-sm font-medium leading-6 text-[#5f5a50]">
          Not enough evidence to show criteria in this section yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {grouped.map((pillar) => (
            <div key={pillar.id} className="grid gap-3">
              <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
                {pillar.label}
              </h3>
              <div className="grid gap-3 lg:grid-cols-2">
                {pillar.criteria.map((criterion) => (
                  <CriteriaCard key={`${criterion.id}-${criterion.status}`} criterion={criterion} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function QuickProjectScanResults({ result, onStartAgain }: QuickProjectScanResultsProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const likelyCriteria = useMemo(() => getCriteriaByStatus(result, "likely"), [result]);
  const possibleCriteria = useMemo(() => getCriteriaByStatus(result, "possible"), [result]);
  const embedPayload = useMemo(() => buildSnapshotEmbedPayload(result), [result]);
  const embedCode = useMemo(() => getEmbedCode(embedPayload), [embedPayload]);

  const copyEmbedCode = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1800);
  };

  return (
    <section className="space-y-8">
      <div className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(45,39,28,0.08)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
              AI-assisted / self-reported project mapping
            </p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight text-[#1f241f]">
              {result.project.inferredTitle ?? "Impact snapshot"}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#5f5a50]">
              Based on the description, this project appears to address{" "}
              {result.summary.totalLikelyCriteria} criteria, with{" "}
              {result.summary.totalPossibleCriteria} possible criteria to review. This is a
              rule-assisted mapping, not a certification or verification.
            </p>
            {(result.project.inferredProjectType || result.project.inferredFormat) && (
              <p className="mt-3 text-sm font-bold text-[#5f5a50]">
                Inferred type: {result.project.inferredProjectType ?? "not enough evidence"}
                {" | "}
                Format: {result.project.inferredFormat ?? "not enough evidence"}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => makeDownload(result)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#28775e] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#1f241f] focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download JSON
            </button>
            <button
              type="button"
              onClick={() => makePdf(result)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#28775e] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#1f241f] focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={copyEmbedCode}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#1f241f] px-4 py-3 text-sm font-extrabold text-[#1f241f] transition hover:bg-[#1f241f] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
            >
              <Clipboard className="h-4 w-4" aria-hidden="true" />
              {copyState === "copied" ? "Embed code copied" : "Copy embed code"}
            </button>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1f241f]">Four-pillar visual summary</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f5a50]">
            Counts indicate likely and possible criteria signals found in the submitted description.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PILLARS.map((pillar) => (
            <PillarSummaryCard key={pillar.id} result={result} pillar={pillar} />
          ))}
        </div>
      </section>

      <CriteriaSection
        title="Likely criteria"
        intro="Based on the description, this project appears to address these criteria. Review the linked criteria pages before making any project claim."
        criteria={likelyCriteria}
      />

      <CriteriaSection
        title="Possible criteria"
        intro="Possible criteria to review. These matches have partial evidence and need clearer project details."
        criteria={possibleCriteria}
      />

      <section className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-5">
        <h2 className="text-2xl font-extrabold text-[#1f241f]">
          Missing information / questions to improve the assessment
        </h2>
        <ul className="mt-4 grid gap-3 text-sm font-medium leading-6 text-[#5f5a50] md:grid-cols-2">
          {result.missingInformation.map((question) => (
            <li key={question} className="rounded-md bg-white px-3 py-2">
              {question}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-5">
        <h2 className="text-2xl font-extrabold text-[#1f241f]">Embed code</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f5a50]">
          Copy this iframe into another page to show a lightweight impact snapshot card.
        </p>
        <pre className="mt-4 max-h-64 overflow-auto rounded-md bg-[#1f241f] p-4 text-xs font-semibold leading-5 text-white">
          {embedCode}
        </pre>
      </section>

      <div className="flex flex-col gap-3 rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium leading-6 text-[#5f5a50]">{result.disclaimer}</p>
        <button
          type="button"
          onClick={onStartAgain}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-[#1f241f] px-5 py-3 text-sm font-extrabold text-[#1f241f] transition hover:bg-[#1f241f] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Start over
        </button>
      </div>
    </section>
  );
}
