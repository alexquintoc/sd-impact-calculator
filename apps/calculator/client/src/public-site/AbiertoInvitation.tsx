import { Link } from "wouter";
import { PageMeta } from "./PageIntro";
const invitations = {
  economia: { title: "El diseño también crea valor local.", text: "Te invitamos a colaborar en un piloto para explorar cómo el diseño puede crear valor económico local y compartido, a partir del proyecto del SD Standard en Abierto de Diseño.", action: "Me interesa colaborar", href: "mailto:info@sdstandard.org?subject=Abierto%3A%20valor%20econ%C3%B3mico%20local" },
  "segunda-vida": { title: "Imaginemos una segunda vida.", text: "¿Qué puede pasar con la instalación después de Abierto de Diseño? Te invitamos a colaborar en el diseño de su próxima etapa de vida.", action: "Quiero participar", href: "mailto:info@sdstandard.org?subject=Abierto%3A%20segunda%20vida" },
  colabora: { title: "El estándar se construye en colaboración.", text: "Comparte tu experiencia, prueba las herramientas o ayuda a mejorar el SD Standard. Buscamos personas que quieran participar en su evolución.", action: "Conoce cómo participar (en inglés)", href: "/about/get-involved" },
} as const;
export default function AbiertoInvitation({ kind }: { kind: keyof typeof invitations }) {
  const item = invitations[kind];
  return <main lang="es" className="public-page public-invitation"><PageMeta title={item.title} description={item.text} lang="es" /><p className="public-eyebrow">SD Standard × Abierto de Diseño</p><h1>{item.title}</h1><p>{item.text}</p>{item.href.startsWith("/") ? <Link className="public-button" href={item.href}>{item.action} →</Link> : <a className="public-button" href={item.href}>{item.action} →</a>}<Link className="public-link" href="/projects/abierto">Conoce el proyecto (en inglés) →</Link></main>;
}
