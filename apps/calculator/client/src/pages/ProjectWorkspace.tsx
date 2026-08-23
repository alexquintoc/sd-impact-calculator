import { WorkspaceProvider } from "@/workspace/WorkspaceProvider";
import { WorkspaceShell } from "@/workspace/WorkspaceShell";

export default function ProjectWorkspace() {
  return <WorkspaceProvider><WorkspaceShell /></WorkspaceProvider>;
}
