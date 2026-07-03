import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";
import { Mail, MessageCircle, Twitter } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — EliteHosting" },
      { name: "description", content: "Get in touch with the EliteHosting team. Support, sales, and partnerships." },
      { property: "og:title", content: "Contact — EliteHosting" },
      { property: "og:description", content: "Reach the EliteHosting team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-app py-16 max-w-2xl">
        <h1>Get in touch</h1>
        <p className="mt-2 text-sm text-muted-foreground">We usually reply within 24 hours.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <a href="mailto:support@elitehosting.app" className="glass-card p-5 hover:border-primary/40 transition-colors">
            <Mail className="h-4 w-4 text-primary mb-2" />
            <h3 className="text-sm font-semibold">Email support</h3>
            <p className="text-xs text-muted-foreground mt-1">support@elitehosting.app</p>
          </a>
          <a href="#" className="glass-card p-5 hover:border-primary/40 transition-colors">
            <MessageCircle className="h-4 w-4 text-primary mb-2" />
            <h3 className="text-sm font-semibold">Live chat</h3>
            <p className="text-xs text-muted-foreground mt-1">Available inside your dashboard</p>
          </a>
          <a href="#" className="glass-card p-5 hover:border-primary/40 transition-colors">
            <Twitter className="h-4 w-4 text-primary mb-2" />
            <h3 className="text-sm font-semibold">Twitter</h3>
            <p className="text-xs text-muted-foreground mt-1">@elitehosting</p>
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
