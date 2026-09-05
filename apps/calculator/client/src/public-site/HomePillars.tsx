import type { CSSProperties } from "react";
import { Link } from "wouter";
import { HeroPillarCircles } from "@/components/HeroPillarCircles";
import { PILLAR_COLORS } from "@/lib/pillar-colors";
import { pillars } from "./content";

export function HomePillars() {
  return (
    <section className="home-pillars" aria-labelledby="home-pillars-heading">
      <div className="home-standard-intro">
        <div className="home-standard-copy">
          <p className="public-eyebrow">What is the SD Standard?</p>
          <h2 id="home-pillars-heading">A living framework for interconnected design and creative decision-making.</h2>
          <p>
            The Sustainable Design Standard helps creatives understand impact, create options and build future-focused projects through four interconnected pillars.
          </p>
        </div>
        <div className="home-circle-stage" aria-hidden="true">
          <HeroPillarCircles className="home-pillar-circles" />
        </div>
      </div>

      <div className="home-pillar-grid">
        {pillars.map((pillar) => (
          <article
            className="home-pillar-card"
            key={pillar.colorKey}
            style={{ "--pillar-color": PILLAR_COLORS[pillar.colorKey] } as CSSProperties}
          >
            <span className="home-pillar-rule" aria-hidden="true" />
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
            <p className="home-pillar-themes"><span>Topics</span>{pillar.themes.slice(0, 3).join(", ")}</p>
            <Link className="public-link" href={`/explore/criteria?pillar=${pillar.colorKey}`}>
              Learn more about {pillar.title.toLowerCase()} →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
