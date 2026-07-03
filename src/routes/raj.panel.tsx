import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Users, Rocket, Ban, DollarSign, MessageSquare, Send, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/raj/panel")({
  head: () => ({ meta: [{ title: "Admin Panel" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminPanel,
});

function AdminPanel() {
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);
  const [tab, setTab] = useState<"users" | "deploys" | "chats">("users");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("eh_admin_ok") !== "1") {
      navigate({ to: "/raj" });
      return;
    }
    setOk(true);
  }, [navigate]);

  if (!ok) return null;

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="container-app py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3 w-3 inline" /> Exit</Link>
            <span className="text-sm font-semibold">Admin Panel</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-destructive/15 text-destructive border border-destructive/30">RESTRICTED</span>
        </div>
        <div className="container-app flex gap-1 pb-2">
          {(["users","deploys","chats"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs px-3 py-1.5 rounded-md capitalize ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </header>
      <main className="container-app py-6">
        {tab === "users" && <UsersPanel />}
        {tab === "deploys" && <DeploysPanel />}
        {tab === "chats" && <ChatsPanel />}
      </main>
    </div>
  );
}

function UsersPanel() {
  const [users, setUsers] = useState<{ id: string; email: string | null; full_name: string | null; is_banned: boolean; referral_code: string }[]>([]);
  const [wallets, setWallets] = useState<Record<string, number>>({});
  const load = async () => {
    const { data: p } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(200);
    const { data: w } = await supabase.from("wallets").select("*");
    setUsers(p ?? []);
    const wm: Record<string, number> = {};
    (w ?? []).forEach(x => wm[x.user_id] = Number(x.balance_inr));
    setWallets(wm);
  };
  useEffect(() => { load(); }, []);

  const ban = async (id: string, banned: boolean) => {
    const { error } = await supabase.from("profiles").update({ is_banned: !banned }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(banned ? "Unbanned" : "Banned");
    load();
  };

  const adjustBalance = async (id: string, delta: number) => {
    const current = wallets[id] ?? 0;
    const next = Math.max(0, current + delta);
    const { error } = await supabase.from("wallets").upsert({ user_id: id, balance_inr: next, updated_at: new Date().toISOString() });
    if (error) return toast.error(error.message);
    await supabase.from("wallet_transactions").insert({
      user_id: id, amount: Math.abs(delta), type: delta > 0 ? "credit" : "debit", reason: "admin_adjustment",
    });
    toast.success("Balance updated");
    load();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /><h2 className="text-sm font-semibold">Users ({users.length})</h2></div>
      <div className="glass-card divide-y divide-border">
        {users.map(u => (
          <div key={u.id} className="p-4 flex flex-wrap items-center gap-3 justify-between">
            <div className="min-w-0">
              <div className="text-sm font-medium">{u.full_name ?? "Unnamed"} {u.is_banned && <span className="text-[10px] text-destructive ml-1">BANNED</span>}</div>
              <div className="text-[11px] text-muted-foreground">{u.email} · code: {u.referral_code}</div>
              <div className="text-[11px] text-muted-foreground">Balance: ₹{(wallets[u.id] ?? 0).toFixed(2)}</div>
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => {
                const v = prompt("Amount to add/remove (negative for debit)");
                if (v) adjustBalance(u.id, Number(v));
              }}><DollarSign className="h-3 w-3" /></Button>
              <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={() => ban(u.id, u.is_banned)}>
                <Ban className="h-3 w-3" /> {u.is_banned ? "Unban" : "Ban"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeploysPanel() {
  const [deps, setDeps] = useState<{ id: string; user_id: string; name: string; repo_url: string | null; status: string; source_type: string; is_banned: boolean }[]>([]);
  const load = async () => {
    const { data } = await supabase.from("deployments").select("*").order("updated_at", { ascending: false }).limit(200);
    setDeps(data ?? []);
  };
  useEffect(() => { load(); }, []);
  const ban = async (id: string, banned: boolean) => {
    await supabase.from("deployments").update({ is_banned: !banned, status: !banned ? "stopped" : "queued" }).eq("id", id);
    toast.success("Updated"); load();
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><Rocket className="h-4 w-4 text-primary" /><h2 className="text-sm font-semibold">All deployments ({deps.length})</h2></div>
      <div className="glass-card divide-y divide-border">
        {deps.map(d => (
          <div key={d.id} className="p-4 flex flex-wrap items-center gap-3 justify-between">
            <div className="min-w-0">
              <div className="text-sm font-medium">{d.name} <span className="text-[10px] text-muted-foreground">[{d.status}]</span></div>
              <div className="text-[11px] text-muted-foreground truncate">{d.source_type}: {d.repo_url ?? "ZIP"}</div>
              <div className="text-[10px] text-muted-foreground font-mono">owner: {d.user_id.slice(0,8)}</div>
            </div>
            <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={() => ban(d.id, d.is_banned)}>
              <Ban className="h-3 w-3" /> {d.is_banned ? "Unban" : "Ban"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatsPanel() {
  const [threads, setThreads] = useState<{ user_id: string; last: string; unread: number }[]>([]);
  const [openUser, setOpenUser] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<{ id: string; message: string; sender: string; created_at: string }[]>([]);
  const [reply, setReply] = useState("");

  const load = async () => {
    const { data } = await supabase.from("chats").select("*").order("created_at", { ascending: false }).limit(500);
    const grouped: Record<string, { user_id: string; last: string; unread: number }> = {};
    (data ?? []).forEach(c => {
      if (!grouped[c.user_id]) grouped[c.user_id] = { user_id: c.user_id, last: c.message, unread: 0 };
      if (!c.read && c.sender === "user") grouped[c.user_id].unread++;
    });
    setThreads(Object.values(grouped));
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!openUser) return;
    (async () => {
      const { data } = await supabase.from("chats").select("*").eq("user_id", openUser).order("created_at", { ascending: true });
      setMsgs(data ?? []);
    })();
  }, [openUser]);

  const send = async () => {
    if (!reply.trim() || !openUser) return;
    const { error } = await supabase.from("chats").insert({ user_id: openUser, message: reply, sender: "admin" });
    if (error) return toast.error(error.message);
    setReply("");
    const { data } = await supabase.from("chats").select("*").eq("user_id", openUser).order("created_at", { ascending: true });
    setMsgs(data ?? []);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /><h2 className="text-sm font-semibold">Chats ({threads.length})</h2></div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="glass-card divide-y divide-border max-h-[70vh] overflow-auto">
          {threads.map(t => (
            <button key={t.user_id} onClick={() => setOpenUser(t.user_id)}
              className={`w-full text-left p-3 hover:bg-muted/50 ${openUser === t.user_id ? "bg-muted/70" : ""}`}>
              <div className="text-xs font-mono text-muted-foreground">{t.user_id.slice(0, 12)}</div>
              <div className="text-xs mt-1 truncate">{t.last}</div>
              {t.unread > 0 && <span className="text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 mt-1 inline-block">{t.unread} new</span>}
            </button>
          ))}
        </div>
        <div className="glass-card flex flex-col h-[70vh]">
          {!openUser ? (
            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">Select a thread</div>
          ) : (
            <>
              <div className="flex-1 overflow-auto p-4 space-y-2">
                {msgs.map(m => (
                  <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] text-xs px-3 py-2 rounded-lg ${m.sender === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {m.message}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t border-border flex gap-2">
                <Input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply as admin..." className="h-9 text-xs" />
                <Button type="submit" size="sm" className="h-9 px-3"><Send className="h-3.5 w-3.5" /></Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
