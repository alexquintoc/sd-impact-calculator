import { UpdatesList } from "../components/UpdatesList";
import { getAllUpdates } from "../../lib/updates";

export const metadata = { title: "Updates | SD Standard", description: "News, events, releases, research, and announcements from the Sustainable Design Standard.", alternates: { canonical: "/updates" } };

export default function UpdatesPage() {
  return <main className="updates-shell"><p className="projects-kicker">SD Standard</p><h1 className="projects-heading">Updates</h1><p className="projects-intro">News, events, releases, research, and opportunities from the Sustainable Design Standard.</p><section aria-label="Published updates"><UpdatesList updates={getAllUpdates()} /></section></main>;
}
