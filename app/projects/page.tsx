import Link from "next/link";
import { getAllProjects, getPillarLabel } from "../../lib/projects";

export const metadata = {
  title: "Projects | SD Standard",
  description: "Project examples mapped to SD Standard pillars and criteria.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="projects-shell">
      <p className="projects-kicker">SD Standard</p>
      <h1 className="projects-heading">Project examples</h1>
      <p className="projects-intro">
        Explore design projects mapped to SD Standard pillars, criteria, scores,
        and ratings. Each entry is powered by MDX content managed through
        TinaCMS.
      </p>

      <aside className="section-callout projects-callout">
        <div>
          <h2>Compare projects against baseline studies</h2>
          <p>
            Baselines provide reference assumptions for common design formats,
            making it easier to understand where a project performs above or
            below an expected model.
          </p>
        </div>
        <Link href="/baselines">View baselines</Link>
      </aside>

      <section className="project-grid" aria-label="Projects">
        {projects.map((project) => (
          <Link className="project-card" href={`/projects/${project.slug}`} key={project.slug}>
            <img src={project.coverImage} alt="" />
            <div className="project-card-body">
              <div className="project-meta">
                <span>{project.year}</span>
                <span>{project.location}</span>
                <span>{project.projectType}</span>
              </div>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <div className="tag-list" aria-label="Pillars">
                {project.pillars.map((pillar) => (
                  <span className="tag" key={pillar}>
                    {getPillarLabel(pillar)}
                  </span>
                ))}
              </div>
              <div className="score-row">
                <span className="score">{project.score}</span>
                <span className="rating">{project.rating}</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
