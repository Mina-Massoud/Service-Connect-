"use client";

import Link from "next/link";
import {
  Home,
  CalendarCheck,
  MessageCircle,
  Wallet,
  User,
  LayoutDashboard,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Role = "learner" | "instructor";
export type NavTab =
  | "home"
  | "orders"
  | "messages"
  | "wallet"
  | "profile"
  | "dashboard"
  | "bookings"
  | "earnings";

interface TabDef {
  id: NavTab;
  label: string;
  href: string;
  icon: typeof Home;
}

const learnerTabs: TabDef[] = [
  { id: "home", label: "Home", href: "/home", icon: Home },
  { id: "orders", label: "Orders", href: "/orders", icon: CalendarCheck },
  { id: "messages", label: "Messages", href: "/messages", icon: MessageCircle },
  { id: "wallet", label: "Wallet", href: "/wallet", icon: Wallet },
  { id: "profile", label: "Profile", href: "/profile", icon: User },
];

const instructorTabs: TabDef[] = [
  { id: "dashboard", label: "Dashboard", href: "/instructor", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", href: "/instructor/bookings", icon: Inbox },
  { id: "messages", label: "Messages", href: "/messages", icon: MessageCircle },
  { id: "earnings", label: "Earnings", href: "/wallet", icon: Wallet },
  { id: "profile", label: "Profile", href: "/profile", icon: User },
];

interface BottomNavProps {
  active?: NavTab;
  role?: Role;
}

export function BottomNav({ active, role = "learner" }: BottomNavProps) {
  const tabs = role === "instructor" ? instructorTabs : learnerTabs;
  return (
    <nav className="shrink-0 border-t border-border bg-background/95 backdrop-blur">
      <ul className="flex items-stretch justify-around px-2 pb-1.5 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === active;
          return (
            <li key={tab.id} className="flex-1">
              <Link
                href={tab.href}
                data-demo={`nav-${tab.id}`}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl py-1 text-[11px] font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={isActive ? 2.6 : 2}
                  fill={isActive ? "currentColor" : "none"}
                  fillOpacity={isActive ? 0.12 : 0}
                />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
