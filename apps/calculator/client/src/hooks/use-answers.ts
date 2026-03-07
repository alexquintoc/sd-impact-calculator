import { useState, useEffect, useCallback } from 'react';
import { Answers, AnswerStatus } from '@/lib/score';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'sd-impact-calculator-answers';

export function useAnswers() {
  const { toast } = useToast();
  
  const [answers, setAnswers] = useState<Answers>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Failed to parse stored answers", e);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const setAnswer = useCallback((id: string, status: AnswerStatus) => {
    setAnswers(prev => ({ ...prev, [id]: status }));
  }, []);

  const reset = useCallback(() => {
    if (window.confirm("Are you sure you want to reset all criteria? This action cannot be undone.")) {
      setAnswers({});
      toast({
        title: "Reset Successful",
        description: "All criteria have been cleared.",
      });
    }
  }, [toast]);

  const exportData = useCallback(() => {
    try {
      const dataStr = JSON.stringify({ 
        meta: { 
          app: "SD Impact Calculator", 
          version: "1.0",
          exportedAt: new Date().toISOString() 
        }, 
        answers 
      }, null, 2);
      
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `sd-impact-project-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Your project data has been downloaded.",
      });
    } catch (e) {
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting your data.",
        variant: "destructive"
      });
    }
  }, [answers, toast]);

  const importData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.answers) {
          setAnswers(parsed.answers);
        } else {
          // Fallback if they upload a raw answers object by mistake
          setAnswers(parsed);
        }
        toast({
          title: "Import Successful",
          description: "Your project data has been restored.",
        });
      } catch (err) {
        console.error('Failed to parse JSON', err);
        toast({
          title: "Import Failed",
          description: "The file you uploaded is not a valid JSON export.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  }, [toast]);

  return { answers, setAnswer, reset, exportData, importData };
}
