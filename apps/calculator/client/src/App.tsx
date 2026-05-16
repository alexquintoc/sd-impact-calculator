import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import BriefGenerator from "@/pages/BriefGenerator";
import Home from "@/pages/Home";
import Index from "@/pages/Index";
import QuickProjectScan from "@/pages/QuickProjectScan";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Index} />
      <Route path="/brief-generator" component={BriefGenerator} />
      <Route path="/brief-generator/" component={BriefGenerator} />
      <Route path="/calculator" component={Home} />
      <Route path="/calculator/" component={Home} />
      <Route path="/quick-project-scan" component={QuickProjectScan} />
      <Route path="/quick-project-scan/" component={QuickProjectScan} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
