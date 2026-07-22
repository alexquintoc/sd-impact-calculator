import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import About from "@/pages/About";
import BaselineDetail from "@/pages/BaselineDetail";
import Baselines from "@/pages/Baselines";
import BriefGenerator from "@/pages/BriefGenerator";
import Footprints from "@/pages/Footprints";
import Home from "@/pages/Home";
import Index from "@/pages/Index";
import ProjectDetail from "@/pages/ProjectDetail";
import Projects from "@/pages/Projects";
import QuickProjectScan from "@/pages/QuickProjectScan";
import QuickProjectScanEmbed from "@/pages/QuickProjectScanEmbed";
import TheStandardAndTheSdgs from "@/pages/TheStandardAndTheSdgs";
import SiteChrome from "@/components/SiteChrome";
import Updates from "@/pages/Updates";
import UpdateDetail from "@/pages/UpdateDetail";

function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(to, { replace: true });
  }, [setLocation, to]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Index} />
      <Route path="/about" component={About} />
      <Route path="/about/" component={About} />
      <Route path="/brief-generator" component={BriefGenerator} />
      <Route path="/brief-generator/" component={BriefGenerator} />
      <Route path="/calculator" component={Home} />
      <Route path="/calculator/" component={Home} />
      <Route path="/footprints" component={Footprints} />
      <Route path="/footprints/" component={Footprints} />
      <Route path="/impact-snapshot" component={QuickProjectScan} />
      <Route path="/impact-snapshot/" component={QuickProjectScan} />
      <Route path="/impact-snapshot/embed" component={QuickProjectScanEmbed} />
      <Route path="/impact-snapshot/embed/" component={QuickProjectScanEmbed} />
      <Route path="/project-scan">
        {() => <Redirect to="/impact-snapshot" />}
      </Route>
      <Route path="/project-scan/">
        {() => <Redirect to="/impact-snapshot" />}
      </Route>
      <Route path="/quick-project-scan/embed">
        {() => <Redirect to="/impact-snapshot/embed" />}
      </Route>
      <Route path="/quick-project-scan/embed/">
        {() => <Redirect to="/impact-snapshot/embed" />}
      </Route>
      <Route path="/quick-project-scan">
        {() => <Redirect to="/impact-snapshot" />}
      </Route>
      <Route path="/quick-project-scan/">
        {() => <Redirect to="/impact-snapshot" />}
      </Route>
      <Route path="/projects" component={Projects} />
      <Route path="/projects/" component={Projects} />
      <Route path="/projects/:slug">
        {(params) => <ProjectDetail params={params} />}
      </Route>
      <Route path="/updates" component={Updates} />
      <Route path="/updates/" component={Updates} />
      <Route path="/updates/:slug">{(params) => <UpdateDetail params={params} />}</Route>
      <Route path="/the-standard-and-the-sdgs" component={TheStandardAndTheSdgs} />
      <Route path="/the-standard-and-the-sdgs/" component={TheStandardAndTheSdgs} />
      <Route path="/relationship-map">
        {() => <Redirect to="/the-standard-and-the-sdgs" />}
      </Route>
      <Route path="/relationship-map/">
        {() => <Redirect to="/the-standard-and-the-sdgs" />}
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

function HashScroll() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const scrollToTarget = () => {
      const target = document.querySelector(hash);
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      target?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    };

    const timeout = window.setTimeout(scrollToTarget, 80);
    return () => window.clearTimeout(timeout);
  }, [location]);

  return null;
}

function App() {
  const [location] = useLocation();
  const chrome = location.startsWith("/impact-snapshot/embed") ||
    location.startsWith("/quick-project-scan/embed") ? (
    <Router />
  ) : (
    <SiteChrome>
      <Router />
    </SiteChrome>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <HashScroll />
        {chrome}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
