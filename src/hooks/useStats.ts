import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export function useStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["stats", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const [interactions, attempts, feedback] = await Promise.all([
        supabase.from("user_interactions").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("quiz_attempts").select("id, is_correct", { count: "exact" }).eq("user_id", user.id),
        supabase.from("feedback").select("rating").eq("user_id", user.id),
      ]);

      const totalInteractions = interactions.count || 0;
      const totalAttempts = attempts.count || 0;
      const correctAttempts = attempts.data?.filter((a) => a.is_correct).length || 0;
      const avgRating = feedback.data?.length
        ? feedback.data.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.data.length
        : 0;

      return {
        totalInteractions,
        totalAttempts,
        correctAttempts,
        quizAccuracy: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0,
        avgRating: Math.round(avgRating * 10) / 10,
        streak: Math.min(totalInteractions, 7), // simplified streak
      };
    },
    enabled: !!user,
  });
}
