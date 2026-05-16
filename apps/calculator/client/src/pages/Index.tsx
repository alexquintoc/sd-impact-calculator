const resources = [
  {
    title: "Knowledge Base",
    description: "Explore the SD Standard criteria, terms, and guidance notes.",
    href: "/knowledge-base/",
    linkText: "Open Knowledge Base",
  },
  {
    title: "Impact Calculator",
    description: "Evaluate a design project against the SD Standard criteria.",
    href: "/calculator/",
    linkText: "Open Impact Calculator",
  },
  {
    title: "Design Brief Generator",
    description:
      "Generate ambitious design brief concepts by balancing environment, society, culture, and finance.",
    href: "/brief-generator/",
    linkText: "Open Brief Generator",
  },
  {
    title: "Quick Project Scan",
    description:
      "Scan an early project description for likely SD Standard criteria matches and opportunities.",
    href: "/quick-project-scan/",
    linkText: "Open Quick Project Scan",
  },
];

export default function Index() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#1f241f]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
            Sustainable Design Standard
          </p>
          <h1 className="text-5xl font-extrabold leading-[0.98] tracking-normal sm:text-6xl lg:text-7xl">
            SD Standard
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f5a50] sm:text-xl">
            Tools and resources for applying sustainable design criteria to
            communication design projects.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {resources.map((resource) => (
            <a
              key={resource.title}
              href={resource.href}
              className="group flex min-h-72 flex-col justify-between rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-7 shadow-[0_18px_50px_rgba(45,39,28,0.08)] transition hover:-translate-y-1 hover:border-[#28775e] hover:shadow-[0_24px_60px_rgba(45,39,28,0.12)] focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
            >
              <span>
                <span className="mb-6 block h-2 w-16 rounded-full bg-[#28775e]" />
                <h2 className="text-2xl font-extrabold tracking-normal">
                  {resource.title}
                </h2>
                <p className="mt-4 text-base leading-7 text-[#5f5a50]">
                  {resource.description}
                </p>
              </span>

              <span className="mt-10 inline-flex items-center text-sm font-extrabold text-[#28775e]">
                {resource.linkText}
                <span
                  className="ml-2 transition group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  -&gt;
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
