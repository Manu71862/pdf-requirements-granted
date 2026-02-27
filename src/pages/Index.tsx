import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Target, Brain, ArrowRight } from "lucide-react";

const features = [
  { icon: Brain, title: "AI-Powered Learning", desc: "Get personalized explanations tailored to your level" },
  { icon: Target, title: "Adaptive Quizzes", desc: "Test your understanding with auto-generated quizzes" },
  { icon: Sparkles, title: "Smart Feedback", desc: "The system learns from you to improve over time" },
];

const Index = () => {
  const { user, loading } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (profile && (!profile.preferred_domain || profile.preferred_domain === "general" && !profile.experience_level)) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, loading, profile, navigate]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 pt-20 pb-16 relative z-10">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">Learnflow</span>
            </div>
            <Button onClick={() => navigate("/auth")} className="bg-gradient-primary">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by Generative AI
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Learn <span className="text-gradient-primary">smarter</span>,{" "}
              <br className="hidden sm:inline" />
              not harder
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
              An adaptive learning platform that personalizes content to your level,
              tracks your progress, and helps you master any topic.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/auth")} className="bg-gradient-primary text-lg px-8">
                Start Learning Free
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-primary/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:animate-pulse-glow">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
