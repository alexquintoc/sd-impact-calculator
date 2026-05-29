import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { Github, Instagram, Linkedin, Menu, X } from "lucide-react";
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
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const scrollToHash = (hash: string) => {
    const target = document.querySelector(hash);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    target?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const handleNavClick = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);

    if (href === "/#get-involved") {
      event.preventDefault();

      if (location !== "/") {
        setLocation("/");
      }

      window.history.pushState(null, "", "/#get-involved");
      window.setTimeout(() => scrollToHash("#get-involved"), 80);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f5ef] text-[#1f241f]">
      <header className="border-b border-[#d9d4c8] bg-[#fffdf8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <a href="/" className="text-lg font-extrabold tracking-normal text-[#1f241f]">
            SD Standard
          </a>
          <button
            aria-controls="mobile-navigation"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close main navigation" : "Open main navigation"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#d9d4c8] bg-[#fffdf8] text-[#1f241f] transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#85bba8] lg:hidden"
            type="button"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
          <nav className="hidden flex-wrap gap-2 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = isActive(location, item.href);
              return (
                <a
                  className={getNavLinkClasses(active)}
                  href={item.href}
                  key={item.href}
                  onClick={handleNavClick(item.href)}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
        <nav
          aria-label="Mobile navigation"
          className={`${mobileMenuOpen ? "grid" : "hidden"} border-t border-[#d9d4c8] bg-[#fffdf8] px-5 py-3 shadow-[0_18px_40px_rgba(45,39,28,0.08)] sm:px-8 lg:hidden`}
          id="mobile-navigation"
        >
          {navItems.map((item) => {
            const active = isActive(location, item.href);
            return (
              <a
                className={`${getNavLinkClasses(active)} block`}
                href={item.href}
                key={item.href}
                onClick={handleNavClick(item.href)}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </header>

      {children}

      <footer className="border-t border-[#d9d4c8] bg-[#1f241f] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(10rem,auto)_minmax(9rem,auto)] lg:px-10">
          <div className="max-w-xl">
            <h2 className="text-xl font-extrabold">SD Standard</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              An open sustainability standard for visual communication and design practitioners
            </p>
            <form
              action="https://buttondown.com/api/emails/embed-subscribe/sdstandard"
              method="post"
              className="embeddable-buttondown-form mt-6 grid max-w-md gap-3"
            >
              <p className="m-0 text-sm leading-6 text-white/80">
                Get occasional updates about the SD Standard.
              </p>
              <label className="text-sm font-extrabold text-white/90" htmlFor="bd-email">
                Enter your email
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  className="min-w-0 flex-1 rounded-md border border-white/25 bg-white/10 px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-[#85bba8] focus:ring-4 focus:ring-[#85bba8]/25"
                  type="email"
                  name="email"
                  id="bd-email"
                  required
                />
                <input
                  className="cursor-pointer rounded-md border border-[#85bba8] bg-[#85bba8] px-4 py-3 text-sm font-extrabold text-[#1f241f] transition hover:border-[#a3d5bb] hover:bg-[#a3d5bb]"
                  type="submit"
                  value="Subscribe"
                />
              </div>
              <p className="m-0 text-xs leading-5">
                <a
                  className="font-bold text-white/60 hover:text-white"
                  href="https://buttondown.com/refer/sdstandard"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Powered by Buttondown.
                </a>
              </p>
            </form>
          </div>
          <nav className="grid content-start gap-3" aria-label="Footer navigation">
            {footerNavItems.map((item) => (
              <a className="text-sm font-extrabold text-white/80 hover:text-white" href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="grid content-start gap-4">
            <a
              className="text-sm font-extrabold text-white/80 hover:text-white"
              href="/#get-involved"
              onClick={handleNavClick("/#get-involved")}
            >
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
