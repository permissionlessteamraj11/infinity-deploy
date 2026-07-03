import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — EliteHosting" },
      {
        name: "description",
        content:
          "Simple, transparent pricing for EliteHosting. Free tier, Pro plan, and Team plan for developers deploying from GitHub or ZIP.",
      },
      { property: "og:title", content: "Pricing — EliteHosting" },
      {
        property: "og:description",
        content: "Free tier, Pro, and Team plans. Start free — upgrade when you're ready.",
      },
    ],
  }),
  component: Pricing,
});

const tiers = [
  {
    name: "Free",
    price: "₹0",
    features: [
      "1 active deployment",
      "512MB RAM",
      "Community support",
      "GitHub + ZIP deploys",
      "Basic logs (24h)",
    ],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "₹499",
    features: [
      "10 active deployments",
      "2GB RAM per app",
      "Priority email support",
      "Private repos",
      "Custom domains",
      "Log history (30 days)",
    ],
    cta: "Go Pro",
    featured: true,
  },
  {
    name: "Team",
    price: "₹1,999",
    features: [
      "Unlimited deployments",
      "8GB RAM per app",
      "Dedicated support",
      "Team seats (5)",
      "SSO",
      "Full log history",
    ],
    cta: "Contact us",
  },
];

function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-app py-16">
        <div className="text-center max-w-lg mx-auto mb-12">
          <h1>Simple, transparent pricing</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            All plans include unlimited builds, live logs, and start/stop controls.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`glass-card p-6 ${t.featured ? "border-primary/50 shadow-[var(--shadow-glow)]" : ""}`}
            >
              <h3 className="text-sm font-semibold">{t.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{t.price}</span>
                <span className="text-xs text-muted-foreground">/month</span>
              </div>
              <Button
                asChild
                className="mt-5 w-full h-9 text-xs"
                variant={t.featured ? "default" : "outline"}
              >
                <Link to="/auth">{t.cta}</Link>
              </Button>
              <ul className="mt-6 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs">
                    <Check className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
