import { decodeSnapshotPayload } from "@/quick-project-scan/lib/scanProjectDescription";
import type { ImpactSnapshotPillarId, SnapshotEmbedPayload } from "@/quick-project-scan/types";

const PILLARS: Array<{ id: ImpactSnapshotPillarId; label: string }> = [
  { id: "environment", label: "Environment" },
  { id: "society", label: "Society" },
  { id: "culture", label: "Culture" },
  { id: "finance", label: "Finance" },
];

const FALLBACK_PAYLOAD: SnapshotEmbedPayload = {
  schema: "sd-standard-impact-snapshot-embed-v1",
  generatedAt: new Date().toISOString(),
  projectTitle: null,
  summary: {
    totalLikelyCriteria: 0,
    totalPossibleCriteria: 0,
    pillars: {
      environment: { likely: 0, possible: 0 },
      society: { likely: 0, possible: 0 },
      culture: { likely: 0, possible: 0 },
      finance: { likely: 0, possible: 0 },
    },
  },
  likelyCriteria: [],
};

function getPayload() {
  const params = new URLSearchParams(window.location.search);
  return decodeSnapshotPayload(params.get("snapshot")) ?? FALLBACK_PAYLOAD;
}

function PillarBar({
  payload,
  pillar,
}: {
  payload: SnapshotEmbedPayload;
  pillar: { id: ImpactSnapshotPillarId; label: string };
}) {
  const counts = payload.summary.pillars[pillar.id];
  const total = counts.likely + counts.possible;
  const maxTotal = Math.max(
    1,
    ...PILLARS.map((item) => {
      const itemCounts = payload.summary.pillars[item.id];
      return itemCounts.likely + itemCounts.possible;
    })
  );
  const width = Math.max(8, Math.round((total / maxTotal) * 100));

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-extrabold text-[#1f241f]">{pillar.label}</span>
        <span className="text-xs font-bold text-[#5f5a50]">{counts.likely} likely</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e5e1d7]">
        <div className="h-full rounded-full bg-[#28775e]" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function QuickProjectScanEmbed() {
  const payload = getPayload();

  return (
    <main className="min-h-screen bg-transparent p-3 text-[#1f241f]">
      <section className="mx-auto max-w-3xl rounded-2xl border border-[#d9d4c8] bg-[#fffdf8] p-5 shadow-[0_18px_50px_rgba(45,39,28,0.10)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
              Sustainable Design Standard
            </p>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight">
              Sustainability Impact Snapshot
            </h1>
            {payload.projectTitle && (
              <p className="mt-1 text-sm font-bold leading-6 text-[#5f5a50]">
                {payload.projectTitle}
              </p>
            )}
          </div>
          <div className="rounded-md bg-[#e5efe9] px-3 py-2 text-right">
            <p className="text-2xl font-extrabold text-[#28775e]">
              {payload.summary.totalLikelyCriteria}
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.06em] text-[#28775e]">
              likely criteria
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PILLARS.map((pillar) => (
            <PillarBar key={pillar.id} payload={payload} pillar={pillar} />
          ))}
        </div>

        {payload.likelyCriteria.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
              Likely criteria
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {payload.likelyCriteria.map((criterion) => (
                <span
                  key={`${criterion.id}-${criterion.pillarId}`}
                  className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#1f241f]"
                >
                  {criterion.id}: {criterion.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 border-t border-[#d9d4c8] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium leading-5 text-[#5f5a50]">
            Not a certification or verification. Project Impact Snapshot created using
            self-reported project description.
          </p>
          <a
            href="/impact-snapshot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-extrabold text-[#28775e] underline-offset-4 hover:underline"
          >
            Create a full scan
          </a>
        </div>
      </section>
    </main>
  );
}
