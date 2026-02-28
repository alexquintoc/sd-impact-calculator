import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnswerStatus } from '@/lib/score';

interface SegmentedControlProps {
  options: AnswerStatus[];
  value: AnswerStatus;
  onChange: (value: AnswerStatus) => void;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
  return (
    <div className={cn("flex p-1 bg-muted rounded-xl relative", className)}>
      {options.map((option) => {
        // Option is guaranteed to be defined in our usage array
        const optStr = option || "Unanswered";
        const isActive = value === option;
        
        return (
          <button
            key={optStr}
            onClick={() => onChange(option)}
            className={cn(
              "relative flex-1 text-xs md:text-sm py-2 px-3 font-medium transition-colors z-10 rounded-lg",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="segmented-active-bg"
                className="absolute inset-0 bg-background shadow-sm rounded-lg -z-10"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-20 block text-center truncate">{optStr}</span>
          </button>
        );
      })}
    </div>
  );
}
