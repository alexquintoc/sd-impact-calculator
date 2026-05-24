import Link from "next/link";
import { getAllBaselines } from "../../lib/baselines";
import { getAllProjects, getPillarLabel } from "../../lib/projects";

export const metadata = {
  title: "Footprints | SD Standard",
  description: "Projects and baseline studies evaluated with the SD Standard.",
};

export default function FootprintsPage() {
  const projects = getAllProjects();
  const baselines = getAllBaselines();

  return (
    <main className="projects-shell footprints-shell">
      <p className="projects-kicker">Footprints</p>
      <h1 className="projects-heading">Projects and baseline studies</h1>
      <p className="projects-intro">
        This section is a work-in-progress. The team is currently evaluating
        existing projects and running the SD Standard against them. We are also
        creating baseline studies that evaluate the footprint of industry
        average products.
      </p>

      <aside className="section-callout projects-callout">
        <div>
          <h2>
            Featured case studies show how the Standard weighs example projects.
            Could yours be one?
          </h2>
          <p>Share a project for consideration as the SD Standard library grows.</p>
        </div>
        <Link href="mailto:info@sdstandard.org?subject=Submit%20a%20project%20for%20Footprints">
          Submit a project
        </Link>
      </aside>

      <div className="footprints-tabs">
        <input type="radio" name="footprints-view" id="footprints-projects" defaultChecked />
        <input type="radio" name="footprints-view" id="footprints-baselines" />
        <div className="footprints-toggle" aria-label="Footprint content">
          <label htmlFor="footprints-projects">Projects</label>
          <label htmlFor="footprints-baselines">Baselines</label>
        </div>

        <section className="project-grid footprints-panel projects-panel" aria-label="Projects">
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

        <section className="project-grid footprints-panel baselines-panel" aria-label="Baseline studies">
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
      </div>
    </main>
  );
}
