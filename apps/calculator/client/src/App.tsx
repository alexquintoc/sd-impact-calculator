import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import BaselineDetail from "@/pages/BaselineDetail";
import Baselines from "@/pages/Baselines";
import BriefGenerator from "@/pages/BriefGenerator";
import Footprints from "@/pages/Footprints";
import Home from "@/pages/Home";
import Index from "@/pages/Index";
import ProjectDetail from "@/pages/ProjectDetail";
import Projects from "@/pages/Projects";
import QuickProjectScan from "@/pages/QuickProjectScan";
import SiteChrome from "@/components/SiteChrome";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Index} />
      <Route path="/brief-generator" component={BriefGenerator} />
      <Route path="/brief-generator/" component={BriefGenerator} />
      <Route path="/calculator" component={Home} />
      <Route path="/calculator/" component={Home} />
      <Route path="/footprints" component={Footprints} />
      <Route path="/footprints/" component={Footprints} />
      <Route path="/project-scan" component={QuickProjectScan} />
      <Route path="/project-scan/" component={QuickProjectScan} />
      <Route path="/quick-project-scan" component={QuickProjectScan} />
      <Route path="/quick-project-scan/" component={QuickProjectScan} />
      <Route path="/projects" component={Projects} />
      <Route path="/projects/" component={Projects} />
      <Route path="/projects/:slug">
        {(params) => <ProjectDetail params={params} />}
      </Route>
      <Route path="/baselines" component={Baselines} />
      <Route path="/baselines/" component={Baselines} />
      <Route path="/baselines/:slug">
        {(params) => <BaselineDetail params={params} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SiteChrome>
          <Router />
        </SiteChrome>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
