import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { CriteriaData, CertificationResult } from "@/lib/score";
import { cn } from "@/lib/utils";

interface ScoreHeaderProps {
  data: CriteriaData;
  results: CertificationResult;
}

export function ScoreHeader({ data, results }: ScoreHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Overall Status Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">SD Impact Calculator</h1>
            <p className="text-sm text-muted-foreground mt-1">Evaluate your project against the Sustainable Design standard.</p>
          </div>
          
          <div className={cn(
            "flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-sm transition-all duration-300",
            results.isCertified 
              ? "bg-success/10 border-success/20 text-success-foreground" 
              : "bg-muted border-border text-muted-foreground"
          )}>
            {results.isCertified ? (
              <CheckCircle2 className="w-6 h-6 text-success" />
            ) : (
              <XCircle className="w-6 h-6 opacity-60" />
            )}
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Overall Status</span>
              <span className="text-lg font-bold leading-none">
                {results.isCertified ? "SD Standard Certified" : "Not Yet Certified"}
              </span>
            </div>
          </div>
        </div>

        {/* Pillars Summary Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {data.pillars.map((pillar) => {
            const score = results.pillarScores[pillar.id] || 0;
            const threshold = data.thresholds[pillar.id] || 50;
            const isPassing = results.pillarStatus[pillar.id];
            const reachedGreenMilestone = score >= 50;
            const progressPercent = Math.min((score / threshold) * 100, 100);

            return (
              <div 
                key={pillar.id} 
                className={cn(
                  "p-3 sm:p-4 rounded-xl border flex flex-col gap-3 transition-colors duration-300",
                  reachedGreenMilestone
                    ? "bg-success/10 border-success/30 shadow-[0_2px_10px_-3px_rgba(34,197,94,0.1)]"
                    : "bg-background border-border shadow-sm"
                )}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm sm:text-base">{pillar.label}</span>
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full",
                    isPassing ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                  )}>
                    {isPassing ? "PASS" : "FAIL"}
                  </span>
                </div>
                
                <div className="flex items-end gap-1.5">
                  <span className={cn(
                    "text-2xl font-bold leading-none",
                    isPassing ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {score}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground leading-snug">
                    / {threshold}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      isPassing ? "bg-success" : "bg-foreground/20"
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
