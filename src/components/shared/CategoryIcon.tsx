import {
  Sparkles,
  PenTool,
  Music,
  Camera,
  ChefHat,
  Fish,
  Hammer,
  Sprout,
  Wrench,
  Languages,
  Dumbbell,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  PenTool,
  Music,
  Camera,
  ChefHat,
  Fish,
  Hammer,
  Sprout,
  Wrench,
  Languages,
  Dumbbell,
  Briefcase,
};

interface CategoryIconProps {
  name: string;
  className?: string;
}

export function CategoryIcon({ name, className }: CategoryIconProps) {
  const Icon = iconMap[name] ?? Sparkles;
  return <Icon className={className} />;
}
