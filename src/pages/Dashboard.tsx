import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useStats } from "@/hooks/useStats";
import { AppHeader } from "@/components/Layout/AppHeader";
import { StatsGrid } from "@/components/Dashboard/StatsGrid";
import { RecentActivity } from "@/components/Dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { data: profile } = useProfile();
  const { data: stats } = useStats();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-1">
            Welcome back, {profile?.name || "Learner"} 👋
          </h1>
          <p className="text-muted-foreground">
            Continue your {profile?.preferred_domain || "learning"} journey
          </p>
        </motion.div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-hero border-0 overflow-hidden relative">
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                    <span className="text-sm font-medium text-primary-foreground/80">AI-Powered Learning</span>
                  </div>
                  <h2 className="text-xl font-display font-bold text-primary-foreground mb-1">
                    Ask anything, learn everything
                  </h2>
                  <p className="text-sm text-primary-foreground/70">
                    Get personalized explanations tailored to your level
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/learn")}
                  size="lg"
                  className="bg-card text-foreground hover:bg-card/90 shrink-0"
                >
                  Start Learning <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        {stats && (
          <div className="mb-8">
            <StatsGrid
              totalInteractions={stats.totalInteractions}
              quizAccuracy={stats.quizAccuracy}
              streak={stats.streak}
              avgRating={stats.avgRating}
            />
          </div>
        )}

        {/* Recent activity */}
        <RecentActivity />
      </main>
    </div>
  );
};

export default Dashboard;
