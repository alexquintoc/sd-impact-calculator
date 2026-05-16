import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllProjects,
  getPillarKey,
  getPillarLabel,
  getProject,
  type Project,
} from "../../../lib/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const pillarOrder = ["environment", "social", "cultural", "financial"];

const pillarCssKeys: Record<string, string> = {
  environment: "environment",
  social: "society",
  cultural: "culture",
  financial: "finance",
};

export function generateStaticParams() {
  return getAllProjects().map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} | SD Standard Projects`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const pillarCounts = getPillarCounts(project);

  return (
    <main className="projects-shell project-detail">
      <div>
        <Link className="back-link" href="/projects">
          Back to projects
        </Link>
        <section className="detail-hero">
          <div>
            <p className="projects-kicker">
              {project.year} / {project.location} / {project.projectType}
            </p>
            <h1 className="detail-title">{project.title}</h1>
            <p className="detail-description">{project.description}</p>
            {project.website ? (
              <p>
                <a href={project.website}>Visit project website</a>
              </p>
            ) : null}
          </div>
          <div className="project-cover">
            <img src={project.coverImage} alt="" />
          </div>
        </section>
      </div>

      <section className="detail-panels">
        <article className="content-panel project-body">
          <MarkdownContent markdown={project.body} />
        </article>

        <aside className="side-panel" aria-label="Project score and criteria">
          <section>
            <h2>SD Standard Score</h2>
            <div className="score-row">
              <span className="score">{project.score}</span>
              <span className="rating">{project.rating}</span>
            </div>
            <div className="score-meter" aria-hidden="true">
              <span style={{ width: `${project.score}%` }} />
            </div>
          </section>

          <section>
            <h2>Pillars</h2>
            <div className="pillar-bars">
              {pillarOrder.map((pillar) => {
                const count = pillarCounts[pillar] ?? 0;
                const width = project.criteriaDetails.length
                  ? (count / project.criteriaDetails.length) * 100
                  : 0;
                return (
                  <div className="pillar-bar" key={pillar}>
                    <span>{getPillarLabel(pillar)}</span>
                    <span className="pillar-track">
                      <span
                        style={{
                          width: `${width}%`,
                          background: `var(--${pillarCssKeys[pillar]})`,
                        }}
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2>Criteria</h2>
            <ul className="criteria-list">
              {project.criteriaDetails.map((criterion) => (
                <li key={`${criterion.displayId}-${criterion.id}`}>
                  <span>
                    {criterion.displayId} / {criterion.pillarLabel}
                  </span>
                  <strong>{criterion.label}</strong>
                  <p>{criterion.description}</p>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </section>

      {project.gallery.length ? (
        <section className="gallery-section">
          <h2>Gallery</h2>
          <div className="gallery-grid">
            {project.gallery.map((image) => (
              <img src={image} alt="" key={image} />
            ))}
          </div>
        </section>
      ) : null}

      {project.relatedProjects.length ? (
        <section className="related-section">
          <h2>Related projects</h2>
          <div className="project-grid">
            {project.relatedProjects.map((relatedProject) => (
              <Link
                className="project-card"
                href={`/projects/${relatedProject.slug}`}
                key={relatedProject.slug}
              >
                <img src={relatedProject.coverImage} alt="" />
                <div className="project-card-body">
                  <h3>{relatedProject.title}</h3>
                  <p>{relatedProject.description}</p>
                  <div className="score-row">
                    <span className="score">{relatedProject.score}</span>
                    <span className="rating">{relatedProject.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function getPillarCounts(project: Project) {
  return project.criteriaDetails.reduce<Record<string, number>>((counts, criterion) => {
    const key = getPillarKey(criterion.pillarId);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
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
