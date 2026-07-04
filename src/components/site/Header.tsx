import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { to: "/pricing", label: "Pricing" },
  { to: "/blogs", label: "Blogs" },
  { to: "/docs", label: "Docs" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl bg-background/70">
      <div className="container-app flex h-14 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <Link
            to="/pricing"
            className="hidden sm:inline-flex text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/auth"
            className="hidden sm:inline-flex text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 transition-colors"
          >
            Log in
          </Link>
          <Button asChild size="sm" variant="default" className="h-8 text-xs">
            <Link to="/auth">Get started</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-border/60">
              <SheetTitle className="text-sm">Navigation</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="text-sm py-2.5 px-3 rounded-md hover:bg-muted transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 pt-6 border-t border-border/60 flex flex-col gap-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button asChild size="sm" className="w-full">
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    Get started
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
