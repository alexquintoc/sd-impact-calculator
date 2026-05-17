import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import BaselineComparison from "@/components/BaselineComparison";
import { fetchProject, getPillarLabel, type ProjectDetail as ProjectDetailType } from "@/lib/projects";

const pillarOrder = ["environment", "social", "cultural", "financial"];

const pillarColors: Record<string, string> = {
  environment: "#28775e",
  social: "#2d6cdf",
  cultural: "#8a5a12",
  financial: "#6f7d1c",
};

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<ProjectDetailType | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    setStatus("loading");
    fetchProject(params.slug)
      .then((nextProject) => {
        setProject(nextProject);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [params.slug]);

  const pillarCounts = useMemo(() => {
    if (!project) return {};

    return project.criteriaDetails.reduce<Record<string, number>>((counts, criterion) => {
      const key =
        criterion.pillarId === "society"
          ? "social"
          : criterion.pillarId === "culture"
            ? "cultural"
            : criterion.pillarId === "finance"
              ? "financial"
              : criterion.pillarId;
      counts[key] = (counts[key] ?? 0) + 1;
      return counts;
    }, {});
  }, [project]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] text-[#5f5a50]">
        <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#28775e]" />
        Loading project...
      </main>
    );
  }

  if (status === "error" || !project) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-[#1f241f] sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6">
          <h1 className="text-2xl font-extrabold">Project not found</h1>
          <a className="mt-4 inline-flex font-bold text-[#28775e]" href="/projects">
            Back to projects
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-[#1f241f] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <a
          href="/projects"
          className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e] hover:text-[#1f241f]"
        >
          Back to projects
        </a>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <p className="text-sm font-bold text-[#5f5a50]">
              {project.year} / {project.location} / {project.projectType}
            </p>
            <h1 className="mt-3 text-5xl font-extrabold leading-none sm:text-6xl">
              {project.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5f5a50]">
              {project.description}
            </p>
            {project.website ? (
              <a className="mt-5 inline-flex font-extrabold text-[#28775e]" href={project.website}>
                Visit project website
              </a>
            ) : null}
          </div>
          <img
            src={project.coverImage}
            alt=""
            className="aspect-[3/2] w-full rounded-lg border border-[#d9d4c8] object-cover"
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
          <article className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(45,39,28,0.08)]">
            <MarkdownContent markdown={project.body} />
          </article>

          <aside className="space-y-6">
            <section className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6">
              <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
                SD Standard Score
              </h2>
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-4xl font-extrabold">{project.score}</span>
                <span className="rounded-full bg-[#1f241f] px-3 py-1 text-xs font-extrabold text-white">
                  {project.rating}
                </span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e5e0d5]">
                <span className="block h-full rounded-full bg-[#28775e]" style={{ width: `${project.score}%` }} />
              </div>
            </section>

            <section className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6">
              <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
                Pillars
              </h2>
              <div className="mt-4 space-y-3">
                {pillarOrder.map((pillar) => {
                  const count = pillarCounts[pillar] ?? 0;
                  const width = project.criteriaDetails.length
                    ? (count / project.criteriaDetails.length) * 100
                    : 0;
                  return (
                    <div className="grid grid-cols-[86px_1fr] items-center gap-3" key={pillar}>
                      <span className="text-sm font-bold">{getPillarLabel(pillar)}</span>
                      <span className="h-2 overflow-hidden rounded-full bg-[#e5e0d5]">
                        <span
                          className="block h-full rounded-full"
                          style={{ width: `${width}%`, backgroundColor: pillarColors[pillar] }}
                        />
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6">
              <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
                Criteria
              </h2>
              <ul className="mt-4 space-y-3">
                {project.criteriaDetails.map((criterion) => (
                  <li className="rounded-md border border-[#d9d4c8] bg-white p-4" key={`${criterion.displayId}-${criterion.id}`}>
                    <p className="text-xs font-bold uppercase text-[#5f5a50]">
                      {criterion.displayId} / {criterion.pillarLabel}
                    </p>
                    <h3 className="mt-1 font-extrabold">{criterion.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#5f5a50]">
                      {criterion.description}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </section>

        {project.gallery.length ? (
          <section className="mt-8">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
              Gallery
            </h2>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {project.gallery.map((image) => (
                <img
                  src={image}
                  alt=""
                  className="aspect-[3/2] w-full rounded-lg border border-[#d9d4c8] object-cover"
                  key={image}
                  loading="lazy"
                />
              ))}
            </div>
          </section>
        ) : null}

        {project.relatedProjects.length ? (
          <section className="mt-10">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
              Related projects
            </h2>
            <div className="mt-4 grid gap-5 md:grid-cols-3">
              {project.relatedProjects.map((relatedProject) => (
                <a
                  className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-5 hover:border-[#28775e]"
                  href={`/projects/${relatedProject.slug}`}
                  key={relatedProject.slug}
                >
                  <h3 className="text-lg font-extrabold">{relatedProject.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5f5a50]">
                    {relatedProject.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {project.linkedBaselines?.length ? (
          <section className="mt-10">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
              Linked baseline studies
            </h2>
            <div className="mt-4 grid gap-5 md:grid-cols-3">
              {project.linkedBaselines.map((baseline) => (
                <a
                  className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-5 hover:border-[#28775e]"
                  href={`/baselines/${baseline.slug}`}
                  key={baseline.slug}
                >
                  <h3 className="text-lg font-extrabold">{baseline.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5f5a50]">
                    {baseline.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {baseline.criteria.slice(0, 5).map((criterion) => (
                      <span
                        className="rounded-full border border-[#d9d4c8] px-3 py-1 text-xs font-bold text-[#5f5a50]"
                        key={criterion}
                      >
                        {criterion}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <BaselineComparison baselines={project.linkedBaselines ?? []} />
      </div>
    </main>
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
