import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { calculatorVersions } from "@/calculator/registry";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuickProjectScanForm } from "@/quick-project-scan/components/QuickProjectScanForm";
import { QuickProjectScanResults } from "@/quick-project-scan/components/QuickProjectScanResults";
import {
  getImpactSnapshotCriteriaVersion,
  getImpactSnapshotCriterionIds,
  MAX_IMPACT_SNAPSHOT_IMPORT_BYTES,
  parseImpactSnapshotImport,
  restoreImpactSnapshotState,
  type ImpactSnapshotImportFailureReason,
  type ValidatedImpactSnapshotImport,
} from "@/quick-project-scan/lib/impactSnapshotImport";
import { analyzeProjectDescription } from "@/quick-project-scan/lib/scanProjectDescription";
import type { ImpactSnapshot } from "@/quick-project-scan/types";

const STORAGE_KEY = "sd-standard-impact-snapshot:last";

type ImportMessage = {
  tone: "success" | "error" | "warning";
  text: string;
  details?: string[];
};

function messageForImportError(reason: ImpactSnapshotImportFailureReason) {
  switch (reason) {
    case "invalid-json":
      return "This file could not be read as JSON. Select a valid Impact Snapshot JSON export.";
    case "unsupported-schema-version":
      return "This Impact Snapshot JSON file uses an unsupported schema version.";
    case "missing-required-fields":
      return "This JSON file is missing required Impact Snapshot fields.";
    case "incorrect-field-types":
    case "invalid-structure":
    default:
      return "This JSON file does not match the SD Standard Impact Snapshot format.";
  }
}

export default function QuickProjectScan() {
  const criteriaData = calculatorVersions.v2.criteria;
  const criteriaVersion = getImpactSnapshotCriteriaVersion(criteriaData);
  const validCriterionIds = useMemo(() => getImpactSnapshotCriterionIds(criteriaData), [criteriaData]);
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<ImpactSnapshot | null>(null);
  const [importMessage, setImportMessage] = useState<ImportMessage | null>(null);
  const [pendingImport, setPendingImport] = useState<ValidatedImpactSnapshotImport | null>(null);
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const importButtonRef = useRef<HTMLButtonElement | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const confirmingReplaceRef = useRef(false);

  const criteriaCount = useMemo(
    () => criteriaData.pillars.reduce((total, pillar) => total + pillar.criteria.length, 0),
    [criteriaData]
  );

  const handleSubmit = () => {
    const snapshot = analyzeProjectDescription(description.trim(), criteriaData);
    setResult(snapshot);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  };

  const handleStartAgain = () => {
    setDescription("");
    setResult(null);
    setImportMessage(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const hasExistingProject = description.trim().length > 0 || result !== null;

  const moveFocusToStatus = () => {
    window.setTimeout(() => statusRef.current?.focus(), 0);
  };

  const moveFocusToResults = () => {
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      resultsRef.current?.focus();
    }, 0);
  };

  const restoreImportedProject = (validatedImport: ValidatedImpactSnapshotImport) => {
    const restored = restoreImpactSnapshotState(validatedImport, criteriaData);
    setDescription(restored.project.description);
    setResult(restored);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(restored));

    const warningDetails = validatedImport.warnings.flatMap((warning) => {
      if (warning.type === "criteria-version-mismatch") {
        return [
          `Imported criteria version: ${warning.importedCriteriaVersion ?? "not specified"}. Current criteria version: ${warning.currentCriteriaVersion}.`,
        ];
      }
      return [`Criteria no longer recognized: ${warning.criterionIds.join(", ")}.`];
    });

    setImportMessage({
      tone: warningDetails.length > 0 ? "warning" : "success",
      text:
        warningDetails.length > 0
          ? "This project was created using a different version of the SD Standard. Some criteria may have changed."
          : "Project imported successfully.",
      details: warningDetails,
    });
    moveFocusToResults();
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMPACT_SNAPSHOT_IMPORT_BYTES) {
      setImportMessage({
        tone: "error",
        text: "This file is too large. Select an Impact Snapshot JSON export smaller than 2 MB.",
      });
      resetFileInput();
      moveFocusToStatus();
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseImpactSnapshotImport(text, {
        currentCriteriaVersion: criteriaVersion,
        validCriterionIds,
      });

      if (!parsed.ok) {
        setImportMessage({
          tone: "error",
          text: messageForImportError(parsed.reason),
          details: import.meta.env.DEV ? parsed.details.slice(0, 4) : undefined,
        });
        resetFileInput();
        moveFocusToStatus();
        return;
      }

      if (hasExistingProject) {
        setPendingImport(parsed.value);
        setReplaceDialogOpen(true);
      } else {
        restoreImportedProject(parsed.value);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Impact Snapshot import failed", error);
      }
      setImportMessage({
        tone: "error",
        text: "The selected file could not be read. Select a valid Impact Snapshot JSON export.",
      });
      moveFocusToStatus();
    } finally {
      resetFileInput();
    }
  };

  const handleConfirmReplace = () => {
    confirmingReplaceRef.current = true;
    if (pendingImport) {
      restoreImportedProject(pendingImport);
    }
    setPendingImport(null);
    setReplaceDialogOpen(false);
  };

  const handleCancelReplace = () => {
    setPendingImport(null);
    setReplaceDialogOpen(false);
    window.setTimeout(() => importButtonRef.current?.focus(), 0);
  };

  const importControl = (
    <>
      <input
        ref={fileInputRef}
        id="impact-snapshot-json-import"
        type="file"
        accept=".json,application/json"
        className="sr-only"
        aria-label="Import project JSON"
        onChange={handleImportFile}
      />
      <button
        ref={importButtonRef}
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-[#28775e] bg-[#fffdf8] px-4 py-3 text-sm font-extrabold text-[#28775e] transition hover:bg-[#e5efe9] focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
      >
        <Upload className="h-4 w-4" aria-hidden="true" />
        Import project JSON
      </button>
    </>
  );

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-[#1f241f] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <a
              href="/"
              className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e] hover:text-[#1f241f]"
            >
              SD Standard
            </a>
            <h1 className="mt-3 text-5xl font-extrabold leading-none tracking-normal sm:text-6xl">
              SD Standard Impact Snapshot
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5f5a50]">
              Describe a design project in your own words. The tool will map the project against
              the SD Standard criteria and generate a simple four-pillar snapshot across
              Environment, Society, Culture, and Finance.
            </p>
          </div>
          <p className="max-w-xs rounded-md border border-[#d9d4c8] bg-[#fffdf8] px-4 py-3 text-sm font-bold leading-6 text-[#5f5a50]">
            Using SD Standard v2 draft data with {criteriaCount} criteria available.
          </p>
        </header>

        <div className="mb-5 grid gap-3">
          <p className="text-sm font-medium leading-6 text-[#5f5a50]">
            Import a JSON file previously exported from the Impact Snapshot tool.
          </p>
          <div ref={statusRef} tabIndex={-1} aria-live="polite" aria-atomic="true">
            {importMessage ? (
              <Alert
                variant={importMessage.tone === "error" ? "destructive" : "default"}
                className={
                  importMessage.tone === "success"
                    ? "border-[#28775e] bg-[#e5efe9] text-[#1f241f]"
                    : importMessage.tone === "warning"
                      ? "border-[#c58720] bg-[#fff7e6] text-[#1f241f]"
                      : undefined
                }
              >
                <AlertDescription>
                  <p className="font-bold">{importMessage.text}</p>
                  {importMessage.details && importMessage.details.length > 0 ? (
                    <ul className="mt-2 list-disc pl-5">
                      {importMessage.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  ) : null}
                </AlertDescription>
              </Alert>
            ) : null}
          </div>
        </div>

        {result ? (
          <div ref={resultsRef} tabIndex={-1}>
            <QuickProjectScanResults
              result={result}
              criteriaVersion={criteriaVersion}
              importControl={importControl}
              onStartAgain={handleStartAgain}
            />
          </div>
        ) : (
          <QuickProjectScanForm
            value={description}
            onChange={setDescription}
            onSubmit={handleSubmit}
            importControl={importControl}
          />
        )}
      </div>
      <AlertDialog
        open={replaceDialogOpen}
        onOpenChange={(open) => {
          if (open) {
            setReplaceDialogOpen(true);
            return;
          }

          if (confirmingReplaceRef.current) {
            confirmingReplaceRef.current = false;
            setReplaceDialogOpen(false);
            return;
          }

          handleCancelReplace();
        }}
      >
        <AlertDialogContent className="border-[#d9d4c8] bg-[#fffdf8] text-[#1f241f]">
          <AlertDialogHeader>
            <AlertDialogTitle>Replace the current project?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#5f5a50]">
              Importing this JSON file will replace the project currently shown on this page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border border-[#1f241f] text-[#1f241f]"
              onClick={handleCancelReplace}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#1f241f] text-white hover:bg-[#28775e]"
              onClick={handleConfirmReplace}
            >
              Import and replace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
