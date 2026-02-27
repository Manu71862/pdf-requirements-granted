import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, experienceLevel, preferredDomain, conversationHistory } = await req.json();

    const systemPrompt = `You are an adaptive learning assistant that personalizes content based on the user's level and interests.

User profile:
- Experience level: ${experienceLevel || 'beginner'}
- Preferred domain: ${preferredDomain || 'general'}

Guidelines:
- For beginners: Use simple language, analogies, and step-by-step explanations.
- For intermediate: Provide more depth, include relevant technical terms.
- For advanced: Be concise, technical, and include edge cases or advanced concepts.
- Always be encouraging and supportive.
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

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse quiz from response
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
