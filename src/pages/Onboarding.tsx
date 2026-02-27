import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Code, Microscope, Palette, Globe, Briefcase, GraduationCap, Rocket, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const domains = [
  { id: "technology", label: "Technology", icon: Code },
  { id: "science", label: "Science", icon: Microscope },
  { id: "arts", label: "Arts & Design", icon: Palette },
  { id: "languages", label: "Languages", icon: Globe },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "general", label: "General", icon: BookOpen },
];

const levels = [
  { id: "beginner", label: "Beginner", icon: GraduationCap, description: "Just getting started" },
  { id: "intermediate", label: "Intermediate", icon: Rocket, description: "Some experience" },
  { id: "advanced", label: "Advanced", icon: Award, description: "Deep expertise" },
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [domain, setDomain] = useState("");
  const [level, setLevel] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComplete = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ preferred_domain: domain, experience_level: level })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[0, 1].map((i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full bg-gradient-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: step >= i ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="domain"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                What are you interested in?
              </h2>
              <p className="text-muted-foreground mb-6">
                Choose your preferred learning domain
              </p>
              <div className="grid grid-cols-2 gap-3">
                {domains.map((d) => (
                  <Card
                    key={d.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      domain === d.id
                        ? "ring-2 ring-primary shadow-glow"
                        : "hover:border-primary/30"
                    }`}
                    onClick={() => setDomain(d.id)}
                  >
                    <CardContent className="flex items-center gap-3 p-4">
                      <d.icon className={`w-5 h-5 ${domain === d.id ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="font-medium text-sm">{d.label}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button
                className="w-full mt-6 bg-gradient-primary"
                disabled={!domain}
                onClick={() => setStep(1)}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="level"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                What's your experience level?
              </h2>
              <p className="text-muted-foreground mb-6">
                We'll tailor content to your level
              </p>
              <div className="space-y-3">
                {levels.map((l) => (
                  <Card
                    key={l.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      level === l.id
                        ? "ring-2 ring-primary shadow-glow"
                        : "hover:border-primary/30"
                    }`}
                    onClick={() => setLevel(l.id)}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        level === l.id ? "bg-gradient-primary" : "bg-secondary"
                      }`}>
                        <l.icon className={`w-5 h-5 ${level === l.id ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <p className="font-medium">{l.label}</p>
                        <p className="text-sm text-muted-foreground">{l.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
                  Back
                </Button>
                <Button
                  className="flex-1 bg-gradient-primary"
                  disabled={!level}
                  onClick={handleComplete}
                >
                  Start Learning
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Onboarding;
