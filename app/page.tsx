import Link from "next/link";

export default function HomePage() {
  return <main><section className="home-hero"><p className="projects-kicker">Sustainable Design Standard</p><h1>Design with impact in mind.</h1><p>An open sustainability standard for visual communication and design practitioners.</p><Link className="button-link" href="/knowledge-base">Explore the standard</Link></section></main>;
}
