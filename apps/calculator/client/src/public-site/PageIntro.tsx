import { useEffect, type ReactNode } from "react";
export function PageMeta({ title, description, lang = "en" }: { title: string; description: string; lang?: string }) {
  useEffect(() => {
    document.title = `${title} | SD Standard`; document.documentElement.lang = lang;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.append(meta); }
    meta.content = description;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
    canonical.href = `https://sdstandard.org${window.location.pathname.replace(/\/$/, "") || "/"}`;
    return () => { document.documentElement.lang = "en"; document.title = "SD Standard"; canonical?.remove(); };
  }, [title, description, lang]); return null;
}
export function PageIntro({ title, description, eyebrow = "Explore the Standard", children }: { title: string; description: string; eyebrow?: string; children?: ReactNode }) {
  return <header className="public-intro"><p className="public-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p>{children}</header>;
}
