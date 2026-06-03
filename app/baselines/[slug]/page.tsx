import Link from "next/link";
import { notFound } from "next/navigation";
import { BaselineComparison } from "../../components/BaselineComparison";
import {
  getAllBaselines,
  getBaseline,
  type Baseline,
} from "../../../lib/baselines";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllBaselines().map((baseline) => ({
    slug: baseline.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const baseline = getBaseline(slug);

  if (!baseline) {
    return {};
  }

  return {
    title: `${baseline.title} | SD Standard Baselines`,
    description: baseline.summary,
  };
}

export default async function BaselinePage({ params }: PageProps) {
  const { slug } = await params;
  const baseline = getBaseline(slug);

  if (!baseline) {
    notFound();
  }

  return (
    <main className="projects-shell project-detail">
      <div>
        <Link className="back-link" href="/baselines">
          Back to baselines
        </Link>
        <section className="detail-hero">
          <div>
            <p className="projects-kicker">
              {baseline.year} / {baseline.region} / {baseline.format}
            </p>
            <h1 className="detail-title">{baseline.title}</h1>
            <p className="detail-description">{baseline.summary}</p>
            <div className="baseline-meta-grid" aria-label="Baseline metadata">
              <MetaItem label="Project type" value={baseline.projectType} />
              <MetaItem label="Rating" value={baseline.rating} />
              <MetaItem label="Carbon estimate" value={formatMetric(baseline.estimatedCarbonKg, "kg CO2e")} />
              <MetaItem label="Waste estimate" value={formatMetric(baseline.estimatedWasteKg, "kg")} />
              <MetaItem label="Lifespan" value={formatMetric(baseline.estimatedLifespanUses, "uses")} />
              <MetaItem label="Recyclability" value={baseline.recyclability} />
            </div>
          </div>
          {baseline.coverImage ? (
            <div className="project-cover">
              <img src={baseline.coverImage} alt="" />
            </div>
          ) : null}
        </section>
      </div>

      <section className="detail-panels">
        <article className="content-panel project-body">
          <MarkdownContent markdown={baseline.body} />
        </article>

        <aside className="side-panel" aria-label="Baseline assumptions and references">
          <Assumptions baseline={baseline} />

          <section>
            <h2>Criteria</h2>
            <ul className="criteria-list">
              {baseline.criteriaDetails.map((criterion) => (
                <li key={`${criterion.displayId}-${criterion.id}`}>
                  <span>
                    {criterion.id} / {criterion.pillarLabel}
                  </span>
                  <strong>{criterion.label}</strong>
                  <p>{criterion.description}</p>
                </li>
              ))}
            </ul>
          </section>

          {baseline.sdgs.length ? (
            <section>
              <h2>SDGs</h2>
              <div className="tag-list">
                {baseline.sdgs.map((sdg) => (
                  <span className="tag" key={sdg}>
                    {sdg}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {baseline.sources.length ? (
            <section>
              <h2>Sources</h2>
              <ul className="source-list">
                {baseline.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url}>{source.label}</a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </section>

      {baseline.linkedProjects.length ? (
        <section className="related-section">
          <h2>Linked projects</h2>
          <div className="project-grid">
            {baseline.linkedProjects.map((project) => (
              <Link className="project-card" href={`/projects/${project.slug}`} key={project.slug}>
                <img src={project.coverImage} alt="" />
                <div className="project-card-body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="score-row rating-only">
                    <span className="rating">{project.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <BaselineComparison
        baselines={[baseline]}
        title="Comparison summary"
        intro="This section is structured for future measured comparisons against completed projects. Current values are baseline assumptions."
      />
    </main>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Assumptions({ baseline }: { baseline: Baseline }) {
  return (
    <section>
      <h2>Assumptions</h2>
      <div className="assumption-groups">
        <AssumptionGroup title="Production" items={baseline.productionAssumptions} />
        <AssumptionGroup title="Material" items={baseline.materialAssumptions} />
        <AssumptionGroup title="Transport" items={baseline.transportAssumptions} />
        <AssumptionGroup title="Disposal" items={baseline.disposalAssumptions} />
      </div>
      {baseline.evidenceNotes ? <p className="evidence-note">{baseline.evidenceNotes}</p> : null}
    </section>
  );
}

function AssumptionGroup({ title, items }: { title: string; items: string[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="assumption-group">
      <h3>{title}</h3>
      <ul>
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
    <>
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
    </>
  );
}

function formatMetric(value: number | undefined, unit: string) {
  if (value === undefined || Number.isNaN(value)) {
    return "Not estimated";
  }

  return `${value.toLocaleString()} ${unit}`;
}
