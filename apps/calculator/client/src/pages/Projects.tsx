import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { fetchProjects, getPillarLabel, type ProjectSummary } from "@/lib/projects";

export default function Projects() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    fetchProjects()
      .then((nextProjects) => {
        setProjects(nextProjects);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-[#1f241f] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 max-w-3xl">
          <a
            href="/"
            className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e] hover:text-[#1f241f]"
          >
            SD Standard
          </a>
          <h1 className="mt-3 text-5xl font-extrabold leading-none tracking-normal sm:text-6xl">
            Project examples
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#5f5a50]">
            Explore TinaCMS-managed project examples mapped to SD Standard
            pillars, criteria, scores, and ratings.
          </p>
        </header>

        {status === "loading" ? (
          <div className="flex min-h-64 items-center justify-center text-[#5f5a50]">
            <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#28775e]" />
            Loading projects...
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 text-[#5f5a50]">
            Projects could not be loaded.
          </div>
        ) : null}

        {status === "ready" ? (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Projects">
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
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.pillars.map((pillar) => (
                      <span
                        className="rounded-full border border-[#d9d4c8] px-3 py-1 text-xs font-bold text-[#5f5a50]"
                        key={pillar}
                      >
                        {getPillarLabel(pillar)}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="text-3xl font-extrabold">{project.score}</span>
                    <span className="rounded-full bg-[#1f241f] px-3 py-1 text-xs font-extrabold text-white">
                      {project.rating}
                    </span>
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
      </div>
    </main>
  );
}
