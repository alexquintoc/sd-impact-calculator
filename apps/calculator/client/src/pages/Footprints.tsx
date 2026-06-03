import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { fetchBaselines, formatMetric, type BaselineSummary } from "@/lib/baselines";
import { fetchProjects, getPillarLabel, type ProjectSummary } from "@/lib/projects";

type ViewMode = "projects" | "baselines";

export default function Footprints() {
  const [mode, setMode] = useState<ViewMode>("projects");
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [baselines, setBaselines] = useState<BaselineSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    Promise.all([fetchProjects(), fetchBaselines()])
      .then(([nextProjects, nextBaselines]) => {
        setProjects(nextProjects);
        setBaselines(nextBaselines);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-[#1f241f] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-4xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
            Footprints
          </p>
          <h1 className="mt-3 text-5xl font-extrabold leading-none tracking-normal sm:text-6xl">
            Projects and baseline studies
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#5f5a50]">
            This section is a work-in-progress. The team is currently evaluating
            existing projects and running the SD Standard against them. We are also
            creating baseline studies that evaluate the footprint of industry
            average products.
          </p>
        </header>

        <aside className="mt-8 rounded-lg border border-[#d9d4c8] bg-[#e5efe9] p-6 text-[#1f241f]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-extrabold">
                Featured case studies show how the Standard weighs example projects.
                Could yours be one?
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4f5a55]">
                Share a project for consideration as the SD Standard library grows.
              </p>
            </div>
            <a
              href="mailto:info@sdstandard.org?subject=Submit%20a%20project%20for%20Footprints"
              className="inline-flex shrink-0 items-center justify-center rounded-md border border-[#28775e] bg-[#fffdf8] px-5 py-3 text-sm font-extrabold text-[#28775e] transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
            >
              Submit a project
            </a>
          </div>
        </aside>

        <div
          className="mt-8 inline-flex rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-1"
          role="group"
          aria-label="Footprint content"
        >
          {(["projects", "baselines"] as const).map((item) => (
            <button
              className={`rounded-md px-5 py-3 text-sm font-extrabold transition focus:outline-none focus:ring-4 focus:ring-[#85bba8] ${
                mode === item
                  ? "bg-[#28775e] text-white"
                  : "text-[#5f5a50] hover:bg-[#e5efe9] hover:text-[#1f241f]"
              }`}
              key={item}
              onClick={() => setMode(item)}
              type="button"
            >
              {item === "projects" ? "Projects" : "Baselines"}
            </button>
          ))}
        </div>

        {status === "loading" ? (
          <div className="flex min-h-64 items-center justify-center text-[#5f5a50]">
            <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#28775e]" />
            Loading footprints...
          </div>
        ) : null}

        {status === "error" ? (
          <div className="mt-8 rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 text-[#5f5a50]">
            Footprints could not be loaded.
          </div>
        ) : null}

        {status === "ready" && mode === "projects" ? (
          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Projects">
            {projects.map((project) => (
              <a
                href={`/projects/${project.slug}`}
                className="group overflow-hidden rounded-lg border border-[#d9d4c8] bg-[#fffdf8] shadow-[0_18px_50px_rgba(45,39,28,0.08)] transition hover:-translate-y-1 hover:border-[#28775e] focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
                key={project.slug}
              >
                <img
                  src={project.coverImage}
                  alt=""
                  className="aspect-[3/2] w-full object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <div className="mb-4 flex flex-wrap gap-2 text-sm font-bold text-[#5f5a50]">
                    <span>{project.year}</span>
                    <span>{project.location}</span>
                    <span>{project.projectType}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold">{project.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#5f5a50]">
                    {project.description}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#1f241f] px-3 py-1 text-xs font-extrabold text-white">
                      {project.rating}
                    </span>
                    {project.pillars.map((pillar) => (
                      <span
                        className="rounded-full border border-[#d9d4c8] px-3 py-1 text-xs font-bold text-[#5f5a50]"
                        key={pillar}
                      >
                        {getPillarLabel(pillar)}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center text-sm font-extrabold text-[#28775e]">
                    View project
                    <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </a>
            ))}
          </section>
        ) : null}

        {status === "ready" && mode === "baselines" ? (
          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Baselines">
            {baselines.map((baseline) => (
              <a
                href={`/baselines/${baseline.slug}`}
                className="group overflow-hidden rounded-lg border border-[#d9d4c8] bg-[#fffdf8] shadow-[0_18px_50px_rgba(45,39,28,0.08)] transition hover:-translate-y-1 hover:border-[#28775e] focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
                key={baseline.slug}
              >
                {baseline.coverImage ? (
                  <img
                    src={baseline.coverImage}
                    alt=""
                    className="aspect-[3/2] w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
                <div className="p-6">
                  <div className="mb-4 flex flex-wrap gap-2 text-sm font-bold text-[#5f5a50]">
                    <span>{baseline.year}</span>
                    <span>{baseline.region}</span>
                    <span>{baseline.projectType}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold">{baseline.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#5f5a50]">
                    {baseline.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {baseline.criteria.slice(0, 5).map((criterion) => (
                      <span
                        className="rounded-full border border-[#d9d4c8] px-3 py-1 text-xs font-bold text-[#5f5a50]"
                        key={criterion}
                      >
                        {criterion}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="text-sm font-extrabold">
                      {formatMetric(baseline.estimatedCarbonKg, "kg CO2e")}
                    </span>
                    <span className="rounded-full bg-[#1f241f] px-3 py-1 text-xs font-extrabold text-white">
                      {baseline.rating}
                    </span>
                  </div>
                  <span className="mt-6 inline-flex items-center text-sm font-extrabold text-[#28775e]">
                    View baseline
                    <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </a>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
