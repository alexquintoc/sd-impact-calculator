import type { Update } from "../../lib/updates";
import { UpdateCard } from "./UpdateCard";

export function UpdatesList({ updates, headingLevel = 2 }: { updates: Update[]; headingLevel?: 2 | 3 }) {
  if (!updates.length) {
    return <p className="updates-empty">There are no published updates yet. Please check back soon.</p>;
  }
  return <div className="updates-grid">{updates.map((update) => <UpdateCard headingLevel={headingLevel} key={update.slug} update={update} />)}</div>;
}
