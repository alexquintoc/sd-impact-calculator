import Link from "next/link";
import type { Update } from "../../lib/updates";

export function UpdateCard({ update, headingLevel = 2 }: { update: Update; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  return (
    <article className="update-card">
      {update.featuredImage ? (
        <Link href={`/updates/${update.slug}`} tabIndex={-1} aria-hidden="true">
          <img src={update.featuredImage} alt={update.imageAlt ?? ""} />
        </Link>
      ) : null}
      <div className="update-card-body">
        <div className="update-meta">
          <span>{update.category}</span>
          <time dateTime={update.publishedDate}>{formatUpdateDate(update.publishedDate)}</time>
        </div>
        <Heading><Link href={`/updates/${update.slug}`}>{update.title}</Link></Heading>
        {update.summary ? <p>{update.summary}</p> : null}
      </div>
    </article>
  );
}

export function formatUpdateDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(value));
}
