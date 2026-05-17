import Link from "next/link";
import { getAllBaselines } from "../../lib/baselines";

export const metadata = {
  title: "Baselines | SD Standard",
  description: "Baseline study assumptions mapped to SD Standard criteria.",
};

export default function BaselinesPage() {
  const baselines = getAllBaselines();

  return (
    <main className="projects-shell">
      <p className="projects-kicker">SD Standard</p>
      <h1 className="projects-heading">Baseline studies</h1>
      <p className="projects-intro">
        Starter reference studies for common design and communications formats.
        Estimates are placeholders unless noted, and criteria are stored as
        references to the SD Standard source of truth.
      </p>

      <aside className="section-callout baselines-callout">
        <div>
          <h2>Reference models for comparison</h2>
          <p>
            Baselines are not finished project scores. They are starting models
            that capture typical assumptions, impacts, and criteria so real
            projects can be compared against a clear reference point.
          </p>
        </div>
      </aside>

      <section className="project-grid" aria-label="Baseline studies">
        {baselines.map((baseline) => (
          <Link className="project-card" href={`/baselines/${baseline.slug}`} key={baseline.slug}>
            {baseline.coverImage ? <img src={baseline.coverImage} alt="" /> : null}
            <div className="project-card-body">
              <div className="project-meta">
                <span>{baseline.year}</span>
                <span>{baseline.region}</span>
                <span>{baseline.projectType}</span>
              </div>
              <h2>{baseline.title}</h2>
              <p>{baseline.summary}</p>
              <div className="tag-list" aria-label="Key criteria">
                {baseline.criteria.slice(0, 5).map((criterion) => (
                  <span className="tag" key={criterion}>
                    {criterion}
                  </span>
                ))}
              </div>
              <div className="score-row">
                <span className="estimate">
                  {baseline.estimatedCarbonKg
                    ? `${baseline.estimatedCarbonKg.toLocaleString()} kg CO2e`
                    : "Carbon TBD"}
                </span>
                <span className="rating">{baseline.rating}</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
