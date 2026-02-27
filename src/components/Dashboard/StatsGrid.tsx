import { motion } from "framer-motion";
import { BookOpen, Target, Flame, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsGridProps {
  totalInteractions: number;
  quizAccuracy: number;
  streak: number;
  avgRating: number;
}

const stats = [
  { key: "totalInteractions", label: "Topics Explored", icon: BookOpen, color: "text-primary" },
  { key: "quizAccuracy", label: "Quiz Accuracy", icon: Target, color: "text-success", suffix: "%" },
  { key: "streak", label: "Day Streak", icon: Flame, color: "text-accent" },
  { key: "avgRating", label: "Avg Satisfaction", icon: Star, color: "text-warning", suffix: "/5" },
];

export function StatsGrid(props: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="bg-gradient-card hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">
                {(props as any)[stat.key]}
                {stat.suffix && <span className="text-sm font-normal text-muted-foreground">{stat.suffix}</span>}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
