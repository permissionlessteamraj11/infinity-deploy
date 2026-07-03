import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Rocket, Wallet, Activity, Gift, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/home")({
  component: Home,
});

function Home() {
  const [stats, setStats] = useState({ deployments: 0, running: 0, balance: 0, earnings: 0, name: "" });

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const [{ data: d }, { data: r }, { data: w }, { data: e }, { data: p }] = await Promise.all([
        supabase.from("deployments").select("id", { count: "exact" }).eq("user_id", u.user.id),
        supabase.from("deployments").select("id", { count: "exact" }).eq("user_id", u.user.id).eq("status", "running"),
        supabase.from("wallets").select("balance_inr").eq("user_id", u.user.id).maybeSingle(),
        supabase.from("referral_earnings").select("amount").eq("referrer_id", u.user.id),
        supabase.from("profiles").select("full_name").eq("id", u.user.id).maybeSingle(),
      ]);
      setStats({
        deployments: d?.length ?? 0,
        running: r?.length ?? 0,
        balance: Number(w?.balance_inr ?? 0),
        earnings: (e ?? []).reduce((s, x) => s + Number(x.amount), 0),
        name: p?.full_name ?? "",
      });
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground">Welcome back</p>
        <h1 className="text-xl font-semibold mt-0.5">{stats.name || "Hey there"} 👋</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Activity} label="Running" value={stats.running.toString()} accent="text-success" />
        <StatCard icon={Rocket} label="Total deploys" value={stats.deployments.toString()} accent="text-primary" />
        <StatCard icon={Wallet} label="Wallet" value={`₹${stats.balance.toFixed(2)}`} accent="text-warning" />
        <StatCard icon={Gift} label="Referral earned" value={`₹${stats.earnings.toFixed(2)}`} accent="text-primary" />
      </div>

      <div className="glass-card p-5 flex items-center justify-between gap-3"
        style={{ background: "var(--gradient-primary)", borderColor: "transparent" }}>
        <div>
          <h3 className="text-sm font-semibold text-white">Deploy something new</h3>
          <p className="text-xs text-white/80 mt-0.5">GitHub, ZIP, or a single Python file.</p>
        </div>
        <Button asChild variant="secondary" size="sm" className="h-9 text-xs shrink-0">
          <Link to="/app/deploy">Deploy <ArrowRight className="ml-1 h-3 w-3" /></Link>
        </Button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Recent activity</h2>
          <Link to="/app/manage" className="text-[11px] text-primary">View all</Link>
        </div>
        <div className="glass-card p-4 text-xs text-muted-foreground text-center py-8">
          Your deployments will appear here.
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: typeof Rocket; label: string; value: string; accent: string }) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${accent}`} />
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
      <div className="text-xl font-semibold mt-2">{value}</div>
    </div>
  );
}
