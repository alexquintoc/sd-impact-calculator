import { Link } from "wouter";
import type { useProjectActions } from "./ProjectActions";

type ProjectActions = ReturnType<typeof useProjectActions>;

export function HomeProjectActions({
  actions,
  projectTitle,
}: {
  actions: ProjectActions;
  projectTitle?: string;
}) {
  return (
    <aside className="home-project-actions" aria-label="Project actions">
      <div className="home-project-action-group">
        <h2>Start a new project</h2>
        <p>Bring your work into one Project Workspace. Choose a project type or begin with a blank project.</p>
        <div className="public-actions">
          <Link className="public-link" href="/explore/project-types">Choose a project type →</Link>
          <button className="public-link" type="button" onClick={() => actions.start()}>Start a blank project →</button>
        </div>
      </div>

      <div className="home-project-action-group home-project-continue">
        <h2>Continue a project</h2>
        {projectTitle && <p>Your open project: <strong>{projectTitle}</strong></p>}
        <div className="public-actions">
          {projectTitle && <Link className="public-link" href="/workspace">Continue in Workspace →</Link>}
          <button className="public-link" type="button" onClick={actions.open}>Open project JSON →</button>
          <button className="public-link" type="button" onClick={actions.resume}>Open a saved local project →</button>
        </div>
      </div>
    </aside>
  );
}
