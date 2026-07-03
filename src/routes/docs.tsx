import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — EliteHosting" },
      { name: "description", content: "Learn how to deploy your code with EliteHosting: GitHub, ZIP, env vars, build commands." },
      { property: "og:title", content: "Documentation — EliteHosting" },
      { property: "og:description", content: "Full documentation for EliteHosting." },
    ],
  }),
  component: Docs,
});

function Docs() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-app py-16 max-w-3xl">
        <h1>Documentation</h1>
        <div className="mt-8 space-y-8 text-sm">
          <section>
            <h2 className="text-lg font-semibold">Getting started</h2>
            <p className="mt-2 text-muted-foreground">Sign up, land on your dashboard, hit Deploy, pick a source — GitHub repo or ZIP upload — and click Deploy.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold">Auto-detection</h2>
            <p className="mt-2 text-muted-foreground">Leave build/deploy commands blank and we detect based on files:</p>
            <ul className="mt-2 space-y-1 text-muted-foreground list-disc pl-5">
              <li><code className="text-xs bg-muted px-1.5 py-0.5 rounded">requirements.txt</code> → <code className="text-xs">pip install -r requirements.txt</code> + <code className="text-xs">python3 main.py</code></li>
              <li><code className="text-xs bg-muted px-1.5 py-0.5 rounded">package.json</code> → <code className="text-xs">npm install</code> + <code className="text-xs">npm start</code></li>
              <li>Single <code className="text-xs">.py</code> in a ZIP → <code className="text-xs">python3 &lt;file&gt;.py</code></li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold">Environment variables</h2>
            <p className="mt-2 text-muted-foreground">Add key/value pairs in the Deploy wizard, or import a <code className="text-xs">.env</code> file. Values are encrypted at rest and injected into your process at runtime.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold">Managing deployments</h2>
            <p className="mt-2 text-muted-foreground">Manage tab shows every deployment. Start, stop, restart, view logs, or delete — all from the row actions.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
