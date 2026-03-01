import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Target, Brain, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { branding } from "@/lib/branding";
import { fadeUp, staggerContainer, staggerItem, transitions } from "@/lib/animations";

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
            <Logo size="md" nameClassName="font-display font-bold text-xl text-foreground" />
            <Button onClick={() => navigate("/auth")} className="bg-gradient-primary">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </nav>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={transitions.hero}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by Generative AI
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
              {branding.tagline.split(",")[0]},{" "}
              <br className="hidden sm:inline" />
              <span className="text-gradient-primary">{branding.tagline.split(",")[1]?.trim()}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
              {branding.description}
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
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-primary/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:animate-pulse-glow">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
