import { Link } from "wouter";
import { PageIntro, PageMeta } from "./PageIntro";
import { abiertoPassport, type ProjectPassportData } from "./passports";
export function ProjectContributors({ contributors }: Pick<ProjectPassportData, "contributors">) {
  return <section className="public-section public-collaborators"><p className="public-eyebrow">The people around the project</p><h2>Collaborators and service providers</h2>{contributors.length ? <div className="public-people">{contributors.map(person => <article key={person.name}><h3>{person.name}</h3><p>{person.role}</p></article>)}</div> : <><p>The collaborator section is in development. Names and roles will be added as project information is confirmed.</p><p>This section will document the people and organizations involved in making the installation possible.</p></>}</section>;
}
export function ProjectPassport({ project }: { project: ProjectPassportData }) {
  return <main className="public-page public-passport"><PageMeta title={project.title} description={project.subtitle} /><PageIntro title={project.title} description={project.subtitle} eyebrow="Project Passport · In development" /><dl className="public-project-meta"><div><dt>Project type</dt><dd>Exhibition installation</dd></div><div><dt>Location</dt><dd>{project.location}</dd></div><div><dt>Event dates</dt><dd>{project.dates}</dd></div></dl>
    <section className="public-section"><h2>Project overview</h2><p>{project.overview}</p><p>Opening hours and participation details are to be confirmed.</p><Link className="public-link" href="/about/updates/abierto-de-diseno-cdmx-2026">Read the project announcement →</Link></section>
    <section className="public-section"><h2>Documenting the project</h2><p>This passport is being developed alongside the installation. Component information, selected criteria, strategies and evidence will be added when confirmed.</p><dl className="public-report-status"><div><dt>Impact Snapshot</dt><dd>Not yet published</dd></div><div><dt>Outcomes and evidence</dt><dd>Not yet published</dd></div></dl><h3 className="public-small-heading">Limitations</h3><p>This page introduces the project. It does not yet provide measured impact results or a completed assessment.</p></section>
    <section className="public-section"><h2>What comes after the exhibition?</h2><p>Help explore the next phase of life for the Abierto installation.</p><Link className="public-link" href="/es/abierto/segunda-vida">Colabora en la segunda vida de la instalación →</Link></section>
    <ProjectContributors contributors={project.contributors} />
    <section className="public-section"><h2>Follow the work</h2><div className="public-actions"><Link className="public-link" href="/about/get-involved">Participate →</Link><Link className="public-link" href="/projects">All projects →</Link></div></section>
  </main>;
}
export default function AbiertoPassport() { return <ProjectPassport project={abiertoPassport} />; }
