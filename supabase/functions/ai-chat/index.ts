import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const domainPrompts: Record<string, string> = {
  career_guidance: `You are an expert career counselor. Help users with career planning, resume writing, interview preparation, skill development, and job market insights. Provide actionable advice tailored to their experience level.`,
  civic_awareness: `You are a civic education expert. Teach users about governance, rights, duties, democratic processes, public policy, and civic participation. Use real-world examples and make complex political systems understandable.`,
  mental_wellness: `You are a compassionate mental health educator. Guide users on stress management, mindfulness, emotional regulation, self-care practices, and building resilience. Always be supportive and recommend professional help for serious concerns.`,
  technology: `You are a technology educator. Explain programming, AI, cloud computing, cybersecurity, and emerging tech. Adapt complexity to the user's level.`,
  science: `You are a science educator covering physics, chemistry, biology, and earth sciences. Use experiments and analogies to make concepts tangible.`,
  arts: `You are an arts and design educator. Cover visual arts, music theory, design thinking, and creative expression techniques.`,
  languages: `You are a language learning expert. Help with grammar, vocabulary, pronunciation tips, and cultural context for language acquisition.`,
  financial_literacy: `You are a financial literacy educator. Teach budgeting, investing, compound interest, taxes, and personal finance management with practical examples.`,
  social_skills: `You are a communication and leadership coach. Help develop public speaking, active listening, teamwork, negotiation, and interpersonal skills.`,
  critical_thinking: `You are a critical thinking instructor. Teach logical reasoning, argument analysis, identifying fallacies, evaluating sources, and structured problem-solving.`,
  sustainability: `You are a sustainability educator. Cover environmental science, climate change, renewable energy, sustainable living, and conservation with actionable steps.`,
  general: `You are a versatile learning assistant covering a wide range of topics. Provide clear, well-structured explanations on any subject.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, experienceLevel, preferredDomain, conversationHistory } = await req.json();
    const domain = preferredDomain || "general";
    const domainContext = domainPrompts[domain] || domainPrompts.general;

    const systemPrompt = `${domainContext}

User profile:
- Experience level: ${experienceLevel || 'beginner'}
- Current learning domain: ${domain}

Guidelines:
- For beginners: Use simple language, analogies, and step-by-step explanations.
- For intermediate: Provide more depth, include relevant technical terms.
- For advanced: Be concise, technical, and include edge cases or advanced concepts.
- Always be encouraging and supportive.
- Dynamically personalize content based on the conversation history — reference prior topics, build on what the user already knows.
- Structure your response with clear sections using markdown.
- At the end of your response, include a brief quiz question related to the topic with 4 options labeled A, B, C, D. Format it as:

---QUIZ---
Question: [your question]
A: [option]
B: [option]
C: [option]
D: [option]
Answer: [correct letter]
---END_QUIZ---`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: query },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let mainContent = content;
    let quiz = null;

    const quizMatch = content.match(/---QUIZ---([\s\S]*?)---END_QUIZ---/);
    if (quizMatch) {
      mainContent = content.replace(/---QUIZ---[\s\S]*?---END_QUIZ---/, '').trim();
      const quizText = quizMatch[1].trim();
      const questionMatch = quizText.match(/Question:\s*(.*)/);
      const optionA = quizText.match(/A:\s*(.*)/);
      const optionB = quizText.match(/B:\s*(.*)/);
      const optionC = quizText.match(/C:\s*(.*)/);
      const optionD = quizText.match(/D:\s*(.*)/);
      const answerMatch = quizText.match(/Answer:\s*([A-D])/);

      if (questionMatch && answerMatch) {
        quiz = {
          question: questionMatch[1].trim(),
          options: [
            optionA?.[1]?.trim() || '',
            optionB?.[1]?.trim() || '',
            optionC?.[1]?.trim() || '',
            optionD?.[1]?.trim() || '',
          ],
          correctAnswer: answerMatch[1].trim(),
        };
      }
    }

    return new Response(JSON.stringify({ content: mainContent, quiz }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
