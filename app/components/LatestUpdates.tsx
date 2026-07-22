import Link from "next/link";
import type { Update } from "../../lib/updates";
import { UpdatesList } from "./UpdatesList";

export function LatestUpdates({ updates }: { updates: Update[] }) {
  if (!updates.length) return null;
  return (
    <section className="latest-updates" aria-labelledby="latest-updates-title">
      <div className="section-heading-row">
        <div><p className="projects-kicker">News and announcements</p><h2 id="latest-updates-title">Latest Updates</h2></div>
        <Link className="button-link" href="/updates">View all updates</Link>
      </div>
      <UpdatesList headingLevel={3} updates={updates.slice(0, 3)} />
    </section>
  );
}
