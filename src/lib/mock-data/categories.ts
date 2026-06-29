import type { Category } from "@/lib/types";

export const categories: Category[] = [
  { id: "life-skills", name: "Life Skills", icon: "Sparkles", color: "#2563EB" },
  { id: "design", name: "Design", icon: "PenTool", color: "#7C3AED" },
  { id: "music", name: "Music", icon: "Music", color: "#DB2777" },
  { id: "photography", name: "Photography", icon: "Camera", color: "#0891B2" },
  { id: "cooking", name: "Cooking", icon: "ChefHat", color: "#EA580C" },
  { id: "fishing", name: "Fishing", icon: "Fish", color: "#0D9488" },
  { id: "diy", name: "DIY", icon: "Hammer", color: "#CA8A04" },
  { id: "gardening", name: "Gardening", icon: "Sprout", color: "#16A34A" },
  { id: "home-repair", name: "Home Repair", icon: "Wrench", color: "#475569" },
  { id: "languages", name: "Languages", icon: "Languages", color: "#9333EA" },
  { id: "fitness", name: "Fitness", icon: "Dumbbell", color: "#DC2626" },
  { id: "business", name: "Business", icon: "Briefcase", color: "#1D4ED8" },
];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
