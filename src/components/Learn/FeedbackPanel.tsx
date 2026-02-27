import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface FeedbackPanelProps {
  interactionId: string;
}

export function FeedbackPanel({ interactionId }: FeedbackPanelProps) {
  const [rating, setRating] = useState(0);
  const [comprehension, setComprehension] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user) return;
    await supabase.from("feedback").insert({
      interaction_id: interactionId,
      user_id: user.id,
      rating,
      comprehension_score: comprehension,
    });
    setSubmitted(true);
    toast({ title: "Thanks for your feedback!" });
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-sm text-success p-3 bg-success/5 rounded-lg"
      >
        <ThumbsUp className="w-4 h-4" />
        Feedback recorded — we'll personalize your next session!
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-4 rounded-lg border border-border bg-card space-y-4"
    >
      <p className="text-sm font-medium text-foreground">How was this response?</p>

      <div>
        <p className="text-xs text-muted-foreground mb-2">Helpfulness</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)}>
              <Star
                className={`w-5 h-5 transition-colors ${
                  n <= rating ? "text-warning fill-warning" : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">How well did you understand?</p>
        <div className="flex gap-2">
          {[
            { val: 1, label: "Lost" },
            { val: 2, label: "Somewhat" },
            { val: 3, label: "Mostly" },
            { val: 4, label: "Fully" },
          ].map((c) => (
            <button
              key={c.val}
              onClick={() => setComprehension(c.val)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                comprehension === c.val
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground border-border hover:border-primary/30"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        size="sm"
        onClick={handleSubmit}
        disabled={!rating || !comprehension}
        className="bg-gradient-primary"
      >
        Submit Feedback
      </Button>
    </motion.div>
  );
}
