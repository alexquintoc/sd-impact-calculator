// Public source: content/updates/abierto-de-diseno-cdmx-2026.mdx.
// Do not derive published outcomes from the development Workspace fixture.
export interface ProjectPassportData {
  title: string; subtitle: string; location: string; dates: string;
  overview: string; contributors: Array<{ name: string; role: string }>;
}
export const abiertoPassport: ProjectPassportData = {
  title: "SD Standard × Abierto de Diseño", subtitle: "The framework as a communication tool and a material experiment.",
  location: "Mexico City", dates: "September 25 – October 4, 2026",
  overview: "The Sustainable Design Standard will participate in Abierto de Diseño CDMX 2026 with an installation that presents the framework as both a communication tool and a material experiment. In its tenth edition, Abierto explores how design shapes collective futures through the program Futuros.",
  contributors: [],
};
