import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import WardManagement from "@/pages/ward-management";
import Reports from "@/pages/reports";
import Procedures from "@/pages/procedures";
import Communication from "@/pages/communication";
import Library from "@/pages/library";
import Schedule from "@/pages/schedule";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navigation />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/ward-management" component={WardManagement} />
        <Route path="/reports" component={Reports} />
        <Route path="/procedures" component={Procedures} />
        <Route path="/communication" component={Communication} />
        <Route path="/library" component={Library} />
        <Route path="/schedule" component={Schedule} />
        <Route component={NotFound} />
      </Switch>
    </div>
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
