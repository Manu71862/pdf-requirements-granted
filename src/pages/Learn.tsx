import { useState, useRef, useEffect } from "react";
import { AppHeader } from "@/components/Layout/AppHeader";
import { QuizCard } from "@/components/Learn/QuizCard";
import { FeedbackPanel } from "@/components/Learn/FeedbackPanel";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Sparkles, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  interactionId?: string;
  quiz?: { question: string; options: string[]; correctAnswer: string } | null;
}

const suggestedTopics = [
  "Explain how machine learning works",
  "What is photosynthesis?",
  "Teach me about the solar system",
  "How does the internet work?",
  "Explain quantum computing basics",
];

const Learn = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: profile } = useProfile();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Track implicit feedback (time spent)
  useEffect(() => {
    startTimeRef.current = Date.now();
    return () => {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (user && messages.length > 0) {
        const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
        if (lastAssistant?.interactionId) {
          supabase.from("implicit_feedback").insert({
            interaction_id: lastAssistant.interactionId,
            user_id: user.id,
            time_spent_seconds: timeSpent,
            repeated_query: false,
            navigation_pattern: "learn_page",
          });
        }
      }
    };
  }, []);

  const handleSend = async (query?: string) => {
    const q = query || input;
    if (!q.trim() || !user) return;
    setInput("");
    setLoading(true);

    const userMsg: Message = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Save interaction
      const { data: interaction } = await supabase
        .from("user_interactions")
        .insert({ user_id: user.id, input_query: q })
        .select()
        .single();

      // Call AI
      const conversationHistory = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          query: q,
          experienceLevel: profile?.experience_level || "beginner",
          preferredDomain: profile?.preferred_domain || "general",
          conversationHistory,
        },
      });

      if (error) throw error;

      // Update interaction with response
      if (interaction) {
        await supabase
          .from("user_interactions")
          .update({ generated_response: data.content })
          .eq("id", interaction.id);
      }

      const assistantMsg: Message = {
        role: "assistant",
        content: data.content,
        interactionId: interaction?.id,
        quiz: data.quiz,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pb-4">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 animate-float">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2 text-center">
                What would you like to learn?
              </h2>
              <p className="text-muted-foreground text-center mb-8 max-w-md">
                Ask any question and get a personalized explanation tailored to your
                <span className="font-medium text-foreground"> {profile?.experience_level || "beginner"}</span> level
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {suggestedTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleSend(topic)}
                    className="px-4 py-2 rounded-full text-sm bg-secondary hover:bg-primary/10 text-foreground border border-border hover:border-primary/30 transition-all"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 text-sm">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Card className="bg-gradient-card border-border/50">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="text-xs font-medium text-primary">AI Response</span>
                        </div>
                        <div className="prose prose-sm max-w-none text-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground [&_code]:bg-secondary [&_code]:px-1 [&_code]:rounded [&_a]:text-primary">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>

                    {msg.quiz && msg.interactionId && (
                      <QuizCard
                        interactionId={msg.interactionId}
                        question={msg.quiz.question}
                        options={msg.quiz.options}
                        correctAnswer={msg.quiz.correctAnswer}
                      />
                    )}

                    {msg.interactionId && (
                      <FeedbackPanel interactionId={msg.interactionId} />
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-muted-foreground text-sm"
            >
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Generating personalized response...
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="sticky bottom-0 pt-4 pb-2 bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()} className="bg-gradient-primary shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Learn;
