import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { elitehosting } from "@/integrations/elitehosting/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/site/Logo";
import { Zap, ShieldCheck, Rocket } from "lucide-react";

const searchSchema = z.object({ ref: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Log in or sign up — EliteHosting" },
      {
        name: "description",
        content:
          "Sign in or create your EliteHosting account. Deploy code from GitHub or ZIP in seconds.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app/home" });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col p-6 sm:p-10">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Sign in to deploy your next project.
            </p>

            <div className="mt-6">
              <GoogleButton />
            </div>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                or
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
              <TabsList className="grid grid-cols-2 w-full h-9">
                <TabsTrigger value="signin" className="text-xs">
                  Sign in
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-xs">
                  Create account
                </TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="mt-4">
                <SignInForm />
              </TabsContent>
              <TabsContent value="signup" className="mt-4">
                <SignUpForm defaultRef={search.ref} />
              </TabsContent>
            </Tabs>
            <p className="mt-6 text-[11px] text-muted-foreground text-center">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
      {/* Brand side */}
      <div
        className="hidden lg:flex relative overflow-hidden items-center justify-center p-10"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="relative z-10 max-w-md text-white space-y-6">
          <div className="inline-flex items-center gap-2 text-xs bg-white/10 border border-white/20 rounded-full px-3 py-1">
            <Zap className="h-3 w-3" /> Trusted by 10,000+ developers
          </div>
          <h2 className="text-3xl font-semibold leading-tight">
            Ship code without touching a server.
          </h2>
          <div className="space-y-3">
            <Feature icon={Rocket} text="Deploy Python, Node, or any stack in one click" />
            <Feature icon={ShieldCheck} text="Private repos, encrypted secrets" />
            <Feature icon={Zap} text="Live logs, instant restarts, full control" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, text }: { icon: typeof Zap; text: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <span>{text}</span>
    </div>
  );
}

function GoogleButton() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      variant="outline"
      className="w-full h-10 text-xs gap-2"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const result = await elitehosting.auth.signInWithOAuth("google", {
          redirect_uri: window.location.origin,
        });
        if (result.error) {
          setLoading(false);
          toast.error(result.error.message);
        }
      }}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
        />
      </svg>
      Continue with Google
    </Button>
  );
}

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) return toast.error(error.message);
        toast.success("Welcome back");
        navigate({ to: "/app/home" });
      }}
    >
      <div>
        <Label htmlFor="e1" className="text-xs">
          Email
        </Label>
        <Input
          id="e1"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-9 text-xs mt-1"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <Label htmlFor="p1" className="text-xs">
          Password
        </Label>
        <Input
          id="p1"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-9 text-xs mt-1"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full h-9 text-xs">
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "At least 8 characters"),
  fullName: z.string().min(2, "Enter your name"),
  referral_code: z.string().optional(),
});

function SignUpForm({ defaultRef }: { defaultRef?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [ref, setRef] = useState(defaultRef ?? "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const parsed = signupSchema.safeParse({ email, password, fullName, referral_code: ref });
        if (!parsed.success) return toast.error(parsed.error.errors[0].message);
        setLoading(true);
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/app/home",
            data: { full_name: fullName, referral_code: ref || null },
          },
        });
        setLoading(false);
        if (error) return toast.error(error.message);
        toast.success("Account created — check your email if confirmation is required");
        navigate({ to: "/app/home" });
      }}
    >
      <div>
        <Label htmlFor="n2" className="text-xs">
          Full name
        </Label>
        <Input
          id="n2"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="h-9 text-xs mt-1"
        />
      </div>
      <div>
        <Label htmlFor="e2" className="text-xs">
          Email
        </Label>
        <Input
          id="e2"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-9 text-xs mt-1"
        />
      </div>
      <div>
        <Label htmlFor="p2" className="text-xs">
          Password
        </Label>
        <Input
          id="p2"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-9 text-xs mt-1"
        />
      </div>
      <div>
        <Label htmlFor="r2" className="text-xs">
          Referral code <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="r2"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          className="h-9 text-xs mt-1"
          placeholder="ELITE-xxxxxxxx"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full h-9 text-xs">
        {loading ? "Creating..." : "Create account"}
      </Button>
    </form>
  );
}
