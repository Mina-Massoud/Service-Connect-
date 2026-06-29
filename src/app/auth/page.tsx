"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, Zap } from "lucide-react";
import { Screen, ScreenHeader } from "@/components/phone";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useActions } from "@/lib/store";

export default function AuthPage() {
  const router = useRouter();
  const a = useActions();

  const [termsAgreed, setTermsAgreed] = useState(false);

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const canRegister = regName.trim().length > 0 && regEmail.trim().length > 0;
  const canLogin = loginEmail.trim().length > 0;

  function handleRegister() {
    a.signup({ name: regName, email: regEmail });
    router.push("/onboarding/profile");
  }

  function handleLogin() {
    a.login({ email: loginEmail });
    router.push("/home");
  }

  function handleSSOLogin() {
    a.login();
    router.push("/home");
  }

  return (
    <Screen header={<ScreenHeader showBack backHref="/" />}>
      <div className="flex flex-col items-center gap-5 pb-4">
        {/* Wordmark + logo */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Zap className="h-8 w-8 fill-white text-white" aria-hidden="true" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              ServiceConnect
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              The trusted marketplace for professional
              <br />
              services and secure payments.
            </p>
          </div>
        </div>

        {/* Login / Register tabs */}
        <Tabs defaultValue="register" className="w-full">
          <TabsList className="h-11 w-full rounded-xl p-1">
            <TabsTrigger value="login" className="flex-1 rounded-lg text-sm">
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="flex-1 rounded-lg text-sm"
            >
              Register
            </TabsTrigger>
          </TabsList>

          {/* ── Register Panel ── */}
          <TabsContent value="register" className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="reg-name">Full Name</Label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="reg-name"
                  placeholder="John Doe"
                  className="h-11 pl-9"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-email">Email Address</Label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="john@example.com"
                  className="h-11 pl-9"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-phone">Phone Number</Label>
              <div className="relative">
                <Phone
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="reg-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="h-11 pl-9"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-password">Create Password</Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="Min. 8 characters"
                  className="h-11 pl-9"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
              />
              <span className="text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <span className="text-primary underline">Terms of Service</span>{" "}
                and{" "}
                <span className="text-primary underline">Privacy Policy</span>.
                We use escrow for all transactions.
              </span>
            </label>

            <Button
              className="h-12 w-full rounded-xl text-base font-semibold"
              disabled={!canRegister}
              onClick={handleRegister}
            >
              Create Account →
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                or continue with
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="h-11 flex-1 rounded-xl font-medium"
                onClick={handleSSOLogin}
              >
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="h-11 flex-1 rounded-xl font-medium"
                onClick={handleSSOLogin}
              >
                Continue with Apple
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <span className="font-medium text-primary">Login</span>
            </p>
          </TabsContent>

          {/* ── Login Panel ── */}
          <TabsContent value="login" className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email Address</Label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="john@example.com"
                  className="h-11 pl-9"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Your password"
                  className="h-11 pl-9"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button
              className="h-12 w-full rounded-xl text-base font-semibold"
              disabled={!canLogin}
              onClick={handleLogin}
            >
              Log In
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                or continue with
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="h-11 flex-1 rounded-xl font-medium"
                onClick={handleSSOLogin}
              >
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="h-11 flex-1 rounded-xl font-medium"
                onClick={handleSSOLogin}
              >
                Continue with Apple
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <span className="font-medium text-primary">Register</span>
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </Screen>
  );
}
