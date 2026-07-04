import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — EliteHosting" },
      {
        name: "description",
        content: "Terms and conditions for using EliteHosting. Please read our service agreement.",
      },
      { property: "og:title", content: "Terms & Conditions — EliteHosting" },
      { property: "og:description", content: "Service agreement for EliteHosting." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-app py-16 max-w-3xl">
        <h1>Terms & Conditions</h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <div className="mt-8 prose prose-invert prose-sm max-w-none space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-foreground text-lg mt-6">1. Acceptance of Terms</h2>
            <p>
              By accessing or using EliteHosting, you agree to be bound by these Terms. If you do
              not agree, do not use the service.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-lg mt-6">2. Service Description</h2>
            <p>
              EliteHosting is a Platform-as-a-Service that allows users to deploy code from GitHub
              repositories or ZIP archives to managed runtime environments.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-lg mt-6">3. Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your credentials and for
              all activity under your account. You must not use the service for illegal, harmful, or
              abusive purposes.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-lg mt-6">4. Acceptable Use</h2>
            <p>
              You may not deploy malware, spam infrastructure, crypto miners, DDoS tools, or any
              content that violates applicable laws. We may suspend deployments that violate these
              rules.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-lg mt-6">5. Billing & Refunds</h2>
            <p>
              Paid plans are billed monthly. Refunds are considered on a case-by-case basis within 7
              days of purchase.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-lg mt-6">6. Referral Program</h2>
            <p>
              Referrers earn 30% commission on qualifying plan purchases by referred users.
              Commissions credit to your EliteHosting wallet. Fraudulent referrals will be voided.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-lg mt-6">7. Termination</h2>
            <p>
              We may suspend or terminate accounts that violate these Terms. You may cancel at any
              time from settings.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-lg mt-6">8. Limitation of Liability</h2>
            <p>
              The service is provided "as is". We are not liable for indirect, incidental, or
              consequential damages.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-lg mt-6">9. Contact</h2>
            <p>Questions? Reach us at support@elitehosting.app</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
