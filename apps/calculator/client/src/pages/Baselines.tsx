import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { fetchBaselines, formatMetric, type BaselineSummary } from "@/lib/baselines";

export default function Baselines() {
  const [baselines, setBaselines] = useState<BaselineSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    fetchBaselines()
      .then((nextBaselines) => {
        setBaselines(nextBaselines);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-[#1f241f] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
            SD Standard
          </p>
          <h1 className="mt-3 text-5xl font-extrabold leading-none tracking-normal sm:text-6xl">
            Baseline studies
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#5f5a50]">
            Starter reference studies for common design and communications
            formats. Estimates are placeholders unless noted, and criteria are
            stored as references to the SD Standard source of truth.
          </p>
        </header>

        <aside className="mb-8 rounded-lg border border-[#d9d4c8] bg-[#fff8d7] p-6 text-[#1f241f]">
          <h2 className="text-xl font-extrabold">Reference models for comparison</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[#5f5a50]">
            Baselines are not finished project scores. They are starting models that
            capture typical assumptions, impacts, and criteria so real projects can
            be compared against a clear reference point.
          </p>
        </aside>

        {status === "loading" ? (
          <div className="flex min-h-64 items-center justify-center text-[#5f5a50]">
            <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#28775e]" />
            Loading baselines...
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 text-[#5f5a50]">
            Baselines could not be loaded.
          </div>
        ) : null}

        {status === "ready" ? (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Baselines">
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
