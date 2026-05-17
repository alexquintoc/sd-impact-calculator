import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useLocation } from "wouter";

type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Tools and Resources",
    href: "/#tools-resources",
    children: [
      { label: "Impact Calculator", href: "/calculator" },
      { label: "Brief Generator", href: "/brief-generator" },
      { label: "Quick Project Scan", href: "/quick-project-scan" },
      { label: "Knowledge Base", href: "/knowledge-base" },
    ],
  },
  { label: "Projects", href: "/projects" },
  { label: "Baselines", href: "/baselines" },
  { label: "Get Involved", href: "/#get-involved" },
];

const footerColumns: NavItem[][] = [
  [{ label: "Home", href: "/" }],
  [
    {
      label: "Tools and Resources",
      href: "/#tools-resources",
      children: [
        { label: "Impact Calculator", href: "/calculator" },
        { label: "Brief Generator", href: "/brief-generator" },
        { label: "Quick Project Scan", href: "/quick-project-scan" },
        { label: "Knowledge Base", href: "/knowledge-base" },
      ],
    },
  ],
  [
    { label: "Projects", href: "/projects" },
    { label: "Baselines", href: "/baselines" },
  ],
  [
    { label: "Get Involved", href: "/#get-involved" },
    { label: "Get in Touch", href: "mailto:info@sdstandard.org" },
  ],
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
              const active =
                isActive(location, item.href) ||
                Boolean(item.children?.some((child) => isActive(location, child.href)));
              if (item.children) {
                return (
                  <div className="group relative" key={item.href}>
                    <a className={`${getNavLinkClasses(active)} inline-flex items-center gap-1`} href={item.href}>
                      {item.label}
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <div className="invisible absolute left-0 top-full z-20 min-w-56 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <div className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-2 shadow-[0_18px_50px_rgba(45,39,28,0.12)]">
                        {item.children.map((child) => {
                          const childActive = isActive(location, child.href);
                          return (
                            <a
                              className={`block rounded-md px-3 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#85bba8] ${
                                childActive
                                  ? "bg-[#e5efe9] text-[#28775e]"
                                  : "text-[#5f5a50] hover:bg-white hover:text-[#1f241f]"
                              }`}
                              href={child.href}
                              key={child.href}
                            >
                              {child.label}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

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
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto] lg:px-10">
          <div className="max-w-xl">
            <h2 className="text-xl font-extrabold">SD Standard</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              An open sustainability standard for visual communication and design practitioners
            </p>
          </div>
          <nav className="grid gap-6 sm:grid-cols-2 md:min-w-[34rem] md:grid-cols-4" aria-label="Footer navigation">
            {footerColumns.map((column, index) => (
              <div className="grid content-start gap-2" key={index}>
                {column.map((item) => (
                  <div className="grid gap-2" key={item.href}>
                    <a className="text-sm font-extrabold text-white/80 hover:text-white" href={item.href}>
                      {item.label}
                    </a>
                    {item.children?.map((child) => (
                      <a className="text-sm font-bold text-white/65 hover:text-white" href={child.href} key={child.href}>
                        {child.label}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
