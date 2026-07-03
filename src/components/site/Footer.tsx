import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="container-app py-12 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 text-xs text-muted-foreground max-w-xs">
            Deploy your code from GitHub or a ZIP in seconds. Skip the DevOps, ship the product.
          </p>
        </div>
        <FooterCol
          title="Product"
          links={[
            ["/pricing", "Pricing"],
            ["/docs", "Docs"],
            ["/blogs", "Blogs"],
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            ["/terms", "Terms & Conditions"],
            ["/privacy", "Privacy Policy"],
            ["/contact", "Contact"],
          ]}
        />
        <FooterCol
          title="Account"
          links={[
            ["/auth", "Log in"],
            ["/auth", "Sign up"],
          ]}
        />
      </div>
      <div className="border-t border-border/60">
        <div className="container-app py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} EliteHosting. All rights reserved.
          </p>
          <p className="text-[11px] text-muted-foreground">Built for developers who ship.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map(([to, label]) => (
          <li key={to + label}>
            <Link
              to={to}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
