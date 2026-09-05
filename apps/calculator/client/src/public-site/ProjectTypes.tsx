import { PageIntro, PageMeta } from "./PageIntro";
import { projectTypes } from "./project-types";
import { useProjectActions } from "./ProjectActions";
export default function ProjectTypes() {
  const { start } = useProjectActions();
  return <main className="public-page"><PageMeta title="Project Types" description="Find your design practice and start a project in the SD Standard Workspace." /><PageIntro title="Start with what you’re making." description="A project can include more than one project type. An exhibition may also include publications, a website, signage and an event." /><div className="public-types">{projectTypes.map(type => <section id={type.id} key={type.id}><h2>{type.name}</h2><p>{type.summary}</p><p className="public-examples">{type.examples}</p><button className="public-link" onClick={() => start(type.id)}>Start a {type.name.toLowerCase()} project →</button></section>)}</div><p className="public-count">Starting a project sets its type. Review criteria separately in the Workspace; none are added automatically.</p></main>;
}
