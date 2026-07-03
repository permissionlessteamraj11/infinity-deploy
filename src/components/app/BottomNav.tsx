import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Rocket, Sparkles, Settings } from "lucide-react";

const tabs = [
  { to: "/app/home", label: "Home", icon: Home },
  { to: "/app/manage", label: "Manage", icon: LayoutGrid },
  { to: "/app/deploy", label: "Deploy", icon: Rocket },
  { to: "/app/ai", label: "AI", icon: Sparkles },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      aria-label="App navigation"
      className="fixed bottom-0 inset-x-0 z-50 border-t border-border/60 bg-background/85 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto max-w-lg grid grid-cols-5">
        {tabs.map((t) => {
          const active = pathname.startsWith(t.to);
          const Icon = t.icon;
          return (
            <li key={t.to}>
              <Link
                to={t.to}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-[18px] w-[18px] ${active ? "" : ""}`} strokeWidth={active ? 2.5 : 2} />
                <span className={active ? "font-medium" : ""}>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
