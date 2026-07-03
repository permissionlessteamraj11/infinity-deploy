import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  User,
  MessageCircle,
  Gift,
  Wallet,
  CreditCard,
  Github,
  Key,
  LogOut,
  ChevronRight,
  Copy,
  Send,
  ArrowLeft,
} from "lucide-react";
import {
  getProfile,
  updateProfile,
  getChatsForUser,
  sendChatMessage,
  getUserDeployments,
  getReferralEarnings,
  getWallet,
  getCollection,
} from "@/lib/db-actions";

type Section = "menu" | "profile" | "chat" | "referral" | "wallet" | "billing" | "github" | "api";

export const Route = createFileRoute("/_authenticated/app/settings")({
  component: Settings,
});

function Settings() {
  const [section, setSection] = useState<Section>("menu");
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  if (section !== "menu") {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSection("menu")}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Settings
        </button>
        {section === "profile" && <ProfilePanel />}
        {section === "chat" && <ChatPanel />}
        {section === "referral" && <ReferralPanel />}
        {section === "wallet" && <WalletPanel />}
        {section === "billing" && <PlaceholderPanel title="Billing & Plans" />}
        {section === "github" && <PlaceholderPanel title="GitHub Connection" />}
        {section === "api" && <PlaceholderPanel title="API Keys" />}
      </div>
    );
  }

  const items: [Section, typeof User, string, string][] = [
    ["profile", User, "Profile", "Name, email, avatar"],
    ["chat", MessageCircle, "Chat with support", "Message our team"],
    ["referral", Gift, "Referral program", "Earn 30% recurring"],
    ["wallet", Wallet, "Wallet", "Balance & transactions"],
    ["billing", CreditCard, "Billing & Plans", "Manage subscription"],
    ["github", Github, "GitHub Connection", "Connect your account"],
    ["api", Key, "API Keys", "Personal tokens"],
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <div className="glass-card divide-y divide-border">
        {items.map(([key, Icon, label, hint]) => (
          <button
            key={key}
            onClick={() => setSection(key)}
            className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
          >
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{label}</div>
              <div className="text-[11px] text-muted-foreground">{hint}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
      <Button
        onClick={signOut}
        variant="outline"
        className="w-full h-10 text-xs text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="h-3.5 w-3.5 mr-2" /> Sign out
      </Button>
      <p className="text-center text-[10px] text-muted-foreground pt-2">EliteHosting v2.0</p>
    </div>
  );
}

function ProfilePanel() {
  const [profile, setProfile] = useState<{
    full_name: string | null;
    email: string | null;
  } | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const data = await getProfile(u.user.id);
      setProfile(data as Record<string, unknown>);
      setName(data?.full_name ?? "");
    })();
  }, []);

  const save = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    await updateProfile({ id: u.user.id, updates: { full_name: name } });
    toast.success("Profile updated");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Profile</h2>
      <div>
        <Label className="text-xs">Email</Label>
        <Input value={profile?.email ?? ""} disabled className="h-9 text-xs mt-1" />
      </div>
      <div>
        <Label className="text-xs">Full name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-9 text-xs mt-1"
        />
      </div>
      <Button onClick={save} size="sm" className="h-9 text-xs">
        Save changes
      </Button>
    </div>
  );
}

function ChatPanel() {
  const [msgs, setMsgs] = useState<
    { id: string; message: string; sender: string; created_at: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      if (mounted) setUserId(u.user.id);
      const data = (await getChatsForUser(u.user.id)) as Record<string, unknown>[];
      if (mounted) setMsgs(data ?? []);
    };

    load();
    const interval = setInterval(load, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const send = async () => {
    if (!input.trim() || !userId) return;
    await sendChatMessage({
      user_id: userId,
      message: input.trim(),
      sender: "user",
    });
    setInput("");
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Chat with support</h2>
      <div className="glass-card h-96 flex flex-col">
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {msgs.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">
              Say hi 👋 — we're here to help.
            </p>
          )}
          {msgs.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] text-xs px-3 py-2 rounded-lg ${m.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {m.message}
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="p-3 border-t border-border flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="h-9 text-xs"
          />
          <Button type="submit" size="sm" className="h-9 px-3">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function ReferralPanel() {
  const [code, setCode] = useState("");
  const [stats, setStats] = useState({ referred: 0, earned: 0 });

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const [profile, refs, earn] = await Promise.all([
        getProfile(u.user.id),
        getCollection("profiles").then((ps) =>
          (ps as Record<string, unknown>[]).filter((p) => p.referred_by === u.user.id),
        ),
        getReferralEarnings(u.user.id),
      ]);
      setCode((profile as Record<string, unknown>)?.referral_code ?? "");
      setStats({
        referred: refs?.length ?? 0,
        earned: (earn ?? []).reduce(
          (s: number, x: Record<string, unknown>) => s + Number(x.amount),
          0,
        ),
      });
    })();
  }, []);

  const link = typeof window !== "undefined" ? `${window.location.origin}/auth?ref=${code}` : "";
  const copy = (v: string) => {
    navigator.clipboard.writeText(v);
    toast.success("Copied");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Referral program</h2>
      <div
        className="glass-card p-5"
        style={{
          background: "var(--gradient-primary)",
          borderColor: "transparent",
        }}
      >
        <p className="text-xs text-white/80">
          Earn 30% recurring commission on every plan payment made by your referrals.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4">
          <div className="text-[11px] text-muted-foreground">Referred</div>
          <div className="text-xl font-semibold mt-1">{stats.referred}</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-[11px] text-muted-foreground">Earned</div>
          <div className="text-xl font-semibold mt-1">₹{stats.earned.toFixed(2)}</div>
        </div>
      </div>
      <div>
        <Label className="text-xs">Your code</Label>
        <div className="flex gap-2 mt-1">
          <Input value={code} readOnly className="h-9 text-xs font-mono" />
          <Button onClick={() => copy(code)} variant="outline" size="sm" className="h-9">
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div>
        <Label className="text-xs">Your link</Label>
        <div className="flex gap-2 mt-1">
          <Input value={link} readOnly className="h-9 text-xs" />
          <Button onClick={() => copy(link)} variant="outline" size="sm" className="h-9">
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function WalletPanel() {
  const [balance, setBalance] = useState(0);
  const [txs, setTxs] = useState<
    {
      id: string;
      amount: number;
      type: string;
      reason: string;
      created_at: string;
    }[]
  >([]);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const [wallet, transactions] = await Promise.all([
        getWallet(u.user.id),
        getCollection("wallet_transactions").then((ts) =>
          (ts as Record<string, unknown>[])
            .filter((t) => t.user_id === u.user.id)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 20),
        ),
      ]);
      setBalance(Number((wallet as Record<string, unknown>)?.balance_inr ?? 0));
      setTxs(transactions ?? []);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Wallet</h2>
      <div className="glass-card p-5">
        <div className="text-[11px] text-muted-foreground">Balance</div>
        <div className="text-3xl font-bold mt-1">₹{balance.toFixed(2)}</div>
        <Button size="sm" className="mt-4 h-9 text-xs" disabled={balance < 500}>
          Withdraw (min ₹500)
        </Button>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Recent transactions</h3>
        {txs.length === 0 ? (
          <div className="glass-card p-6 text-center text-xs text-muted-foreground">
            No transactions yet
          </div>
        ) : (
          <div className="glass-card divide-y divide-border">
            {txs.map((t) => (
              <div key={t.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium">{t.reason.replace(/_/g, " ")}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {new Date(t.created_at).toLocaleString()}
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold ${t.type === "credit" ? "text-success" : "text-destructive"}`}
                >
                  {t.type === "credit" ? "+" : "-"}₹{Number(t.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="glass-card p-8 text-center text-xs text-muted-foreground">
        Coming soon — this section is being built.
      </div>
    </div>
  );
}
