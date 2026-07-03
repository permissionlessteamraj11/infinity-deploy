import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";

export const Route = createFileRoute("/blogs")({
  head: () => ({
    meta: [
      { title: "Blog — EliteHosting" },
      { name: "description", content: "Guides, tutorials, and product updates from the EliteHosting team." },
      { property: "og:title", content: "Blog — EliteHosting" },
      { property: "og:description", content: "Guides, tutorials, and product updates." },
    ],
  }),
  component: Blogs,
});

const posts = [
  { slug: "deploy-python-bot", title: "Deploy a Python Discord bot in under 60 seconds", date: "Jul 3, 2026", excerpt: "The fastest path from git push to running bot — no server setup, no Docker." },
  { slug: "zip-deploys", title: "ZIP deploys are here", date: "Jun 20, 2026", excerpt: "Drag a ZIP, we run it. Ideal for prototypes and one-file scripts." },
  { slug: "referral-launch", title: "Introducing our 30% referral program", date: "Jun 10, 2026", excerpt: "Recurring commission for every friend you bring in. Here's how it works." },
];

function Blogs() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-app py-16 max-w-3xl">
        <h1>Blog</h1>
        <p className="mt-2 text-sm text-muted-foreground">Guides, tutorials, and product updates.</p>
        <div className="mt-10 space-y-4">
          {posts.map((p) => (
            <article key={p.slug} className="glass-card p-5 hover:border-primary/40 transition-colors cursor-pointer">
              <div className="text-[11px] text-muted-foreground">{p.date}</div>
              <h2 className="text-base font-semibold mt-1">{p.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{p.excerpt}</p>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
