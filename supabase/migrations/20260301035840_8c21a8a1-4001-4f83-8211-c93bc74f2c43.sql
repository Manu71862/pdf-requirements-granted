
-- Add domain column to user_interactions for per-domain analytics
ALTER TABLE public.user_interactions ADD COLUMN domain text DEFAULT 'general';

-- Update RLS to allow updating generated_response
CREATE POLICY "Users can update own interactions"
ON public.user_interactions
FOR UPDATE
USING (auth.uid() = user_id);
