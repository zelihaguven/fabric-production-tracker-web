
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import CompanyWrapper from "@/components/CompanyWrapper";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Production from "./pages/Production";
import Inventory from "./pages/Inventory";
import Labels from "./pages/Labels";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <CompanyWrapper>
                  <Index />
                </CompanyWrapper>
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute>
                <CompanyWrapper>
                  <Products />
                </CompanyWrapper>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <CompanyWrapper>
                  <Orders />
                </CompanyWrapper>
              </ProtectedRoute>
            } />
            <Route path="/production" element={
              <ProtectedRoute>
                <CompanyWrapper>
                  <Production />
                </CompanyWrapper>
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <CompanyWrapper>
                  <Inventory />
                </CompanyWrapper>
              </ProtectedRoute>
            } />
            <Route path="/labels" element={
              <ProtectedRoute>
                <CompanyWrapper>
                  <Labels />
                </CompanyWrapper>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <CompanyWrapper>
                  <Reports />
                </CompanyWrapper>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <CompanyWrapper>
                  <Analytics />
                </CompanyWrapper>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <CompanyWrapper>
                  <Settings />
                </CompanyWrapper>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
