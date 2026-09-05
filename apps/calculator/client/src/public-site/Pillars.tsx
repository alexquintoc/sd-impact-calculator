import type { CSSProperties } from "react";
import { Link } from "wouter";
import { PILLAR_COLORS } from "@/lib/pillar-colors";
import { pillars } from "./content";
import { PageIntro, PageMeta } from "./PageIntro";
export default function Pillars() {
  return <main className="public-page"><PageMeta title="Four Pillars" description="Environment, Society, Culture and Finance: four perspectives on the impact of communication design." /><PageIntro title="Four perspectives. One design practice." description="Consider environmental, social, cultural and financial impact together. Each pillar offers a different way to question and improve design decisions." />{pillars.map(pillar => <section className="public-pillar" key={pillar.colorKey} style={{ "--pillar-color": PILLAR_COLORS[pillar.colorKey] } as CSSProperties}><h2><span className="public-pillar-mark" />{pillar.title}</h2><div><p>{pillar.description}</p><p className="public-count">{pillar.themes.join(" · ")}</p><Link className="public-link" href={`/explore/criteria?pillar=${pillar.colorKey}`}>View {pillar.title.toLowerCase()} criteria →</Link></div></section>)}</main>;
}
