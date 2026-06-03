import {
  ArrowRight,
  BookOpen,
  Calculator,
  Footprints as FootprintsIcon,
  Loader2,
  PenLine,
  ScanLine,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { HeroPillarCircles } from "@/components/HeroPillarCircles";
import { PILLAR_COLORS, type PillarColorKey } from "@/lib/pillar-colors";
import { fetchProjects, type ProjectSummary } from "@/lib/projects";

// HOMEPAGE COPY: Edit the objects in this block to change the main language on `/`.
// These are hand-authored strings and are separate from generated Knowledge Base files.
const heroAction = {
  label: "Start by Generating a Sustainable Design Brief",
  href: "/brief-generator/",
};

const pillars = [
  {
    title: "Environment",
    description: "Focus on ecological impact, natural resources, and the full lifecycle of design outputs.",
    themes: ["materials", "emissions", "waste", "energy", "lifecycle impact"],
    href: "/knowledge-base/generated/pillars/environment.html",
    colorKey: "environment",
  },
  {
    title: "Society",
    description: "Focus on equity, accessibility, labour conditions, and social well-being.",
    themes: ["accessibility", "labour rights", "education", "equity", "participation"],
    href: "/knowledge-base/generated/pillars/society.html",
    colorKey: "society",
  },
  {
    title: "Culture",
    description: "Focus on identity, heritage, language, diversity, and community participation.",
    themes: ["local identity", "Indigenous culture", "diversity", "language preservation", "audience participation"],
    href: "/knowledge-base/generated/pillars/culture.html",
    colorKey: "culture",
  },
  {
    title: "Finance",
    description: "Focus on economic sustainability, accountability, and long-term value.",
    themes: ["transparency", "fair compensation", "profitability", "accountability", "long-term value"],
    href: "/knowledge-base/generated/pillars/finance.html",
    colorKey: "finance",
  },
] satisfies Array<{
  title: string;
  description: string;
  themes: string[];
  href: string;
  colorKey: PillarColorKey;
}>;

const tools = [
  {
    title: "Explore Impacts",
    description: "Learn the average footprint of what we create.",
    href: "/footprints",
    label: "Review footprints",
    icon: FootprintsIcon,
  },
  {
    title: "Scan a Project",
    description: "Quickly Identify sustainable options for a current project.",
    href: "/impact-snapshot",
    label: "Scan a project",
    icon: ScanLine,
  },
  {
    title: "Evaluate Your Impacts",
    description: "Measure your work and report on progress.",
    href: "/calculator",
    label: "Try the Standard",
    icon: Calculator,
  },
  {
    title: "Grow Knowledge",
    description: "Explore sustainability concepts, terminology and other open resources.",
    href: "/knowledge-base",
    label: "Browse resources",
    icon: BookOpen,
  },
  {
    title: "Imagine More",
    description: "Create briefs that balance the four SD Standard pillars.",
    href: "/brief-generator",
    label: "Create a design brief",
    icon: PenLine,
  },
];

const workflowSteps = [
  "Create the brief",
  "Scan opportunities",
  "Evaluate your impact",
  "Document and improve impact",
];

const involvementGroups = [
  {
    title: "Contributors & Collaborators",
    for: ["designers", "developers", "writers", "translators", "UX designers", "students"],
    contributionTitle: "Ways to contribute",
    contributions: ["improve the user experience", "develop tools", "write case studies", "create datasets", "document projects", "test workflows"],
  },
  {
    title: "Advisors & Researchers",
    for: ["academics", "sustainability specialists", "accessibility experts", "social health advocates", "lawyers", "attorneys", "policy advisors", "Indigenous knowledge holders", "lifecycle assessment professionals"],
    contributionTitle: "Ways to contribute",
    contributions: ["review criteria", "advise on methodology", "contribute research", "help validate frameworks", "evolve knowledge base"],
  },
  {
    title: "Educational & Institutional Partners",
    for: ["schools", "nonprofits", "design associations", "government agencies", "incubators"],
    contributionTitle: "COLLABORATION OPPORTUNTIES",
    contributions: ["sustainable design curriculum", "workshops", "certification pilots", "research partnerships", "student challenges", "regional adaptations"],
  },
  {
    title: "Industry & Supply Chain Partners",
    for: ["printers", "paper suppliers", "digital hosting companies", "accessibility vendors", "packaging suppliers", "lifecycle assessment providers", "product vendors", "certification bodies"],
    contributionTitle: "Ways to collaborate",
    contributions: ["materials datasets", "environmental benchmarks", "verified supplier pathways", "low-impact production templates", "chain-of-custody systems"],
  },
];
// END HOMEPAGE COPY

function LinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const classes =
    variant === "primary"
      ? "bg-[#1f241f] text-white hover:bg-[#28775e] focus:ring-[#85bba8]"
      : variant === "secondary"
        ? "border border-[#cfc8b9] bg-[#fffdf8] text-[#1f241f] hover:border-[#28775e] hover:text-[#28775e] focus:ring-[#d9d4c8]"
        : "text-[#28775e] hover:text-[#1f241f] focus:ring-[#85bba8]";

  return (
    <a
      href={href}
      className={`inline-flex max-w-full items-center justify-center rounded-md px-5 py-3 text-center text-sm font-extrabold transition focus:outline-none focus:ring-4 ${classes}`}
    >
      {children}
    </a>
  );
}

export default function Index() {
  const [featuredProjects, setFeaturedProjects] = useState<ProjectSummary[]>([]);
  const [projectsStatus, setProjectsStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    fetchProjects()
      .then((projects) => {
        setFeaturedProjects(projects.slice(0, 3));
        setProjectsStatus("ready");
      })
      .catch(() => setProjectsStatus("error"));
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#1f241f]">
      {/* HOMEPAGE COPY: Hero headline, intro paragraph, and primary CTA. */}
      <section className="relative isolate mx-auto grid min-h-[92vh] w-full max-w-7xl items-center overflow-hidden px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <HeroPillarCircles />
        <div className="relative z-[1] max-w-4xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
            Sustainable Design Standard
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-[0.98] tracking-normal sm:text-6xl lg:text-7xl">
            An open sustainability standard for creatives
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#5f5a50] sm:text-xl">
            The Sustainable Design Standard is a framework to help creatives understand our impacts, create options, and build future-focused projects. 
            It’s based on four pillars: environment, society, culture, and finance.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <LinkButton href={heroAction.href}>{heroAction.label}</LinkButton>
          </div>
        </div>

      </section>

      {/* HOMEPAGE COPY: Section headers and body copy below are safe to edit here. */}
      <section className="border-y border-[#d9d4c8] bg-[#fffdf8]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <SectionHeader
            kicker="What is the SD Standard?"
            title="A living framework for interconnected design and creative decision-making."
            description="The standard turns broad sustainability goals into practical criteria that can be reviewed during briefing, production, evaluation, and documentation."
          />
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar) => (
              <article
                className="flex min-h-full flex-col justify-between rounded-lg border border-[#d9d4c8] bg-white p-6"
                key={pillar.title}
              >
                <div>
                  <span
                    className="mb-5 block h-2 w-16 rounded-full"
                    style={{ backgroundColor: PILLAR_COLORS[pillar.colorKey] }}
                  />
                  <h3 className="text-2xl font-extrabold">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#5f5a50]">
                    {pillar.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {pillar.themes.map((theme) => (
                      <li
                        className="rounded-full border border-[#d9d4c8] px-3 py-1 text-xs font-bold text-[#5f5a50]"
                        key={theme}
                      >
                        {theme}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={pillar.href}
                  className="mt-7 inline-flex items-center text-sm font-extrabold text-[#28775e] hover:text-[#1f241f]"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tools-resources" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 lg:px-10">
        <SectionHeader
          kicker="Tools & resources"
          title="Move from intention to evidence."
          description="Use the SD Standard as a connected set of tools for briefing, planning, evaluating, and learning."
        />
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <a
                href={tool.href}
                className="group flex min-h-72 flex-col justify-between rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(45,39,28,0.08)] transition hover:-translate-y-1 hover:border-[#28775e] focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
                key={tool.title}
              >
                <span>
                  <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-[#e5efe9] text-[#28775e]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="text-2xl font-extrabold">{tool.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#5f5a50]">
                    {tool.description}
                  </p>
                </span>
                <span className="mt-8 inline-flex items-center text-sm font-extrabold text-[#28775e]">
                  {tool.label}
                  <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="bg-[#1f241f] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <SectionHeader
            kicker="Design process"
            title="A Standard that fits the way we design."
            description="Use it early to shape project intent, during production to identify opportunities, and after launch to document and improve impact."
            inverted
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <div
                className="relative rounded-lg border border-white/15 bg-white/10 p-6"
                key={step}
              >
                <span className="text-sm font-extrabold text-[#a9d9c4]">
                  Step {index + 1}
                </span>
                <h3 className="mt-3 text-xl font-extrabold leading-tight">{step}</h3>
                {index < workflowSteps.length - 1 ? (
                  <ArrowRight
                    className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 rounded-full bg-[#28775e] p-2 text-white lg:block"
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            kicker="Project gallery"
            title="Examples from the SD Standard project library."
            description="Featured projects show how scores, pillars, and criteria can be documented as lightweight case studies."
          />
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
            <LinkButton href="/projects" variant="secondary">
              View all projects
            </LinkButton>
            <LinkButton href="/baselines" variant="secondary">
              View baselines
            </LinkButton>
          </div>
        </div>
        {projectsStatus === "loading" ? (
          <div className="mt-9 flex min-h-64 items-center justify-center rounded-lg border border-[#d9d4c8] bg-[#fffdf8] text-[#5f5a50]">
            <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#28775e]" />
            Loading latest projects...
          </div>
        ) : null}

        {projectsStatus === "error" ? (
          <div className="mt-9 rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 text-[#5f5a50]">
            Latest projects could not be loaded.
          </div>
        ) : null}

        {projectsStatus === "ready" ? (
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {featuredProjects.map((project) => (
              <a
                href={`/projects/${project.slug}`}
                className="group overflow-hidden rounded-lg border border-[#d9d4c8] bg-[#fffdf8] shadow-[0_18px_50px_rgba(45,39,28,0.08)] transition hover:-translate-y-1 hover:border-[#28775e] focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
                key={project.slug}
              >
                <img
                  src={project.coverImage}
                  alt=""
                  className="aspect-[3/2] w-full object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-start gap-3">
                    <span className="rounded-full bg-[#1f241f] px-3 py-1 text-xs font-extrabold text-white">
                      {project.rating}
                    </span>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-2 text-xs font-bold text-[#5f5a50]">
                    <span>{project.year}</span>
                    <span>{project.location}</span>
                    <span>{project.projectType}</span>
                  </div>
                  <h3 className="text-xl font-extrabold">{project.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#5f5a50]">
                    {project.description}
                  </p>
                  <span className="mt-6 inline-flex items-center text-sm font-extrabold text-[#28775e]">
                    View project
                    <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : null}
      </section>

      <section id="get-involved" className="scroll-mt-24 border-t border-[#d9d4c8] bg-[#fffdf8]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
                Get involved
              </p>
              <h2 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
                Build the Standards with creatives, researchers, and partners.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#5f5a50]">
                The SD Standard is a living and evolving framework built on collaboration.
              </p>
              <div className="mt-7">
                <LinkButton href="mailto:info@sdstandard.org" variant="secondary">
                  Get in touch
                </LinkButton>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {involvementGroups.map((group) => (
                <article className="rounded-lg border border-[#d9d4c8] bg-white p-6" key={group.title}>
                  <h3 className="text-xl font-extrabold">{group.title}</h3>
                  <div className="mt-5">
                    <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
                      For
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#5f5a50]">
                      {group.for.join(", ")}
                    </p>
                  </div>
                  <div className="mt-5">
                    <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
                      {group.contributionTitle}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#5f5a50]">
                      {group.contributions.join(", ")}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionHeader({
  kicker,
  title,
  description,
  inverted = false,
}: {
  kicker: string;
  title: string;
  description: string;
  inverted?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p className={`text-sm font-extrabold uppercase tracking-[0.08em] ${inverted ? "text-[#a9d9c4]" : "text-[#28775e]"}`}>
        {kicker}
      </p>
      <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">
        {title}
      </h2>
      <p className={`mt-5 text-lg leading-8 ${inverted ? "text-white/70" : "text-[#5f5a50]"}`}>
        {description}
      </p>
    </div>
  );
}
