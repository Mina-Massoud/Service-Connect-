import Link from "next/link";
import { ShieldCheck, BadgeCheck, Sparkles, ArrowRight } from "lucide-react";
import { Screen } from "@/components/phone";
import { Button } from "@/components/ui/button";

const trustPoints = [
  { icon: ShieldCheck, label: "Secure escrow payments" },
  { icon: BadgeCheck, label: "Verified instructors" },
  { icon: Sparkles, label: "Trusted marketplace" },
];

export default function WelcomePage() {
  return (
    <Screen padded={false}>
      <div className="flex h-full flex-col">
        {/* Hero visual */}
        <div className="relative h-[46%] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=70"
            alt="People learning together"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="-mt-6 flex flex-1 flex-col px-7 pb-8">
          <div className="mb-6">
            <p className="mb-2 text-sm font-semibold text-primary">
              Welcome to ServiceConnect
            </p>
            <h1 className="text-[28px] font-extrabold leading-[1.15] tracking-tight text-foreground">
              Connecting expertise
              <br />
              with opportunity
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Learn any skill directly from real, experienced people — or earn by
              teaching what you already know.
            </p>
          </div>

          <ul className="mb-auto space-y-3">
            {trustPoints.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-primary">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="text-sm font-medium text-foreground">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-3">
            <Button
              asChild
              className="h-12 w-full rounded-xl text-base font-semibold"
            >
              <Link href="/auth" data-demo="welcome-get-started">
                Get Started
              </Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth"
                data-demo="welcome-login"
                className="font-semibold text-primary"
              >
                Log in
              </Link>
            </p>
            <div className="flex gap-2">
              <Link
                href="/demo"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Two-sided demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/showcase"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                Watch demo reel
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}
