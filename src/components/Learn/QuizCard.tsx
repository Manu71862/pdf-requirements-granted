import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface QuizCardProps {
  interactionId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  onComplete?: (isCorrect: boolean) => void;
}

export function QuizCard({ interactionId, question, options, correctAnswer, onComplete }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const letters = ["A", "B", "C", "D"];

  const isCorrect = selected !== null && letters[selected] === correctAnswer;

  const handleSubmit = async () => {
    if (selected === null || !user) return;
    setSubmitted(true);

    // Save quiz and attempt
    const { data: quiz } = await supabase.from("quizzes").insert({
      interaction_id: interactionId,
      question,
      options: JSON.stringify(options),
      correct_answer: correctAnswer,
    }).select().single();

    if (quiz) {
      await supabase.from("quiz_attempts").insert({
        quiz_id: quiz.id,
        user_id: user.id,
        user_answer: letters[selected],
        is_correct: isCorrect,
      });
    }

    onComplete?.(isCorrect);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary" />
            Quick Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm font-medium">{question}</p>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <button
                key={i}
                disabled={submitted}
                onClick={() => setSelected(i)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-all border ${
                  submitted
                    ? letters[i] === correctAnswer
                      ? "bg-success/10 border-success text-foreground"
                      : selected === i
                        ? "bg-destructive/10 border-destructive text-foreground"
                        : "bg-secondary border-border text-muted-foreground"
                    : selected === i
                      ? "bg-primary/10 border-primary text-foreground"
                      : "bg-secondary border-border text-foreground hover:border-primary/30"
                }`}
              >
                <span className="font-medium mr-2">{letters[i]}.</span>
                {opt}
                {submitted && letters[i] === correctAnswer && (
                  <CheckCircle2 className="w-4 h-4 text-success inline ml-2" />
                )}
                {submitted && selected === i && !isCorrect && (
                  <XCircle className="w-4 h-4 text-destructive inline ml-2" />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {!submitted ? (
              <Button
                onClick={handleSubmit}
                disabled={selected === null}
                size="sm"
                className="bg-gradient-primary"
              >
                Check Answer
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-3 rounded-lg text-sm font-medium ${
                  isCorrect ? "bg-success/10 text-success" : "bg-accent/10 text-accent"
                }`}
              >
                {isCorrect ? "🎉 Correct! Great job!" : "Not quite — keep learning!"}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
