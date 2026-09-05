import { PageIntro, PageMeta } from "./PageIntro";
import { involvementGroups } from "./content";
import { contributionWays } from "./about-content";
export default function GetInvolved() {
  return <main className="public-page"><PageMeta title="Get Involved" description="Test the SD Standard, run a pilot project, or contribute research, guidance and design experience." /><PageIntro title="Help the Standard grow through practice." eyebrow="Get involved" description="The SD Standard is a living and evolving framework built on collaboration." />
    <section className="public-pilot"><p className="public-eyebrow">Call for Pilots</p><h2>Test the Standard.<br />Run a pilot project.</h2><p>Designers, studios, schools, organizations, clients and design associations: bring a project and help explore how the Standard works in practice.</p><a className="public-button" href="mailto:info@sdstandard.org?subject=SD%20Standard%20pilot%20interest">Express interest in a pilot →</a></section>
    <section className="public-section"><h2>Ways to participate</h2><ul className="public-contribution-list">{contributionWays.map(item => <li key={item}>{item}</li>)}</ul></section>
    <section className="public-section"><h2>Build with creatives, researchers and partners.</h2><div className="public-types">{involvementGroups.map(group => <article key={group.title}><h3>{group.title}</h3><p>{group.for.join(", ")}.</p><h4>Ways to collaborate</h4><p>{group.contributions.join(", ")}.</p></article>)}</div></section>
    <section className="public-section"><h2>Start a conversation</h2><p>Share your interests, experience or questions with the team.</p><a className="public-link" href="mailto:info@sdstandard.org">info@sdstandard.org →</a></section>
  </main>;
}
