import { Github, Instagram, Linkedin } from "lucide-react";
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
  {
    label: "Bluesky",
    href: "https://bsky.app/profile/sdstandard.bsky.social",
    Icon: null,
  },
];


const footerNavItems = [{label:"Explore",href:"/explore"},{label:"Projects",href:"/projects"},{label:"About",href:"/about"},{label:"Updates",href:"/about/updates"},{label:"Knowledge Base",href:"/knowledge-base"},{label:"Footprints",href:"/footprints"},{label:"Baselines",href:"/baselines"}];
export function SiteFooter({t}:{t:(text:string)=>string}) { return (      <footer className="border-t border-[#d9d4c8] bg-[#1f241f] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(10rem,auto)_minmax(9rem,auto)] lg:px-10">
          <div className="max-w-xl">
            <h2 className="text-xl font-extrabold">SD Standard</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {t("An open sustainability standard for visual communication and design practitioners")}
            </p>
            <form
              action="https://buttondown.com/api/emails/embed-subscribe/sdstandard"
              method="post"
              className="embeddable-buttondown-form mt-6 grid max-w-md gap-3"
            >
              <p className="m-0 text-sm leading-6 text-white/80">
                {t("Get occasional updates about the SD Standard.")}
              </p>
              <label className="text-sm font-extrabold text-white/90" htmlFor="bd-email">
                {t("Enter your email")}
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
                  value={t("Subscribe")}
                />
              </div>
              <p className="m-0 text-xs leading-5">
                <a
                  className="font-bold text-white/60 hover:text-white"
                  href="https://buttondown.com/refer/sdstandard"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("Powered by Buttondown.")}
                </a>
              </p>
            </form>
          </div>
          <nav className="grid content-start gap-3" aria-label={t("Footer navigation")}>
            {footerNavItems.map((item) => (
              <a className="text-sm font-extrabold text-white/80 hover:text-white" href={item.href} key={item.href}>
                {t(item.label)}
              </a>
            ))}
          </nav>
          <div className="grid content-start gap-4">
            <a
              className="text-sm font-extrabold text-white/80 hover:text-white"
              href="/about/get-involved"
              
            >
              {t("Get Involved")}
            </a>
            <div className="flex gap-2" aria-label={t("Social media")}>
              {socialItems.map(({ label, href, Icon }) => (
                <a
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white/80 hover:border-white/70 hover:text-white"
                  href={href}
                  key={href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {Icon ? (
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <svg
                      className="h-4 w-4"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M12 10.8C10.5 7.9 7.3 4.2 4.6 3.1c-1.2-.5-2 .1-2 1.4 0 2.9 1.5 5.3 4.3 6.1-2.9.5-4 2.4-2.2 4.7 2.2 2.8 5.3 1.4 7.3-2.9 2 4.3 5.1 5.7 7.3 2.9 1.8-2.3.7-4.2-2.2-4.7 2.8-.8 4.3-3.2 4.3-6.1 0-1.3-.8-1.9-2-1.4-2.7 1.1-5.9 4.8-7.4 7.7Z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>); }
