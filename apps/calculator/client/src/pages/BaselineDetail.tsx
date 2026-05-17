import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import BaselineComparison from "@/components/BaselineComparison";
import {
  fetchBaseline,
  formatMetric,
  type BaselineDetail as BaselineDetailType,
} from "@/lib/baselines";

export default function BaselineDetail({ params }: { params: { slug: string } }) {
  const [baseline, setBaseline] = useState<BaselineDetailType | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    setStatus("loading");
    fetchBaseline(params.slug)
      .then((nextBaseline) => {
        setBaseline(nextBaseline);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [params.slug]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] text-[#5f5a50]">
        <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#28775e]" />
        Loading baseline...
      </main>
    );
  }

  if (status === "error" || !baseline) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-[#1f241f] sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6">
          <h1 className="text-2xl font-extrabold">Baseline not found</h1>
          <a className="mt-4 inline-flex font-bold text-[#28775e]" href="/baselines">
            Back to baselines
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-[#1f241f] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <a
          href="/baselines"
          className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e] hover:text-[#1f241f]"
        >
          Back to baselines
        </a>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <p className="text-sm font-bold text-[#5f5a50]">
              {baseline.year} / {baseline.region} / {baseline.format}
            </p>
            <h1 className="mt-3 text-5xl font-extrabold leading-none sm:text-6xl">
              {baseline.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5f5a50]">
              {baseline.summary}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <MetaItem label="Project type" value={baseline.projectType} />
              <MetaItem label="Rating" value={baseline.rating} />
              <MetaItem label="Carbon estimate" value={formatMetric(baseline.estimatedCarbonKg, "kg CO2e")} />
              <MetaItem label="Waste estimate" value={formatMetric(baseline.estimatedWasteKg, "kg")} />
              <MetaItem label="Lifespan" value={formatMetric(baseline.estimatedLifespanUses, "uses")} />
              <MetaItem label="Recyclability" value={baseline.recyclability} />
            </div>
          </div>
          {baseline.coverImage ? (
            <img
              src={baseline.coverImage}
              alt=""
              className="aspect-[3/2] w-full rounded-lg border border-[#d9d4c8] object-cover"
            />
          ) : null}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
          <article className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(45,39,28,0.08)]">
            <MarkdownContent markdown={baseline.body} />
          </article>

          <aside className="space-y-6">
            <section className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6">
              <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
                Assumptions
              </h2>
              <div className="mt-4 space-y-4">
                <AssumptionGroup title="Production" items={baseline.productionAssumptions} />
                <AssumptionGroup title="Material" items={baseline.materialAssumptions} />
                <AssumptionGroup title="Transport" items={baseline.transportAssumptions} />
                <AssumptionGroup title="Disposal" items={baseline.disposalAssumptions} />
              </div>
              {baseline.evidenceNotes ? (
                <p className="mt-4 text-sm leading-6 text-[#5f5a50]">{baseline.evidenceNotes}</p>
              ) : null}
            </section>

            <section className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6">
              <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
                Criteria
              </h2>
              <ul className="mt-4 space-y-3">
                {baseline.criteriaDetails.map((criterion) => (
                  <li className="rounded-md border border-[#d9d4c8] bg-white p-4" key={`${criterion.displayId}-${criterion.id}`}>
                    <p className="text-xs font-bold uppercase text-[#5f5a50]">
                      {criterion.id} / {criterion.pillarLabel}
                    </p>
                    <h3 className="mt-1 font-extrabold">{criterion.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#5f5a50]">
                      {criterion.description}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {baseline.sdgs.length ? (
              <section className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6">
                <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
                  SDGs
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {baseline.sdgs.map((sdg) => (
                    <span
                      className="rounded-full border border-[#d9d4c8] px-3 py-1 text-xs font-bold text-[#5f5a50]"
                      key={sdg}
                    >
                      {sdg}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {baseline.sources.length ? (
              <section className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6">
                <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
                  Sources
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[#5f5a50]">
                  {baseline.sources.map((source) => (
                    <li key={source.url}>
                      <a className="font-bold text-[#28775e]" href={source.url}>
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </section>

        {baseline.linkedProjects.length ? (
          <section className="mt-10">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
              Linked projects
            </h2>
            <div className="mt-4 grid gap-5 md:grid-cols-3">
              {baseline.linkedProjects.map((project) => (
                <a
                  className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-5 hover:border-[#28775e]"
                  href={`/projects/${project.slug}`}
                  key={project.slug}
                >
                  <h3 className="text-lg font-extrabold">{project.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5f5a50]">
                    {project.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <BaselineComparison
          baselines={[baseline]}
          title="Comparison summary"
          intro="This section is structured for future measured comparisons against completed projects. Current values are baseline assumptions."
        />
      </div>
    </main>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-4">
      <span className="text-xs font-bold uppercase text-[#5f5a50]">{label}</span>
      <strong className="mt-1 block text-sm">{value}</strong>
    </div>
  );
}

function AssumptionGroup({ title, items }: { title: string; items: string[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="rounded-md border border-[#d9d4c8] bg-white p-4">
      <h3 className="font-extrabold">{title}</h3>
      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-[#5f5a50]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function MarkdownContent({ markdown }: { markdown: string }) {
  const blocks = markdown.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="prose prose-neutral max-w-none prose-headings:font-extrabold prose-p:text-[#5f5a50] prose-li:text-[#5f5a50]">
      {blocks.map((block, index) => {
        if (block.startsWith("# ")) {
          return <h1 key={index}>{block.replace(/^# /, "")}</h1>;
        }

        if (block.startsWith("## ")) {
          return <h2 key={index}>{block.replace(/^## /, "")}</h2>;
        }

        if (block.startsWith("- ")) {
          return (
            <ul key={index}>
              {block.split(/\r?\n/).map((item) => (
                <li key={item}>{item.replace(/^- /, "")}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{block}</p>;
      })}
    </div>
  );
}
