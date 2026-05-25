import type { ReactNode } from "react";
import { Github, Instagram, Linkedin } from "lucide-react";
import { useLocation } from "wouter";

type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { label: "Footprints", href: "/footprints" },
  { label: "Impact Snapshot", href: "/impact-snapshot" },
  { label: "Evaluate", href: "/calculator" },
  { label: "Learn", href: "/knowledge-base" },
  { label: "Imagine", href: "/brief-generator" },
  { label: "Get Involved", href: "/#get-involved" },
];

const footerNavItems: NavItem[] = [
  { label: "Footprints", href: "/footprints" },
  { label: "Impact Snapshot", href: "/impact-snapshot" },
  { label: "Evaluate", href: "/calculator" },
  { label: "Learn", href: "/knowledge-base" },
  { label: "Imagine", href: "/brief-generator" },
];

const socialItems = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/sd-standard",
    Icon: Linkedin,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/sdstandard",
    Icon: Instagram,
  },
  {
    label: "GitHub",
    href: "https://github.com/alexquintoc/sd-standard",
    Icon: Github,
  },
];

function isActive(pathname: string, href: string) {
  if (href.includes("#")) {
    return false;
  }

  const path = href.split("#")[0];

  if (path === "/") {
    return pathname === "/";
  }

  return pathname === path.replace(/\/$/, "") || pathname.startsWith(path);
}

const navLinkClasses =
  "rounded-md px-3 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#85bba8]";

function getNavLinkClasses(active: boolean) {
  return `${navLinkClasses} ${
    active
      ? "bg-[#e5efe9] text-[#28775e]"
      : "text-[#5f5a50] hover:bg-white hover:text-[#1f241f]"
  }`;
}

export default function SiteChrome({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1f241f]">
      <header className="border-b border-[#d9d4c8] bg-[#fffdf8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <a href="/" className="text-lg font-extrabold tracking-normal text-[#1f241f]">
            SD Standard
          </a>
          <nav className="flex flex-wrap gap-2" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = isActive(location, item.href);
              return (
                <a
                  className={getNavLinkClasses(active)}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t border-[#d9d4c8] bg-[#1f241f] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(10rem,auto)_minmax(9rem,auto)] lg:px-10">
          <div className="max-w-xl">
            <h2 className="text-xl font-extrabold">SD Standard</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              An open sustainability standard for visual communication and design practitioners
            </p>
          </div>
          <nav className="grid content-start gap-3" aria-label="Footer navigation">
            {footerNavItems.map((item) => (
              <a className="text-sm font-extrabold text-white/80 hover:text-white" href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="grid content-start gap-4">
            <a className="text-sm font-extrabold text-white/80 hover:text-white" href="/#get-involved">
              Get Involved
            </a>
            <div className="flex gap-2" aria-label="Social media">
              {socialItems.map(({ label, href, Icon }) => (
                <a
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white/80 hover:border-white/70 hover:text-white"
                  href={href}
                  key={href}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
