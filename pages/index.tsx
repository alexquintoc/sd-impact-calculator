import Head from "next/head";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>SD Standard Tina Demo</title>
      </Head>
      <main
        style={{
          maxWidth: "48rem",
          margin: "0 auto",
          padding: "4rem 1.5rem",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          lineHeight: 1.5,
        }}
      >
        <p style={{ color: "#4b5563", marginBottom: "0.75rem" }}>
          Sustainable Design Standard
        </p>
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>TinaCMS demo</h1>
        <p style={{ color: "#374151", fontSize: "1.125rem" }}>
          This root Next.js app hosts the TinaCMS admin and generated demo blog
          pages.
        </p>
        <ul style={{ paddingLeft: "1.25rem" }}>
          <li>
            <Link href="/admin/index.html">Open Tina admin</Link>
          </li>
          <li>
            <Link href="/demo/blog/hello-world">Open demo blog post</Link>
          </li>
        </ul>
      </main>
    </>
  );
}
