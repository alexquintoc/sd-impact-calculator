import { ArrowRight } from "lucide-react";
import { PILLAR_COLORS, type PillarColorKey } from "@/lib/pillar-colors";

const pillars = [
  {
    title: "Environment",
    description:
      "Natural resources, emissions, waste, materials, energy, water, pollution, and ecological impacts.",
    colorKey: "environment",
  },
  {
    title: "Society",
    description:
      "Human rights, accessibility, labor, affordability, health, safety, education, and social equity.",
    colorKey: "society",
  },
  {
    title: "Culture",
    description:
      "Local culture, Indigenous culture, endangered languages, cultural diversity, audience engagement, and community participation.",
    colorKey: "culture",
  },
  {
    title: "Finance",
    description:
      "Fair compensation, profitability, economic benefits, accountability, transparency, and long-term value.",
    colorKey: "finance",
  },
] satisfies Array<{ title: string; description: string; colorKey: PillarColorKey }>;

const audiences = [
  {
    title: "Designers and studios",
    description:
      "Use the criteria to ask better questions, improve project decisions, communicate sustainability choices, and document impact.",
  },
  {
    title: "Contributors",
    description:
      "Help improve criteria, write guidance, suggest case studies, test tools, review wording, or contribute examples from real projects.",
  },
  {
    title: "Advisors",
    description:
      "Review criteria, validate assumptions, identify gaps, and help align the framework with existing sustainability, accessibility, cultural, labor, or financial standards.",
  },
  {
    title: "Educational partners",
    description:
      "Use the SD Standard as a teaching framework for design briefs, critiques, studio projects, research assignments, and student self-assessment.",
  },
  {
    title: "Suppliers and production partners",
    description:
      "Share policies, certifications, material data, production practices, and evidence that can help designers make informed decisions.",
  },
  {
    title: "Nonprofits, institutions, and clients",
    description:
      "Use the framework to write better design briefs, evaluate project proposals, and understand how communications projects can support sustainability goals.",
  },
];

const contributionWays = [
  "Designers and students: test the criteria on real projects; submit project examples or reflections.",
  "Educators: use the criteria in coursework.",
  "Researchers: help strengthen references and evidence.",
  "Advisors: review criteria and scoring logic.",
  "Suppliers: provide material, production, or certification data.",
  "Organizations: pilot the tools on communications projects.",
  "Developers: improve open-source tools and documentation.",
];

const currentTools = [
  "Creative Brief Generator",
  "Self-assessment Impact Calculator",
  "Impact Snapshot / Quick Project Scan tool",
  "Knowledge Base",
];

const roadmap = [
  {
    stage: "Stage 1",
    title: "Build the Framework",
    description: "Finalize the criteria, pillars, Knowledge Base, SDG mapping, and project guidance.",
  },
  {
    stage: "Stage 2",
    title: "Test the Tools",
    description: "Develop and refine the Brief Generator, Project Scan, Impact Calculator, Baselines, and Project Gallery.",
  },
  {
    stage: "Stage 3",
    title: "Pilot with Partners",
    description:
      "Work with designers, educators, suppliers, nonprofits, and organizations to test the standard on real projects.",
  },
  {
    stage: "Stage 4",
    title: "Create Recognition Pathways",
    description:
      "Introduce self-assessment, peer review, verified projects, supplier profiles, and public project records.",
  },
  {
    stage: "Stage 5",
    title: "Develop Certification and Custody Systems",
    description:
      "Build toward formal certification, supplier verification, and supply-chain custody documentation for design projects.",
  },
];

const team = [
  {
    name: "Alex Quinto",
    role: "Visual communication designer and web designer",
    bio: "Alex Quinto is a visual communication designer and web designer from Mexico focused on helping mission-driven organizations create clearer, more responsible communications. He has worked on design and digital projects for nonprofits, public-interest organizations, and international institutions, including the Inter-American Development Bank, Resilient Cities Catalyst, Bloomberg Philanthropies, and was previously a designer at Rockefeller Foundation's 100 Resilient Cities program. Alex served as an International Council of Design (ico-D) sustainability juror from 2012 to 2015. As a co-creator of the SD Standard, Alex develops practical tools, criteria, and resources to help designers reduce environmental impact, strengthen social value, and make sustainability easier to apply in everyday design work.",
  },
  {
    name: "Valerie Elliott",
    role: "F.DesCan, Strategic Communications Consultant, iD2 Communications Inc.",
    bio: "Valerie Elliott is a strategic creative working in Canada. She spearheaded and led the Sustainability Committee for the Professional Designers of Canada, previously the Graphic Designers of Canada, from 2007 to 2017, and joined the AIGA in developing their own sustainability initiative. She served as an International Council of Design (ico-D) sustainability juror from 2012 to 2015. From 2008 to 2009, Elliott sat on British Columbia, Canada's Climate Action Secretariat, Citizen's Conservation Council on Climate Action. Elliott has hosted exhibitions exploring social and environmental responsibility and spoken to design and business audiences across Canada on the importance of applying sustainability principles to design and communications work. She is a member of the International Association for Public Participation and is a film producer.",
  },
  {
    name: "Tuuli Sauren",
    role: "Founder/Creative Director, INSPIRIT Creatives UG / NGO",
    bio: "Tuuli Sauren is a multidisciplinary creative leader working across Europe with more than two decades of experience in communication design, sustainability, and human rights advocacy. She has worked extensively with NGOs and United Nations agencies since 2001. She brings a rare combination of strategic design expertise, systems thinking, and social justice commitment to the evaluation of sustainable design projects. Tuuli served as an International Council of Design (ico-D) sustainability juror from 2012 to 2015 and founded the Sustainable Designers Initiative (SDI), an initiative to expand equitable access to design education globally. Her work focuses on human-centred design, ethical impact, and the long-term societal consequences of organizational and design decisions, approaching sustainability not as compliance or perceived optics, but as a responsibility to human dignity, cultural integrity, and future generations.",
  },
];

const foundingContributors =
  "David Berman (original concept and founding chair), Marc Alt, Edi Berk, Simon Berry, Riitta Brusila, Donna Campbell, Banu [surname unclear in source], Valerie Elliott, Richard Henderson, Jiang Hua, Betty Lam Yan Yan, Ezio Manzini, Heidrun Mumper-Drumm, Stephen Palmer, Peter Perstel, Alex Quinto, Ajanta Sen, Tuuli Sauren, Sophie Thomas, Ursula Tischner, Bonne Zabolotney.";

export default function About() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#1f241f]">
      <section className="border-b border-[#d9d4c8] bg-[#fffdf8]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-10 lg:py-20">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
              About
            </p>
            <h1 className="mt-5 text-5xl font-extrabold leading-[0.98] tracking-normal sm:text-6xl lg:text-7xl">
              About the SD Standard
            </h1>
          </div>
          <div className="grid content-center gap-6">
            <p className="text-2xl font-extrabold leading-snug text-[#1f241f]">
              Our mission is to ensure communication designers and other creatives have the tools and resources to do their best work for the world.
            </p>
            <p className="text-lg leading-8 text-[#5f5a50]">
              The SD Standard is a practical framework for helping visual communication designers make more responsible decisions before, during, and after a project.
            </p>
            <p className="text-lg leading-8 text-[#5f5a50]">
              It is organized around four pillars: environment, society, culture, and finance, and applies to areas such as graphic design, editorial design, exhibit design, signage, packaging, web design, film, video, animation, interactive design, and motion graphics.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:px-10">
        <SectionHeader
          kicker="Why it matters"
          title="Visual communication design needs practical sustainability criteria."
        />
        <div className="grid gap-5 text-lg leading-8 text-[#5f5a50]">
          <p>
            Many sustainability tools focus on architecture, product design, or corporate ESG reporting, while visual communication design often lacks practical criteria for everyday project decisions, often leaving communication design as a last item in the decision-making process of organizations.
          </p>
          <p>
            Designers influence material choices, messaging, accessibility, production methods, cultural representation, budgets, and stakeholder participation, impacting what gets produced, for whom, with whom, and by what means.
          </p>
          <p>
            Sustainability in design should go beyond the material aspects of design. A strong design standard should also consider equity, labour, culture, affordability, transparency, and long-term value.
          </p>
          <p className="font-extrabold text-[#1f241f]">
            Our goal is to help designers ask better questions early enough to influence outcomes.
          </p>
        </div>
      </section>

      <section className="border-y border-[#d9d4c8] bg-[#fffdf8]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <SectionHeader
            kicker="How it works"
            title="The framework is structured around four connected pillars."
            description="Each criterion is connected to practical guidance, certifications, and resources. Many SD Standard criteria are mapped to relevant UN Sustainable Development Goals, helping designers connect project-level decisions to broader sustainability priorities."
          />
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar) => (
              <article className="rounded-lg border border-[#d9d4c8] bg-white p-6" key={pillar.title}>
                <span
                  className="mb-5 block h-2 w-16 rounded-full"
                  style={{ backgroundColor: PILLAR_COLORS[pillar.colorKey] }}
                />
                <h3 className="text-2xl font-extrabold">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5f5a50]">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <SectionHeader
          kicker="Who it is for"
          title="A shared standard for designers, educators, partners, and clients."
        />
        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {audiences.map((audience) => (
            <article className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6" key={audience.title}>
              <h3 className="text-xl font-extrabold">{audience.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5f5a50]">{audience.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#1f241f] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:px-10">
          <SectionHeader
            kicker="Contribute"
            title="Help test, review, research, document, and improve the Standard."
            inverted
          />
          <ul className="grid gap-3">
            {contributionWays.map((item) => (
              <li className="rounded-lg border border-white/15 bg-white/10 p-5 text-sm leading-6 text-white/78" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-[#d9d4c8] bg-[#fffdf8]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-10">
          <div>
            <SectionHeader
              kicker="Status"
              title="The project is currently in Stage 1 and Stage 2 of the roadmap."
              description="We are building the framework and beta-testing tools to interact with the Standard."
            />
            <p className="mt-7 text-sm leading-6 text-[#5f5a50]">
              We welcome feedback for future improvements. You can branch the SD Standard on{" "}
              <a className="font-extrabold text-[#28775e] hover:text-[#1f241f]" href="https://github.com/alexquintoc/sd-standard">
                GitHub
              </a>{" "}
              and create your own version.
            </p>
          </div>
          <div className="grid content-start gap-4 sm:grid-cols-2">
            {currentTools.map((tool) => (
              <div className="rounded-lg border border-[#d9d4c8] bg-white p-5 text-lg font-extrabold" key={tool}>
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <SectionHeader kicker="Roadmap" title="Five stages toward a transparent, useful standard." />
        <ol className="mt-10 grid gap-5">
          {roadmap.map((item, index) => (
            <li className="grid gap-4 rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 sm:grid-cols-[7rem_minmax(0,1fr)]" key={item.stage}>
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[#e5efe9] text-lg font-extrabold text-[#28775e]">
                  {index + 1}
                </span>
                <p className="mt-3 text-sm font-extrabold text-[#28775e]">{item.stage}</p>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5f5a50]">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-[#d9d4c8] bg-[#fffdf8]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <SectionHeader kicker="Team and story" title="The Sustainable Design Standard has roots in international design collaboration." />
          <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <article className="rounded-lg border border-[#d9d4c8] bg-white p-6">
              <h3 className="text-2xl font-extrabold">History of the Sustainable Design Standard</h3>
              <p className="mt-4 text-sm leading-6 text-[#5f5a50]">
                The Sustainable Design Standard's vision began in 2012 at ico-D, the International Council of Design's Sustainability Committee. Led by chair David Berman, the vision was to transform claims of sustainability into credible and measurable metrics.
              </p>
              <p className="mt-4 text-sm leading-6 text-[#5f5a50]">
                Worldwide founding members and contributors: {foundingContributors}
              </p>
              <p className="mt-4 text-sm leading-6 text-[#5f5a50]">
                In 2016, ico-D granted ownership of the work to three members who had taken on the majority of the work and specialized in sustainable communications: Alex Quinto, Valerie Elliott, and Tuuli Sauren.
              </p>
            </article>
            <div className="grid gap-5">
              {team.map((person) => (
                <article className="rounded-lg border border-[#d9d4c8] bg-white p-6" key={person.name}>
                  <h3 className="text-2xl font-extrabold">{person.name}</h3>
                  <p className="mt-1 text-sm font-extrabold text-[#28775e]">{person.role}</p>
                  <p className="mt-4 text-sm leading-6 text-[#5f5a50]">{person.bio}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-6 rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
              Get involved
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              Contribute, advise, test the tools, or help improve the SD Standard.
            </h2>
          </div>
          <a
            className="inline-flex max-w-full items-center justify-center rounded-md border border-[#cfc8b9] bg-white px-5 py-3 text-center text-sm font-extrabold text-[#1f241f] transition hover:border-[#28775e] hover:text-[#28775e] focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
            href="/#get-involved"
          >
            Get involved <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
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
  description?: string;
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
      {description ? (
        <p className={`mt-5 text-lg leading-8 ${inverted ? "text-white/70" : "text-[#5f5a50]"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
