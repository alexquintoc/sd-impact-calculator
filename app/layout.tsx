import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SD Standard",
  description: "Sustainable Design Standard tools, projects, and baselines.",
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <Link className="site-logo" href="/">
              SD Standard
            </Link>
            <nav className="site-nav" aria-label="Main navigation">
              {navItems.map((item) => {
                if (item.children) {
                  return (
                    <div className="site-nav-group" key={item.href}>
                      <Link href={item.href}>{item.label}</Link>
                      <div className="site-subnav">
                        {item.children.map((child) => (
                          <Link href={child.href} key={child.href}>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link href={item.href} key={item.href}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="site-footer-inner">
            <div>
              <h2>SD Standard</h2>
              <p>
                An open sustainability standard for visual communication and design practitioners
              </p>
            </div>
            <nav aria-label="Footer navigation">
              {footerColumns.map((column, index) => (
                <div className="site-footer-column" key={index}>
                  {column.map((item) => (
                    <div className="site-footer-group" key={item.href}>
                      <Link href={item.href}>{item.label}</Link>
                      {item.children?.map((child) => (
                        <Link href={child.href} key={child.href}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
