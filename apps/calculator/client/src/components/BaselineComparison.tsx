import { formatMetric, type BaselineSummary } from "@/lib/baselines";

type BaselineComparisonProps = {
  baselines: BaselineSummary[];
  title?: string;
  intro?: string;
};

export default function BaselineComparison({
  baselines,
  title = "Baseline comparison",
  intro = "Environmental metric placeholders are ready for future measured data. Current figures should be treated as directional assumptions.",
}: BaselineComparisonProps) {
  if (!baselines.length) {
    return null;
  }

  return (
    <section className="mt-8 rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(45,39,28,0.08)]">
      <div className="max-w-3xl">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5f5a50]">{intro}</p>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {baselines.map((baseline) => (
          <a
            className="rounded-lg border border-[#d9d4c8] bg-white p-5 transition hover:border-[#28775e]"
            href={`/baselines/${baseline.slug}`}
            key={baseline.slug}
          >
            <span className="rounded-full bg-[#1f241f] px-3 py-1 text-xs font-extrabold text-white">
              {baseline.rating}
            </span>
            <h3 className="mt-4 text-lg font-extrabold">{baseline.title}</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[#5f5a50]">Carbon</dt>
                <dd className="text-right font-extrabold">
                  {formatMetric(baseline.estimatedCarbonKg, "kg CO2e")}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[#5f5a50]">Waste</dt>
                <dd className="text-right font-extrabold">
                  {formatMetric(baseline.estimatedWasteKg, "kg")}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[#5f5a50]">Uses</dt>
                <dd className="text-right font-extrabold">
                  {formatMetric(baseline.estimatedLifespanUses, "uses")}
                </dd>
              </div>
            </dl>
          </a>
        ))}
      </div>
    </section>
  );
}
