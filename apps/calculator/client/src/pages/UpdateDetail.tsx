import { useEffect, useState } from "react";
import { MarkdownContent } from "@/components/MarkdownContent";
import { fetchUpdate, type Update } from "@/lib/updates";

export default function UpdateDetail({ params }: { params: { slug: string } }) {
  const [item, setItem] = useState<Update | null>();
  useEffect(() => { fetchUpdate(params.slug).then(setItem).catch(() => setItem(null)); }, [params.slug]);

  if (item === undefined) return <main className="mx-auto max-w-4xl p-10">Loading update…</main>;
  if (item === null) return <main className="mx-auto max-w-4xl p-10"><h1 className="text-4xl font-extrabold">Update not found</h1></main>;

  return (
    <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <a className="font-bold text-[#28775e]" href="/updates">Back to all updates</a>
      <article className="mt-8">
        <div className="flex flex-wrap gap-4 text-sm font-bold text-[#5f5a50]">
          <span className="uppercase text-[#28775e]">{item.category}</span>
          <time dateTime={item.publishedDate}>{new Date(item.publishedDate).toLocaleDateString("en", { dateStyle: "long", timeZone: "UTC" })}</time>
        </div>
        <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">{item.title}</h1>
        {item.summary ? <p className="mt-5 text-xl leading-8 text-[#5f5a50]">{item.summary}</p> : null}
        {item.featuredImage ? <img className="mt-8 w-full rounded-lg" src={item.featuredImage} alt={item.imageAlt ?? ""} /> : null}
        <div className="mt-8 rounded-lg border border-[#d9d4c8] bg-white p-6 sm:p-8">
          <MarkdownContent markdown={item.body} />
        </div>
      </article>
    </main>
  );
}
