import type { ReactNode } from "react";
import { useLocation } from "wouter";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Impact Calculator", href: "/calculator/" },
  { label: "Brief Generator", href: "/brief-generator/" },
  { label: "Quick Project Scan", href: "/project-scan/" },
  { label: "Knowledge Base", href: "/knowledge-base/" },
  { label: "Projects", href: "/projects/" },
  { label: "Baselines", href: "/baselines/" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href.replace(/\/$/, "") || pathname.startsWith(href);
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
                  className={`rounded-md px-3 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#85bba8] ${
                    active
                      ? "bg-[#e5efe9] text-[#28775e]"
                      : "text-[#5f5a50] hover:bg-white hover:text-[#1f241f]"
                  }`}
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
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto] lg:px-10">
          <div className="max-w-xl">
            <h2 className="text-xl font-extrabold">SD Standard</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              An open sustainability standard for evaluating visual communication
              and design work across environment, society, culture, and finance.
            </p>
          </div>
          <nav className="flex flex-wrap gap-3 md:max-w-md md:justify-end" aria-label="Footer navigation">
            {navItems.map((item) => (
              <a className="text-sm font-bold text-white/75 hover:text-white" href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
