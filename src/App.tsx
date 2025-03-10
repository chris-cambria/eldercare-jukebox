
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Reminders from "./pages/Reminders";
import Community from "./pages/Community";
import VoiceBlog from "./pages/VoiceBlog";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import CommunityChat from "./pages/CommunityChat";
import Helpline from "./pages/Helpline";
import EmergencyButton from "./components/EmergencyButton";
import { VoiceNavigationProvider } from "./providers/VoiceNavigationProvider";

const queryClient = new QueryClient();

// Simple auth check function
const isAuthenticated = () => {
  return localStorage.getItem("authenticated") === "true";
};

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/signup" replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <VoiceNavigationProvider>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>
                    <Index />
                    <EmergencyButton />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reminders"
              element={
                <ProtectedRoute>
                  <>
                    <Reminders />
                    <EmergencyButton />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <>
                    <Community />
                    <EmergencyButton />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/community/:id"
              element={
                <ProtectedRoute>
                  <>
                    <CommunityChat />
                    <EmergencyButton />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/voice-blog"
              element={
                <ProtectedRoute>
                  <>
                    <VoiceBlog />
                    <EmergencyButton />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/helpline"
              element={
                <ProtectedRoute>
                  <>
                    <Helpline />
                    <EmergencyButton />
                  </>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </VoiceNavigationProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
