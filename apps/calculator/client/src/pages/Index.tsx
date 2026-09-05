import { Link } from "wouter";
import { useWorkspace } from "@/workspace/WorkspaceProvider";
import { useProjectActions } from "@/public-site/ProjectActions";
import { PageMeta } from "@/public-site/PageIntro";
export default function Index() {
  const actions = useProjectActions(); const { project } = useWorkspace();
  return <main className="public-page"><PageMeta title="Design with impact in mind" description="Use the SD Standard to define, improve, evaluate and document the environmental, social, cultural and financial impact of communication design." />
    <section className="public-hero"><div><p className="public-eyebrow">Sustainable Design Standard</p><h1>Design with<br />impact in mind.</h1><p className="public-deck">Define, improve, evaluate and document the environmental, social, cultural and financial impact of communication design.</p><div className="public-actions"><Link className="public-button" href="/brief-generator">Generate a brief →</Link></div></div><div className="public-start"><h2>Start a new project</h2><p>Bring your work into one Project Workspace. Start with a brief, choose a project type, or begin with a blank project.</p><div className="public-actions"><Link className="public-link" href="/explore/project-types">Choose a project type →</Link><button className="public-link" onClick={() => actions.start()}>Start a blank project →</button></div></div></section>
    <section className="public-section"><h2>Continue a project</h2>{project && <p>Your open project: <strong>{project.project.title}</strong></p>}<div className="public-actions">{project && <Link className="public-button" href="/workspace">Continue in Workspace →</Link>}<button className="public-link" onClick={actions.open}>Open project JSON →</button><button className="public-link" onClick={actions.resume}>Open a saved local project →</button></div></section>
    <section className="public-section"><h2>Explore before starting</h2><div className="public-discovery"><Link href="/explore/criteria">Browse criteria <span aria-hidden="true">↗</span></Link><Link href="/explore/project-types">Browse project types <span aria-hidden="true">↗</span></Link><Link href="/projects">View projects <span aria-hidden="true">↗</span></Link><Link href="/explore">Understand the Standard <span aria-hidden="true">↗</span></Link></div></section>
  </main>;
}
