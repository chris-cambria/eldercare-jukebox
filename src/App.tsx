
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
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const authStatus = localStorage.getItem("authenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <VoiceNavigationProvider>
            <Routes>
              <Route 
                path="/signup" 
                element={
                  isAuthenticated ? <Navigate to="/" /> : <SignUp setIsAuthenticated={setIsAuthenticated} />
                } 
              />
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <>
                      <Index onLogout={handleLogout} />
                      <EmergencyButton />
                    </>
                  ) : (
                    <Navigate to="/signup" />
                  )
                }
              />
              <Route
                path="/reminders"
                element={
                  isAuthenticated ? (
                    <>
                      <Reminders onLogout={handleLogout} />
                      <EmergencyButton />
                    </>
                  ) : (
                    <Navigate to="/signup" />
                  )
                }
              />
              <Route
                path="/community"
                element={
                  isAuthenticated ? (
                    <>
                      <Community onLogout={handleLogout} />
                      <EmergencyButton />
                    </>
                  ) : (
                    <Navigate to="/signup" />
                  )
                }
              />
              <Route
                path="/community/:id"
                element={
                  isAuthenticated ? (
                    <>
                      <CommunityChat onLogout={handleLogout} />
                      <EmergencyButton />
                    </>
                  ) : (
                    <Navigate to="/signup" />
                  )
                }
              />
              <Route
                path="/voice-blog"
                element={
                  isAuthenticated ? (
                    <>
                      <VoiceBlog onLogout={handleLogout} />
                      <EmergencyButton />
                    </>
                  ) : (
                    <Navigate to="/signup" />
                  )
                }
              />
              <Route
                path="/helpline"
                element={
                  isAuthenticated ? (
                    <>
                      <Helpline onLogout={handleLogout} />
                      <EmergencyButton />
                    </>
                  ) : (
                    <Navigate to="/signup" />
                  )
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </VoiceNavigationProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
