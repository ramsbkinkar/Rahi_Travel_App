
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import TravelPackages from "./pages/TravelPackages";
import ExploreIndia from "./pages/ExploreIndia";
import CityDetails from "./pages/CityDetails";
import Scrapbook from "./pages/Scrapbook";
import SocialFeed from "./pages/SocialFeed";
import TripTracker from "./pages/TripTracker";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/travel-packages" element={<TravelPackages />} />
            <Route path="/explore-india" element={<ExploreIndia />} />
            <Route path="/explore-india/:citySlug" element={<CityDetails />} />
            <Route 
              path="/scrapbook" 
              element={
                <ProtectedRoute>
                  <Scrapbook />
                </ProtectedRoute>
              } 
            />
            <Route path="/social-feed" element={<SocialFeed />} />
            <Route 
              path="/trip-tracker" 
              element={
                <ProtectedRoute>
                  <TripTracker />
                </ProtectedRoute>
              } 
            />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
