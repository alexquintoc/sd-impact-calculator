import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useWorkspace } from "@/workspace/WorkspaceProvider";
import { downloadJson } from "@/workspace/ui";

const Actions = createContext<{ open: () => void; start: (type?: string) => void; download: () => void; resume: () => void } | null>(null);
export function useProjectActions() { const value = useContext(Actions); if (!value) throw new Error("Missing project actions"); return value; }
export function ProjectActionsProvider({ children }: { children: ReactNode }) {
  const workspace = useWorkspace(); const [, navigate] = useLocation();
  const file = useRef<HTMLInputElement>(null); const returnFocus = useRef<HTMLElement | null>(null);
  const [mode, setMode] = useState<"new" | "resume" | null>(null);
  const [title, setTitle] = useState(""); const [type, setType] = useState(""); const [error, setError] = useState("");
  const [savedId, setSavedId] = useState("");
  const rememberFocus = () => { returnFocus.current = document.activeElement as HTMLElement; };
  const open = () => { setError(""); file.current?.click(); };
  const start = (chosenType = "") => { rememberFocus(); setTitle(""); setType(chosenType); setError(""); setMode("new"); };
  const download = () => { const result = workspace.exportCurrentProject(); if (result.result) downloadJson(result.result.json, result.result.filename); else setError(result.errors.map(item => item.message).join(" ") || "The project could not be downloaded."); };
  return <Actions.Provider value={{ open, start, download, resume: () => { rememberFocus(); setError(""); setSavedId(""); setMode("resume"); } }}>
    {children}
    <input ref={file} type="file" hidden accept=".json,application/json" aria-label="Open project JSON file" onChange={async event => {
      const selected = event.target.files?.[0]; if (!selected) return;
      try { workspace.previewImport(await selected.text()); } catch { workspace.previewImport(""); }
      event.target.value = ""; navigate("/workspace/project-file");
    }} />
    {error && !mode && <div className="public-notice" role="alert">{error}<button type="button" onClick={() => setError("")}>Dismiss</button></div>}
    <Dialog open={mode !== null} onOpenChange={isOpen => { if (!isOpen) setMode(null); }}>
      <DialogContent className="public-dialog" onCloseAutoFocus={event => { event.preventDefault(); if (returnFocus.current?.isConnected) returnFocus.current.focus(); }}>
        <DialogHeader><DialogTitle>{mode === "new" ? "Start a new project" : "Open a saved local project"}</DialogTitle><DialogDescription>{mode === "new" ? "Your project is saved in this browser. Download JSON whenever you need a portable copy." : "Choose a project saved in this browser. Only one project is open at a time."}</DialogDescription></DialogHeader>
        {mode === "new" ? <form className="public-form" onSubmit={event => {
          event.preventDefault(); if (!title.trim()) return;
          if (workspace.createNewProject({ title: title.trim(), projectTypes: type ? [type] : [] })) { setMode(null); navigate(type ? "/workspace?recommendations=review" : "/workspace"); }
          else setError("Could not save the project. Your current project has not been replaced. Check browser storage and try again.");
        }}>
          <label>Project title<input required value={title} onChange={event => setTitle(event.target.value)} /></label>
          {type && <p>Project type: <strong>{type}</strong>. You can add more types in the Workspace. Criteria recommendations can be reviewed separately.</p>}
          <button className="public-button" type="submit">Create project</button>
        </form> : <form className="public-form" onSubmit={event => {
          event.preventDefault(); if (!savedId) return;
          if (workspace.reopenProject(savedId)) { setMode(null); navigate("/workspace"); } else setError("Could not open this saved project. Your current project has not been replaced.");
        }}>{workspace.savedProjects().length ? <><label>Saved project<select required value={savedId} onChange={event => setSavedId(event.target.value)}><option value="" disabled>Choose a project</option>{workspace.savedProjects().map(item => <option value={item.id} key={item.id}>{item.title}</option>)}</select></label><button className="public-button" type="submit">Open saved project</button></> : <p>No saved local projects yet. Open a JSON file to continue work from another browser.</p>}</form>}
        {error && <p role="alert">{error}</p>}
      </DialogContent>
    </Dialog>
  </Actions.Provider>;
}
