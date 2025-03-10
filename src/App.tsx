
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
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import CommunityChat from "./pages/CommunityChat";
import Helpline from "./pages/Helpline";
import EmergencyButton from "./components/EmergencyButton";
import { VoiceNavigationProvider } from "./providers/VoiceNavigationProvider";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Type augmentations for page components
declare module "./pages/Index" {
  export interface IndexProps {
    onLogout: () => void;
  }
}

declare module "./pages/Reminders" {
  export interface RemindersProps {
    onLogout: () => void;
  }
}

declare module "./pages/Community" {
  export interface CommunityProps {
    onLogout: () => void;
  }
}

declare module "./pages/CommunityChat" {
  export interface CommunityChatProps {
    onLogout: () => void;
  }
}

declare module "./pages/VoiceBlog" {
  export interface VoiceBlogProps {
    onLogout: () => void;
  }
}

declare module "./pages/Helpline" {
  export interface HelplineProps {
    onLogout: () => void;
  }
}

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
                path="/signin" 
                element={
                  isAuthenticated ? <Navigate to="/" /> : <SignIn setIsAuthenticated={setIsAuthenticated} />
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
                    <Navigate to="/signin" />
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
                    <Navigate to="/signin" />
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
                    <Navigate to="/signin" />
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
                    <Navigate to="/signin" />
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
                    <Navigate to="/signin" />
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
                    <Navigate to="/signin" />
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
