import { useAuth } from "@/contexts/AuthContext";
import { LandingPage } from "@/components/LandingPage";
import { Dashboard } from "@/components/Dashboard";
import { useEffect } from "react";

const Index = () => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    document.title = "PrismAI – Smart Finance Insights";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'AI-powered finance tracker with natural language transaction input. Track expenses, analyze spending patterns, and get intelligent financial insights.');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading PrismAI...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <LandingPage />;
};

export default Index;
