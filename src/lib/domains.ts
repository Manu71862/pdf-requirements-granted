import { BookOpen, Code, Microscope, Palette, Globe, Briefcase, GraduationCap, Heart, Shield, Brain, Users, Lightbulb, Scale } from "lucide-react";

export const domains = [
  { id: "career_guidance", label: "Career Guidance", icon: Briefcase, description: "Career planning, resume tips & interview prep" },
  { id: "civic_awareness", label: "Civic Awareness", icon: Shield, description: "Rights, governance & civic responsibilities" },
  { id: "mental_wellness", label: "Mental Wellness", icon: Heart, description: "Stress management, mindfulness & emotional health" },
  { id: "technology", label: "Technology", icon: Code, description: "Programming, AI & emerging tech" },
  { id: "science", label: "Science", icon: Microscope, description: "Physics, chemistry, biology & earth sciences" },
  { id: "arts", label: "Arts & Design", icon: Palette, description: "Visual arts, music & creative expression" },
  { id: "languages", label: "Languages", icon: Globe, description: "Language learning & communication skills" },
  { id: "financial_literacy", label: "Financial Literacy", icon: Scale, description: "Budgeting, investing & financial planning" },
  { id: "social_skills", label: "Social Skills", icon: Users, description: "Leadership, teamwork & communication" },
  { id: "critical_thinking", label: "Critical Thinking", icon: Brain, description: "Problem solving, logic & analytical skills" },
  { id: "sustainability", label: "Sustainability", icon: Lightbulb, description: "Environment, climate & sustainable living" },
  { id: "general", label: "General Knowledge", icon: BookOpen, description: "Broad topics & everyday learning" },
];

export const levels = [
  { id: "beginner", label: "Beginner", icon: GraduationCap, description: "Just getting started" },
  { id: "intermediate", label: "Intermediate", icon: Code, description: "Some experience" },
  { id: "advanced", label: "Advanced", icon: Brain, description: "Deep expertise" },
];

export function getDomainById(id: string) {
  return domains.find((d) => d.id === id);
}

export function getDomainLabel(id: string) {
  return getDomainById(id)?.label || id;
}
