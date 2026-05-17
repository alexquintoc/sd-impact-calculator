import Link from "next/link";
import type { BaselineSummary } from "../../lib/baselines";

type BaselineComparisonProps = {
  baselines: BaselineSummary[];
  title?: string;
  intro?: string;
};

export function BaselineComparison({
  baselines,
  title = "Baseline comparison",
  intro = "Environmental metric placeholders are ready for future measured data. Current figures should be treated as directional assumptions.",
}: BaselineComparisonProps) {
  if (!baselines.length) {
    return null;
  }

  return (
    <section className="comparison-section">
      <div>
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>
      <div className="comparison-grid">
        {baselines.map((baseline) => (
          <Link
            className="comparison-card"
            href={`/baselines/${baseline.slug}`}
            key={baseline.slug}
          >
            <span className="rating">{baseline.rating}</span>
            <h3>{baseline.title}</h3>
            <dl className="metric-list">
              <div>
                <dt>Carbon</dt>
                <dd>{formatMetric(baseline.estimatedCarbonKg, "kg CO2e")}</dd>
              </div>
              <div>
                <dt>Waste</dt>
                <dd>{formatMetric(baseline.estimatedWasteKg, "kg")}</dd>
              </div>
              <div>
                <dt>Uses</dt>
                <dd>{formatMetric(baseline.estimatedLifespanUses, "uses")}</dd>
              </div>
            </dl>
          </Link>
        ))}
      </div>
    </section>
  );
}

function formatMetric(value: number | undefined, unit: string) {
  if (value === undefined || Number.isNaN(value)) {
    return "Not estimated";
  }

  return `${value.toLocaleString()} ${unit}`;
}
