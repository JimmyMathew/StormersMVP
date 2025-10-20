import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import LoginPage from "@/pages/LoginPage";
import DashboardRouter from "@/pages/DashboardRouter";
import MerchShop from "@/pages/MerchShop";
import TournamentsPage from "@/pages/TournamentsPage";
import TournamentDetailPage from "@/pages/TournamentDetailPage";
import CourtsPage from "@/pages/CourtsPage";
import MediaHubPage from "@/pages/MediaHubPage";
import DevelopmentCenterPage from "@/pages/DevelopmentCenterPage";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return (
    <>
      <Header />
      <Component />
    </>
  );
}

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <LoginPage />}
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={DashboardRouter} />
      </Route>
      <Route path="/shop">
        <ProtectedRoute component={MerchShop} />
      </Route>
      <Route path="/tournaments">
        <ProtectedRoute component={TournamentsPage} />
      </Route>
      <Route path="/tournaments/:id">
        <ProtectedRoute component={TournamentDetailPage} />
      </Route>
      <Route path="/courts">
        <ProtectedRoute component={CourtsPage} />
      </Route>
      <Route path="/media">
        <ProtectedRoute component={MediaHubPage} />
      </Route>
      <Route path="/development">
        <ProtectedRoute component={DevelopmentCenterPage} />
      </Route>
      <Route path="/">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster />
              <Router />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
