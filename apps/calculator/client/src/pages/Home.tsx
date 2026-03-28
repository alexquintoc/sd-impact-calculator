import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle, Filter, Download, Upload, RotateCcw, AlertTriangle, Loader2 } from "lucide-react";
import { useCriteria } from "@/hooks/use-criteria";
import { useAnswers } from "@/hooks/use-answers";
import { computePillarScores, computeCertificationStatus, AnswerStatus, Pillar } from "@/lib/score";
import { ScoreHeader } from "@/components/ScoreHeader";
import { SegmentedControl } from "@/components/SegmentedControl";
import { cn } from "@/lib/utils";
import { CriterionInfoButton } from "@/components/CriterionInfoButton";
import { ProjectSetupBar } from "@/calculator/components/ProjectSetupBar";
import { calculatorVersions, type CalculatorVersionId } from "@/calculator/registry";


export default function Home() {
  const { data, isLoading, error } = useCriteria();
  const { answers, setAnswer, reset, exportData, importData } = useAnswers();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyUnmet, setShowOnlyUnmet] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!data) return { isCertified: false, pillarStatus: {}, pillarScores: {} };
    const scores = computePillarScores(data, answers);
    return computeCertificationStatus(scores, data.thresholds);
  }, [data, answers]);

  const [calculatorVersion, setCalculatorVersion] = useState<CalculatorVersionId>("v1");
  const [projectCategory, setProjectCategory] = useState("");
  const [projectType, setProjectType] = useState("");
  const selectedCalculatorVersion = useMemo(
  () => calculatorVersions[calculatorVersion],
  [calculatorVersion]
);

  // Set initial active tab for mobile when data loads
  useEffect(() => {
    if (data && !activeMobileTab) {
      setActiveMobileTab(data.pillars[0].id);
    }
  }, [data, activeMobileTab]);

  // Reset project filters when switching to a version without project types
  useEffect(() => {
    if (!selectedCalculatorVersion.features.projectTypes) {
      setProjectCategory("");
      setProjectType("");
    }
  }, [selectedCalculatorVersion]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
      // Reset input so same file can be uploaded again if needed
      e.target.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-muted-foreground space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading Criteria...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Failed to load criteria</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          Could not load the scoring criteria from /data/criteria.json. Ensure the file exists and is valid JSON.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Filter criteria based on search and "unmet" toggle
  const getFilteredCriteria = (pillar: Pillar) => {
    return pillar.criteria.filter((c) => {
      const matchesSearch = c.label.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesUnmet = true;
      if (showOnlyUnmet) {
        const status = answers[c.id];
        // "Unmet" means not 'Meets' (so undefined, 'Not yet', 'N/A')
        matchesUnmet = status !== 'Meets';
      }
      
      return matchesSearch && matchesUnmet;
    });
  };

  const statusOptions: AnswerStatus[] = ['Meets', 'Not yet', 'N/A'];

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
            
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">

      <ProjectSetupBar
        version={calculatorVersion}
        onVersionChange={setCalculatorVersion}
        projectCategory={projectCategory}
        onProjectCategoryChange={setProjectCategory}
        projectType={projectType}
        onProjectTypeChange={setProjectType}
      />
      <ScoreHeader data={data} results={results} />
        
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          
          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
            <div className="relative group w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search criteria..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            
            <button
              onClick={() => setShowOnlyUnmet(!showOnlyUnmet)}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all w-full sm:w-auto",
                showOnlyUnmet 
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10" 
                  : "bg-background text-foreground hover:bg-muted"
              )}
            >
              <Filter className="w-4 h-4" />
              Show only unmet
            </button>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto hide-scrollbar pb-1 lg:pb-0">
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <button 
              onClick={handleImportClick}
              className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors whitespace-nowrap"
            >
              <Upload className="w-4 h-4 text-muted-foreground" />
              Import
            </button>
            <button 
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-muted-foreground" />
              Export
            </button>
            <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
            <button 
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 text-destructive bg-destructive/5 hover:bg-destructive/10 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ml-auto lg:ml-0"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden flex space-x-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
          {data.pillars.map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => setActiveMobileTab(pillar.id)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                activeMobileTab === pillar.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-background border border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {pillar.label}
            </button>
          ))}
        </div>

        {/* Desktop Columns / Mobile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {data.pillars.map((pillar) => {
            const filteredCriteria = getFilteredCriteria(pillar);
            const isVisibleOnMobile = activeMobileTab === pillar.id;

            return (
              <div 
                key={pillar.id} 
                className={cn(
                  "flex flex-col gap-4",
                  !isVisibleOnMobile && "hidden lg:flex"
                )}
              >
                {/* Column Header (Desktop only, mobile relies on tabs) */}
                <h2 className="hidden lg:flex items-center justify-between pb-2 border-b border-border text-lg font-bold text-foreground">
                  {pillar.label}
                  <span className="text-xs font-semibold px-2 py-1 bg-muted text-muted-foreground rounded-full">
                    {pillar.criteria.length} items
                  </span>
                </h2>

                <AnimatePresence mode="popLayout">
                  {filteredCriteria.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="py-12 text-center bg-background rounded-2xl border border-dashed border-border"
                    >
                      <CheckCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground font-medium">No criteria found</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {filteredCriteria.map((criterion) => {
                        const status = answers[criterion.id];
                        const isMet = status === 'Meets';
                        
                        return (
                          <motion.div 
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={criterion.id} 
                            className={cn(
                              "p-4 rounded-2xl border shadow-sm transition-all duration-300",
                              isMet 
                                ? "bg-background border-border/80" 
                                : "bg-card border-border hover:border-primary/20 hover:shadow-md"
                            )}
                          >
                            <div className="flex justify-between items-start gap-3 mb-4">
                              <h3 className="text-sm font-semibold leading-snug text-foreground">
                                {criterion.label}
                              </h3>
                              <CriterionInfoButton
                                criterionId={criterion.id}
                                criterionLabel={criterion.label}
                              />
                              <span className="shrink-0 text-xs font-bold text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                                {criterion.points} pts
                              </span>
                            </div>
                            
                            <SegmentedControl
                              options={statusOptions}
                              value={status}
                              onChange={(newStatus) => setAnswer(criterion.id, newStatus)}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </main>
       <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-muted-foreground">
          Standard version: <span className="font-semibold text-foreground">{data.standardVersion ?? data.version}</span>
        </div>
      </footer>
    </div>
  );
}
