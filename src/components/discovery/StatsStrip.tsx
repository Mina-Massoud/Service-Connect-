import { Star, Users, Clock, MapPin } from "lucide-react";
import type { Service } from "@/lib/types";

interface StatsStripProps {
  service: Pick<
    Service,
    "rating" | "reviewCount" | "studentCount" | "durationMinutes" | "locationType"
  >;
}

export function StatsStrip({ service }: StatsStripProps) {
  const cells = [
    {
      icon: <Star className="h-4 w-4 fill-amber-400 text-amber-400" />,
      label: service.rating.toFixed(1),
      sub: `${service.reviewCount} reviews`,
    },
    {
      icon: <Users className="h-4 w-4 text-primary" />,
      label: String(service.studentCount),
      sub: "students",
    },
    {
      icon: <Clock className="h-4 w-4 text-primary" />,
      label: `${service.durationMinutes}m`,
      sub: "duration",
    },
    {
      icon: <MapPin className="h-4 w-4 text-primary" />,
      label: service.locationType,
      sub: "location",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 rounded-2xl border border-border bg-card p-3">
      {cells.map(({ icon, label, sub }) => (
        <div key={sub} className="flex flex-col items-center gap-1 text-center">
          {icon}
          <span className="text-xs font-bold text-foreground">{label}</span>
          <span className="text-[10px] leading-tight text-muted-foreground">{sub}</span>
        </div>
      ))}
    </div>
  );
}
