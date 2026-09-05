import { Link } from "wouter";
import { useWorkspace } from "@/workspace/WorkspaceProvider";
import { useProjectActions } from "@/public-site/ProjectActions";
import { PageMeta } from "@/public-site/PageIntro";
import { HomeProjectActions } from "@/public-site/HomeProjectActions";
import { HomePillars } from "@/public-site/HomePillars";
import { HomePilotCallout } from "@/public-site/HomePilotCallout";
export default function Index() {
  const actions = useProjectActions(); const { project } = useWorkspace();
  return <main className="public-page home-page"><PageMeta title="Design with impact in mind" description="Use the SD Standard to define, improve, evaluate and document the environmental, social, cultural and financial impact of communication design." />
    <section className="public-hero home-hero">
      <div className="home-hero-copy"><p className="public-eyebrow">Sustainable Design Standard</p><h1>Design with<br />impact in mind.</h1><p className="public-deck">Define, improve, evaluate and document the environmental, social, cultural and financial impact of communication design.</p><div className="public-actions"><Link className="public-button" href="/brief-generator">Generate a brief →</Link></div></div>
      <HomeProjectActions actions={actions} projectTitle={project?.project.title} />
    </section>
    <HomePillars />
    <section className="public-section home-explore"><h2>Explore before starting</h2><div className="public-discovery"><Link href="/explore/criteria">Browse criteria <span aria-hidden="true">↗</span></Link><Link href="/explore/project-types">Browse project types <span aria-hidden="true">↗</span></Link><Link href="/projects">View projects <span aria-hidden="true">↗</span></Link></div></section>
    <HomePilotCallout />
  </main>;
}
