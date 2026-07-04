import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Github,
  FileArchive,
  Terminal,
  Play,
  Square,
  ShieldCheck,
  Zap,
  Gauge,
  ArrowRight,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <Features />
        <HowItWorks />
        <PricingTeaser />
        <ReferralBanner />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="container-app relative pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-[11px] text-muted-foreground mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            v2.0 — ZIP deploys are live
          </div>
          <h1 className="font-semibold">
            Deploy your code. <br />
            <span className="text-gradient">Skip the DevOps.</span>
          </h1>
          <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
            Push a GitHub repo or drag a ZIP. EliteHosting clones, builds and runs it — with live
            logs, private-repo support and full start/stop control.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            <Button asChild size="lg" className="h-10 text-xs">
              <Link to="/auth">
                Start deploying free <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-10 text-xs">
              <Link to="/docs">View docs</Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Check className="h-3 w-3 text-success" /> No credit card
            </span>
            <span className="inline-flex items-center gap-1">
              <Check className="h-3 w-3 text-success" /> Free tier forever
            </span>
            <span className="inline-flex items-center gap-1">
              <Check className="h-3 w-3 text-success" /> Private repos
            </span>
          </div>
        </div>
        <TerminalMock />
      </div>
    </section>
  );
}

function TerminalMock() {
  const lines = [
    { t: "$", c: "elitehosting deploy --repo mybot", cls: "text-foreground" },
    { t: "→", c: "Cloning github.com/user/mybot ...", cls: "text-muted-foreground" },
    { t: "✓", c: "Cloned in 1.2s", cls: "text-success" },
    { t: "→", c: "Running: pip install -r requirements.txt", cls: "text-muted-foreground" },
    { t: "✓", c: "Installed 12 packages", cls: "text-success" },
    { t: "→", c: "Running: python main.py", cls: "text-muted-foreground" },
    { t: "✓", c: "Bot online — https://mybot.elitehost.app", cls: "text-primary" },
  ];
  return (
    <div className="glass-card p-4 md:p-5 font-mono text-[11px] leading-relaxed">
      <div className="flex items-center gap-1.5 pb-3 border-b border-border/60">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <span className="ml-2 text-[10px] text-muted-foreground">deploy.log</span>
      </div>
      <div className="pt-3 space-y-1">
        {lines.map((l, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-muted-foreground w-3">{l.t}</span>
            <span className={l.cls}>{l.c}</span>
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          <span className="text-muted-foreground w-3">$</span>
          <span className="inline-block w-1.5 h-3 bg-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function TrustStrip() {
  return (
    <section className="border-y border-border/40 py-6">
      <div className="container-app">
        <p className="text-center text-[11px] uppercase tracking-widest text-muted-foreground">
          Trusted by 10,000+ developers shipping side projects, bots, and startups
        </p>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Github,
    title: "Deploy from GitHub",
    desc: "Public or private repos. Connect once, deploy anything.",
  },
  {
    icon: FileArchive,
    title: "Upload a ZIP",
    desc: "No git needed. Drag any archive, we handle it.",
  },
  {
    icon: Terminal,
    title: "Live streaming logs",
    desc: "Watch every line of your build and runtime output in real time.",
  },
  {
    icon: Gauge,
    title: "Auto-detect stack",
    desc: "Python, Node, or Go — we pick the right build & start commands.",
  },
  {
    icon: ShieldCheck,
    title: "Encrypted env vars",
    desc: "Manage secrets safely. Import from a .env with one click.",
  },
  {
    icon: Zap,
    title: "Start · Stop · Restart",
    desc: "Full control from a clean dashboard, no CLI required.",
  },
];

function Features() {
  return (
    <section className="py-20">
      <div className="container-app">
        <div className="max-w-xl mb-10">
          <h2>Everything you need to ship.</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Purpose-built for developers who want to focus on code, not infrastructure.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-card p-5 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                <f.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Connect",
      d: "Link your GitHub or upload a ZIP file — public or private, doesn't matter.",
    },
    {
      n: "02",
      t: "Configure",
      d: "Set build command, start command and env vars. Or let us auto-detect.",
    },
    { n: "03", t: "Ship", d: "Watch live logs. Start, stop, restart from a beautiful dashboard." },
  ];
  return (
    <section className="py-20 border-y border-border/40 bg-card/30">
      <div className="container-app">
        <h2 className="mb-10">How it works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="space-y-2">
              <div className="text-xs font-mono text-primary">{s.n}</div>
              <h3 className="text-base font-semibold">{s.t}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingTeaser() {
  const tiers = [
    { name: "Free", price: "₹0", note: "1 deployment · community support", cta: "Get started" },
    {
      name: "Pro",
      price: "₹499",
      note: "10 deployments · priority support · custom domains",
      cta: "Go Pro",
      featured: true,
    },
    {
      name: "Team",
      price: "₹1,999",
      note: "Unlimited · team seats · dedicated resources",
      cta: "Contact us",
    },
  ];
  return (
    <section className="py-20">
      <div className="container-app">
        <div className="text-center max-w-lg mx-auto mb-10">
          <h2>Simple pricing</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start free. Upgrade when you're ready.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`glass-card p-6 relative ${t.featured ? "border-primary/50 shadow-[var(--shadow-glow)]" : ""}`}
            >
              {t.featured && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-sm font-semibold">{t.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-bold">{t.price}</span>
                <span className="text-xs text-muted-foreground">/month</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground min-h-8">{t.note}</p>
              <Button
                asChild
                className="mt-5 w-full h-9 text-xs"
                variant={t.featured ? "default" : "outline"}
              >
                <Link to="/auth">{t.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReferralBanner() {
  return (
    <section className="pb-24">
      <div className="container-app">
        <div
          className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ background: "var(--gradient-primary)", borderColor: "transparent" }}
        >
          <div>
            <h3 className="text-lg font-semibold text-white">Earn 30% recurring commission</h3>
            <p className="text-xs text-white/80 mt-1">
              Refer friends. When they buy a plan, 30% of every payment lands in your wallet.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="h-10 text-xs whitespace-nowrap">
            <Link to="/auth">Join the program</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
