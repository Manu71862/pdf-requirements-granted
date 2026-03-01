import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export interface DomainStat {
  domain: string;
  interactions: number;
  quizAttempts: number;
  correctAnswers: number;
  accuracy: number;
  avgRating: number;
  feedbackCount: number;
}

export interface DailyActivity {
  date: string;
  interactions: number;
}

export function useAnalytics() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["analytics", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const [interactionsRes, attemptsRes, feedbackRes] = await Promise.all([
        supabase
          .from("user_interactions")
          .select("id, domain, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true }),
        supabase
          .from("quiz_attempts")
          .select("id, is_correct, attempted_at, quiz_id")
          .eq("user_id", user.id),
        supabase
          .from("feedback")
          .select("id, rating, interaction_id, comprehension_score")
          .eq("user_id", user.id),
      ]);

      const interactions = interactionsRes.data || [];
      const attempts = attemptsRes.data || [];
      const feedbacks = feedbackRes.data || [];

      // Get interaction->domain mapping
      const interactionDomainMap = new Map<string, string>();
      interactions.forEach((i) => interactionDomainMap.set(i.id, i.domain || "general"));

      // Per-domain stats
      const domainMap = new Map<string, DomainStat>();
      interactions.forEach((i) => {
        const d = i.domain || "general";
        if (!domainMap.has(d)) {
          domainMap.set(d, { domain: d, interactions: 0, quizAttempts: 0, correctAnswers: 0, accuracy: 0, avgRating: 0, feedbackCount: 0 });
        }
        domainMap.get(d)!.interactions++;
      });

      // Map feedback to domains via interaction_id
      feedbacks.forEach((f) => {
        const d = f.interaction_id ? interactionDomainMap.get(f.interaction_id) || "general" : "general";
        const stat = domainMap.get(d);
        if (stat && f.rating) {
          stat.avgRating = (stat.avgRating * stat.feedbackCount + f.rating) / (stat.feedbackCount + 1);
          stat.feedbackCount++;
        }
      });

      // We need quiz->interaction mapping for domain
      // Fetch quizzes for the user's interactions
      const interactionIds = interactions.map((i) => i.id);
      const quizzesRes = interactionIds.length > 0
        ? await supabase.from("quizzes").select("id, interaction_id").in("interaction_id", interactionIds)
        : { data: [] };
      
      const quizInteractionMap = new Map<string, string>();
      (quizzesRes.data || []).forEach((q) => {
        if (q.interaction_id) quizInteractionMap.set(q.id, q.interaction_id);
      });

      attempts.forEach((a) => {
        const interactionId = a.quiz_id ? quizInteractionMap.get(a.quiz_id) : null;
        const d = interactionId ? interactionDomainMap.get(interactionId) || "general" : "general";
        const stat = domainMap.get(d);
        if (stat) {
          stat.quizAttempts++;
          if (a.is_correct) stat.correctAnswers++;
        }
      });

      // Calculate accuracy
      domainMap.forEach((stat) => {
        stat.accuracy = stat.quizAttempts > 0 ? Math.round((stat.correctAnswers / stat.quizAttempts) * 100) : 0;
        stat.avgRating = Math.round(stat.avgRating * 10) / 10;
      });

      const domainStats = Array.from(domainMap.values()).sort((a, b) => b.interactions - a.interactions);

      // Daily activity (last 30 days)
      const dailyMap = new Map<string, number>();
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dailyMap.set(d.toISOString().split("T")[0], 0);
      }
      interactions.forEach((i) => {
        const day = i.created_at?.split("T")[0];
        if (day && dailyMap.has(day)) {
          dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
        }
      });
      const dailyActivity: DailyActivity[] = Array.from(dailyMap.entries()).map(([date, interactions]) => ({ date, interactions }));

      // Overall
      const totalInteractions = interactions.length;
      const totalAttempts = attempts.length;
      const totalCorrect = attempts.filter((a) => a.is_correct).length;
      const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
      const overallRating = feedbacks.length > 0
        ? Math.round((feedbacks.reduce((s, f) => s + (f.rating || 0), 0) / feedbacks.length) * 10) / 10
        : 0;

      return {
        domainStats,
        dailyActivity,
        totalInteractions,
        totalAttempts,
        totalCorrect,
        overallAccuracy,
        overallRating,
        activeDomains: domainStats.length,
      };
    },
    enabled: !!user,
  });
}
