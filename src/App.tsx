import { useState, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppNav } from "@/components/AppNav";
import { Home } from "@/pages/Home";
import { Marketplace } from "@/pages/Marketplace";
import { MyAgents } from "@/pages/MyAgents";
import { Builder } from "@/pages/Builder";
import { Earnings } from "@/pages/Earnings";
import { Pricing } from "@/pages/Pricing";
import { SignInModal } from "@/components/SignInModal";
import "@xyflow/react/dist/style.css";
import { PageLoader } from "@/components/PageLoader"; // <-- Add this import
import { ThemeProvider } from "next-themes";
const queryClient = new QueryClient();

export type View =
  | "home"
  | "marketplace"
  | "my-agents"
  | "builder"
  | "earnings"
  | "pricing";

function AppContent() {
  const [activeView, setActiveView] = useState<View>("home");
  const [isLoading, setIsLoading] = useState(false); // <-- New loading state
  const [signInOpen, setSignInOpen] = useState(false);
  const [signInMode, setSignInMode] = useState<"signin" | "signup">("signin");

  // <-- New Custom Navigation Handler -->
  const handleNavigate = (newView: View) => {
    if (newView === activeView) return; // Don't reload if already on the page

    setIsLoading(true); // Fade in the loading screen

    // Wait 1.5 seconds for the magic animation, then swap the view
    setTimeout(() => {
      setActiveView(newView);
      setIsLoading(false);
    }, 1500); 
  };

  const openSignIn = (mode: "signin" | "signup" = "signin") => {
    setSignInMode(mode);
    setSignInOpen(true);
  };

  const isHome = activeView === "home";

  // 🔥 Centralized view mapping (easier to scale)
  const views = useMemo(
    () => ({
      home: (
        <Home onNavigate={handleNavigate} onSignIn={openSignIn} /> // <-- Updated
      ),
      marketplace: <Marketplace />,
      "my-agents": <MyAgents />,
      builder: <Builder />,
      earnings: <Earnings />,
      pricing: (
        <Pricing onNavigate={handleNavigate} onSignIn={openSignIn} /> // <-- Updated
      ),
    }),
    [activeView]
  );

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0c12]">
      {/* Magical Loading Overlay */}
      <PageLoader isVisible={isLoading} /> 

      {/* Navigation */}
      {!isHome && (
        <AppNav
          activeView={activeView}
          onNavigate={handleNavigate} // <-- Updated to handleNavigate
          onSignIn={openSignIn}
        />
      )}

      {/* Main Content */}
      <main
        className="flex-1 flex flex-col overflow-hidden"
        style={!isHome ? { paddingTop: "56px" } : undefined}
      >
        {views[activeView]}
      </main>

      {/* Auth Modal */}
      <SignInModal
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        mode={signInMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
