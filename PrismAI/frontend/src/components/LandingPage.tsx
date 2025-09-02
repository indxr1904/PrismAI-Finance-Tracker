import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Brain,
  Shield,
  ChartBar,
  Zap,
  Globe,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const LandingPage = () => {
  const { login } = useAuth();

  const handleGoogleSignIn = () => {
    login();
  };

  return (
    <div className="min-h-screen bg-gradient-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-text">
                PrismAI
              </span>
            </div>
            <Button variant="hero" onClick={handleGoogleSignIn}>
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Brain className="h-4 w-4 mr-2" />
                  AI-Powered Finance
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Smart Finance
                  <span className="gradient-text block">Made Simple</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                  Track expenses, analyze spending patterns, and get
                  AI-powered insights using natural language. Your
                  intelligent financial companion.
                </p>
              </div>

              <Button
                variant="financial"
                size="lg"
                onClick={handleGoogleSignIn}
              >
                Get Started with Google
              </Button>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10k+</div>
                  <div className="text-sm text-muted-foreground">
                    Active Users
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">$2M+</div>
                  <div className="text-sm text-muted-foreground">Tracked</div>
                </div>
              </div>
            </div>

            {/* Right: Illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-wealth rounded-3xl blur-3xl opacity-20 animate-float" />
              <div className="bg-gradient-wealth rounded-2xl p-8 shadow-financial hover:shadow-glow transition-all duration-500 hover:scale-105">
                <div className="text-center space-y-4">
                  <div className="text-6xl">📊</div>
                  <h3 className="text-xl font-semibold text-primary-foreground">
                    Finance Dashboard
                  </h3>
                  <p className="text-primary-foreground/80">
                    Beautiful charts and insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card-elevated/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Powerful Features for
              <span className="gradient-text"> Smarter Finance</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of personal finance with AI-powered
              insights and intuitive design
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="financial-card group">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Card className="financial-card p-12 bg-gradient-wealth/10 border-primary/20">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Transform Your
                <span className="gradient-text block">Financial Future?</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of users taking control of their finances
                with AI-powered insights.
              </p>
              <Button
                variant="financial"
                size="lg"
                onClick={handleGoogleSignIn}
                className="text-lg px-8"
              >
                Start Free with Google
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: Brain,
    title: "AI Transaction Parsing",
    description:
      "Type 'bought coffee $5' and our AI automatically categorizes and records your expense.",
  },
  {
    icon: ChartBar,
    title: "Smart Analytics",
    description:
      "Get detailed insights into your spending patterns with interactive charts.",
  },
  {
    icon: TrendingUp,
    title: "Trend Analysis",
    description:
      "Identify spending trends and receive personalized recommendations to save money.",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description:
      "Your financial data is protected with enterprise-grade encryption.",
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description:
      "All your transactions sync instantly across devices with real-time updates.",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description:
      "Track expenses in multiple currencies with automatic conversion.",
  },
];
