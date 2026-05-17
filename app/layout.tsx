import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SD Standard",
  description: "Sustainable Design Standard tools, projects, and baselines.",
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "Impact Calculator", href: "/calculator/" },
  { label: "Brief Generator", href: "/brief-generator/" },
  { label: "Quick Project Scan", href: "/project-scan/" },
  { label: "Knowledge Base", href: "/knowledge-base/" },
  { label: "Projects", href: "/projects" },
  { label: "Baselines", href: "/baselines" },
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
              {navItems.map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="site-footer-inner">
            <div>
              <h2>SD Standard</h2>
              <p>
                An open sustainability standard for visual
                communication and design.
              </p>
            </div>
            <nav aria-label="Footer navigation">
              {navItems.map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
