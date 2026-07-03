import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Play, Square, RotateCw, FileText, Trash2, Search, Rocket } from "lucide-react";

type Deployment = {
  id: string;
  name: string;
  source_type: string;
  status: string;
  status_message: string | null;
  repo_url: string | null;
  updated_at: string;
};

export const Route = createFileRoute("/_authenticated/app/manage")({
  component: Manage,
});

function Manage() {
  const [items, setItems] = useState<Deployment[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Deployment | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("deployments").select("*").order("updated_at", { ascending: false });
    setItems((data as Deployment[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const action = async (id: string, status: Deployment["status"], msg: string) => {
    const { error } = await supabase.from("deployments").update({ status, status_message: msg, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(msg);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this deployment?")) return;
    const { error } = await supabase.from("deployments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Manage</h1>
        <Button asChild size="sm" className="h-8 text-xs"><Link to="/app/deploy"><Rocket className="h-3 w-3 mr-1" /> New</Link></Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search deployments..." className="h-9 text-xs pl-8" />
      </div>

      {loading ? (
        <div className="glass-card p-8 text-center text-xs text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-8 text-center text-xs text-muted-foreground">
          No deployments yet. <Link to="/app/deploy" className="text-primary">Deploy your first project →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(d => (
            <div key={d.id} className="glass-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">{d.name}</span>
                    <StatusPill status={d.status} />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 truncate">
                    {d.source_type === "github" ? (d.repo_url ?? "GitHub repo") : "ZIP upload"}
                  </p>
                  {d.status_message && (
                    <p className="text-[11px] text-muted-foreground mt-1 truncate">{d.status_message}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 shrink-0">
                  {d.status !== "running" && (
                    <IconBtn label="Start" onClick={() => action(d.id, "running", "Started")}><Play className="h-3 w-3" /></IconBtn>
                  )}
                  {d.status === "running" && (
                    <IconBtn label="Stop" onClick={() => action(d.id, "stopped", "Stopped")}><Square className="h-3 w-3" /></IconBtn>
                  )}
                  <IconBtn label="Restart" onClick={() => action(d.id, "building", "Restarting...")}><RotateCw className="h-3 w-3" /></IconBtn>
                  <IconBtn label="Logs" onClick={() => setSelected(d)}><FileText className="h-3 w-3" /></IconBtn>
                  <IconBtn label="Delete" onClick={() => del(d.id)} destructive><Trash2 className="h-3 w-3" /></IconBtn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selected && <LogsDrawer deployment={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    running: "bg-success/15 text-success border-success/30",
    stopped: "bg-muted text-muted-foreground border-border",
    building: "bg-primary/15 text-primary border-primary/30 animate-pulse",
    queued: "bg-warning/15 text-warning border-warning/30",
    failed: "bg-destructive/15 text-destructive border-destructive/30",
    crashed: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return <span className={`text-[10px] px-1.5 py-0.5 rounded border ${map[status] ?? map.stopped}`}>{status}</span>;
}

function IconBtn({ children, onClick, label, destructive }: { children: React.ReactNode; onClick: () => void; label: string; destructive?: boolean }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`h-7 w-7 inline-flex items-center justify-center rounded-md border border-border hover:bg-muted transition-colors ${destructive ? "hover:text-destructive hover:border-destructive/40" : ""}`}
    >
      {children}
    </button>
  );
}

function LogsDrawer({ deployment, onClose }: { deployment: Deployment; onClose: () => void }) {
  const [logs, setLogs] = useState<{ id: string; level: string; message: string; created_at: string }[]>([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.from("deployment_logs").select("*").eq("deployment_id", deployment.id).order("created_at", { ascending: true }).limit(500);
      if (mounted) setLogs(data ?? []);
    })();
    const ch = supabase.channel("logs-" + deployment.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "deployment_logs", filter: `deployment_id=eq.${deployment.id}` },
        (payload) => setLogs((prev) => [...prev, payload.new as never]))
      .subscribe();
    return () => { mounted = false; supabase.removeChannel(ch); };
  }, [deployment.id]);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="glass-card w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">{deployment.name}</h3>
            <p className="text-[10px] text-muted-foreground">Live logs</p>
          </div>
          <button onClick={onClose} className="text-xs text-muted-foreground">Close</button>
        </div>
        <div className="flex-1 overflow-auto p-4 font-mono text-[11px] space-y-0.5">
          {logs.length === 0 ? (
            <p className="text-muted-foreground">Waiting for logs...</p>
          ) : logs.map(l => (
            <div key={l.id} className={l.level === "error" ? "text-destructive" : l.level === "success" ? "text-success" : "text-muted-foreground"}>
              <span className="text-[10px] opacity-60">{new Date(l.created_at).toLocaleTimeString()} </span>
              {l.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
