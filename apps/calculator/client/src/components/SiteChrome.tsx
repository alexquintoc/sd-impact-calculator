import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { ChevronDown, Menu, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useWorkspace } from "@/workspace/WorkspaceProvider";
import { useProjectActions } from "@/public-site/ProjectActions";
import { SiteFooter } from "@/public-site/SiteFooter";
import { fetchUpdates, selectAnnouncement, type Update } from "@/lib/updates";
import { translateBriefChrome } from "@/lib/briefChromeLocale";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const workspace = useWorkspace(); const actions = useProjectActions(); const [location, navigate] = useLocation(); const search = useSearch();
  const [mobile, setMobile] = useState(false); const [closing, setClosing] = useState(false); const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState<Update | null>(null);
  const mobileButton = useRef<HTMLButtonElement>(null); const projectButton = useRef<HTMLButtonElement>(null);
  const spanish = location.startsWith("/es/") || (location.replace(/\/$/, "") === "/brief-generator" && new URLSearchParams(search).get("lang") === "es");
  const qr = location.startsWith("/es/abierto/");
  const t = (value: string) => translateBriefChrome(value, spanish);
  const nav = [...(workspace.project ? [{ label: "Workspace", href: "/workspace" }] : []), { label: "Explore", href: "/explore" }, { label: "Projects", href: "/projects" }, { label: "About", href: "/about" }];
  useEffect(() => { setMobile(false); }, [location]);
  useEffect(() => { if (!mobile) return; const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setMobile(false); mobileButton.current?.focus(); } }; window.addEventListener("keydown", escape); return () => window.removeEventListener("keydown", escape); }, [mobile]);
  useEffect(() => { fetchUpdates().then(items => { const selected = selectAnnouncement(items); if (!selected) return; let dismissed = false; try { dismissed = localStorage.getItem(`sd-standard:announcement:${selected.slug}`) === "dismissed"; } catch { /* Optional preference. */ } if (!dismissed) setAnnouncement(selected); }).catch(() => undefined); }, []);
  const title = workspace.project?.project.title.trim() || "Untitled project";
  return <div className="public-site">
    <a className="public-skip" href="#main-content">Skip to content</a>
    {announcement && !spanish && <aside className="public-announcement" aria-label="Announcement"><p>{announcement.announcementText || announcement.title} <Link href={`/about/updates/${announcement.slug}`}>{announcement.announcementLinkLabel || "Learn more"}</Link></p><button aria-label="Dismiss announcement" onClick={() => { try { localStorage.setItem(`sd-standard:announcement:${announcement.slug}`, "dismissed"); } catch { /* Optional preference. */ } setAnnouncement(null); }}><X size={18} /></button></aside>}
    <header className="public-header">
      <div className="public-header-inner">
        <Link href="/" className="public-logo">SD Standard</Link>
        {!qr && <><nav className={`public-nav ${mobile ? "is-open" : ""}`} id="main-navigation" aria-label="Main navigation">{nav.map(item => <Link href={item.href} key={item.href} aria-current={location.startsWith(item.href) || (item.href === "/explore" && location === "/es/criteria") ? "page" : undefined}>{t(item.label)}</Link>)}</nav>
          <div className="public-project-control">{workspace.project ? <DropdownMenu><DropdownMenuTrigger asChild><button ref={projectButton} className="public-project-name" title={title}><span>{title}</span><ChevronDown size={16} aria-hidden="true" /></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="public-menu">{[{ label: "Overview", path: "/workspace" }, { label: "Components", path: "/workspace/components" }, { label: "Criteria", path: "/workspace/criteria" }].map(item => <DropdownMenuItem key={item.path} onSelect={() => navigate(item.path)}>{item.label}</DropdownMenuItem>)}<DropdownMenuSeparator /><DropdownMenuItem onSelect={actions.download}>Download JSON</DropdownMenuItem><DropdownMenuItem onSelect={() => { setError(""); setClosing(true); }}>Close project</DropdownMenuItem></DropdownMenuContent></DropdownMenu> : <button className="public-button compact" disabled={workspace.localState === "loading"} onClick={actions.open}>Open Project</button>}</div>
          <button ref={mobileButton} className="public-menu-toggle" aria-expanded={mobile} aria-controls="main-navigation" aria-label={mobile ? "Close main navigation" : "Open main navigation"} onClick={() => setMobile(!mobile)}>{mobile ? <X size={22} /> : <Menu size={22} />}</button>
        </>}
      </div>
    </header>
    <div id="main-content" tabIndex={-1}>{children}</div>
    {!qr && <SiteFooter t={t} />}
    <AlertDialog open={closing} onOpenChange={setClosing}><AlertDialogContent className="public-dialog" onCloseAutoFocus={event => { event.preventDefault(); projectButton.current?.focus(); }}><AlertDialogHeader><AlertDialogTitle>Close “{title}”?</AlertDialogTitle><AlertDialogDescription>The project will remain saved in this browser. Download a JSON file if you want a portable copy.</AlertDialogDescription></AlertDialogHeader>{error && <p role="alert">{error}</p>}<AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="public-button" onClick={event => { event.preventDefault(); if (workspace.closeProject()) { setClosing(false); navigate("/"); } else setError("Could not save locally. The project remains open. Try again or download a JSON copy."); }}>Close project</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>;
}
