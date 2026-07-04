import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — EliteHosting" },
      {
        name: "description",
        content:
          "Privacy policy for EliteHosting. Learn how we collect, use, and protect your data.",
      },
      { property: "og:title", content: "Privacy Policy — EliteHosting" },
      { property: "og:description", content: "How EliteHosting handles your data." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-app py-16 max-w-3xl">
        <h1>Privacy Policy</h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <div className="mt-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-foreground text-lg mt-6">1. Data We Collect</h2>
            <p>
              Account data (email, name), deployment metadata (repo URLs, build commands),
              environment variables (encrypted), and runtime logs.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-lg mt-6">2. How We Use Your Data</h2>
            <p>
              To operate the platform, provide support, prevent abuse, and communicate service
              updates. We do not sell your data.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-lg mt-6">3. Environment Variables</h2>
            <p>
              Your env vars are encrypted at rest and injected into your deployment runtime only.
              They are never exposed in logs or the UI in plain text.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-lg mt-6">4. GitHub Access</h2>
            <p>
              If you connect GitHub, we store an access token to clone your repos. You can revoke
              access from settings at any time.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-lg mt-6">5. Data Retention</h2>
            <p>
              Deployment logs are retained per your plan. Deleted deployments and their env vars are
              purged within 30 days.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-lg mt-6">6. Your Rights</h2>
            <p>
              You can request account deletion at any time from settings. We honor GDPR data-access
              and deletion requests.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-lg mt-6">7. Contact</h2>
            <p>Privacy questions? Email privacy@elitehosting.app</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
