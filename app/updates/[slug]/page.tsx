import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "../../components/MarkdownContent";
import { formatUpdateDate } from "../../components/UpdateCard";
import { getAllUpdates, getUpdate } from "../../../lib/updates";

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getAllUpdates().map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps) {
  const update = getUpdate((await params).slug);
  if (!update) return {};
  const url = `/updates/${update.slug}`;
  return { title: `${update.title} | SD Standard`, description: update.summary, alternates: { canonical: url }, openGraph: { title: update.title, description: update.summary, type: "article", publishedTime: update.publishedDate, url, images: update.featuredImage ? [{ url: update.featuredImage, alt: update.imageAlt }] : undefined } };
}
export default async function UpdatePage({ params }: PageProps) {
  const update = getUpdate((await params).slug);
  if (!update) notFound();
  return <main className="updates-shell update-detail"><Link className="back-link" href="/updates">Back to all updates</Link><article><header><div className="update-meta"><span>{update.category}</span><time dateTime={update.publishedDate}>{formatUpdateDate(update.publishedDate)}</time></div><h1 className="detail-title">{update.title}</h1>{update.summary ? <p className="detail-description">{update.summary}</p> : null}</header>{update.featuredImage ? <img className="update-featured-image" src={update.featuredImage} alt={update.imageAlt ?? ""} /> : null}<div className="content-panel project-body update-body"><MarkdownContent markdown={update.body} /></div></article></main>;
}
