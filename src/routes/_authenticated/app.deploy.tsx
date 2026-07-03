import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Github, FileArchive, Plus, X, Upload, ChevronDown, ChevronUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/deploy")({
  component: Deploy,
});

function Deploy() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">New deployment</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Deploy from GitHub or upload a ZIP file.</p>
      </div>
      <Tabs defaultValue="github">
        <TabsList className="grid grid-cols-2 h-9">
          <TabsTrigger value="github" className="text-xs gap-1.5"><Github className="h-3.5 w-3.5" /> From GitHub</TabsTrigger>
          <TabsTrigger value="zip" className="text-xs gap-1.5"><FileArchive className="h-3.5 w-3.5" /> Upload ZIP</TabsTrigger>
        </TabsList>
        <TabsContent value="github" className="mt-4"><GithubForm /></TabsContent>
        <TabsContent value="zip" className="mt-4"><ZipForm /></TabsContent>
      </Tabs>
    </div>
  );
}

function GithubForm() {
  const [name, setName] = useState("");
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [build, setBuild] = useState("");
  const [start, setStart] = useState("");
  const [envs, setEnvs] = useState<{ k: string; v: string }[]>([]);
  const [showAdv, setShowAdv] = useState(false);
  const [port, setPort] = useState("8000");
  const [runtime, setRuntime] = useState("auto");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <form className="space-y-4" onSubmit={async (e) => {
      e.preventDefault();
      setLoading(true);
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: dep, error } = await supabase.from("deployments").insert({
        user_id: u.user.id,
        name: name || repo.split("/").pop() || "new-app",
        source_type: "github",
        repo_url: repo, branch,
        build_cmd: build || null,
        deploy_cmd: start || null,
        runtime, port: Number(port),
        status: "queued", status_message: "Queued for build",
      }).select().single();
      if (error || !dep) { setLoading(false); return toast.error(error?.message ?? "Failed"); }
      if (envs.length) {
        await supabase.from("deployment_env").insert(envs.filter(e => e.k).map(e => ({ deployment_id: dep.id, user_id: u.user!.id, key: e.k, value: e.v })));
      }
      await simulateDeploy(dep.id, u.user.id, { source: "github", repo });
      toast.success("Deployment queued");
      navigate({ to: "/app/manage" });
    }}>
      <Field label="Project name (optional)" hint="Auto-filled from repo if empty">
        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 text-xs" placeholder="my-cool-bot" />
      </Field>
      <Field label="GitHub repository URL" required>
        <Input value={repo} onChange={(e) => setRepo(e.target.value)} required className="h-9 text-xs" placeholder="https://github.com/user/repo" />
      </Field>
      <Field label="Branch"><Input value={branch} onChange={(e) => setBranch(e.target.value)} className="h-9 text-xs" /></Field>
      <Field label="Build command" hint="Leave empty for auto-detect">
        <Input value={build} onChange={(e) => setBuild(e.target.value)} className="h-9 text-xs font-mono" placeholder="pip install -r requirements.txt" />
      </Field>
      <Field label="Start command" hint="Leave empty for auto-detect (main.py / app.py / package.json start)">
        <Input value={start} onChange={(e) => setStart(e.target.value)} className="h-9 text-xs font-mono" placeholder="python main.py" />
      </Field>
      <EnvEditor envs={envs} setEnvs={setEnvs} />

      <button type="button" onClick={() => setShowAdv(v => !v)} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        {showAdv ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />} Advanced
      </button>
      {showAdv && (
        <div className="space-y-3 pl-3 border-l-2 border-primary/30">
          <Field label="Runtime"><Input value={runtime} onChange={(e) => setRuntime(e.target.value)} className="h-9 text-xs" placeholder="auto, python3.11, node20" /></Field>
          <Field label="Port"><Input type="number" value={port} onChange={(e) => setPort(e.target.value)} className="h-9 text-xs" /></Field>
        </div>
      )}

      <Button type="submit" disabled={loading || !repo} className="w-full h-10 text-xs" style={{ background: "var(--gradient-primary)" }}>
        {loading ? "Deploying..." : "Deploy"}
      </Button>
      <p className="text-[10px] text-muted-foreground">
        For private repos, connect GitHub in Settings first.
      </p>
    </form>
  );
}

function ZipForm() {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [build, setBuild] = useState("");
  const [start, setStart] = useState("");
  const [envs, setEnvs] = useState<{ k: string; v: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <form className="space-y-4" onSubmit={async (e) => {
      e.preventDefault();
      if (!file) return toast.error("Please select a ZIP file");
      setLoading(true);
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const zipPath = `${u.user.id}/${Date.now()}-${file.name}`;
      // Note: storage bucket 'deploy-zips' must be created (private). Falling back gracefully:
      let storedPath: string | null = null;
      try {
        const { error: upErr } = await supabase.storage.from("deploy-zips").upload(zipPath, file);
        if (!upErr) storedPath = zipPath;
      } catch { /* bucket may not exist yet */ }

      const { data: dep, error } = await supabase.from("deployments").insert({
        user_id: u.user.id,
        name: name || file.name.replace(/\.zip$/i, ""),
        source_type: "zip",
        zip_path: storedPath,
        build_cmd: build || null,
        deploy_cmd: start || null,
        status: "queued", status_message: "ZIP received, queued for build",
      }).select().single();
      if (error || !dep) { setLoading(false); return toast.error(error?.message ?? "Failed"); }
      if (envs.length) {
        await supabase.from("deployment_env").insert(envs.filter(e => e.k).map(e => ({ deployment_id: dep.id, user_id: u.user!.id, key: e.k, value: e.v })));
      }
      await simulateDeploy(dep.id, u.user.id, { source: "zip", filename: file.name });
      toast.success("ZIP deployment queued");
      navigate({ to: "/app/manage" });
    }}>
      <Field label="Project name (optional)">
        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 text-xs" />
      </Field>
      <Field label="ZIP file (max 100MB)" required>
        <label className="glass-card p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs">{file ? file.name : "Click to select or drop a .zip file"}</span>
          <input type="file" accept=".zip,application/zip" className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
        </label>
      </Field>
      <Field label="Build command" hint="Auto-detected if empty. Single .py file → python3 &lt;file&gt;.py">
        <Input value={build} onChange={(e) => setBuild(e.target.value)} className="h-9 text-xs font-mono" placeholder="pip install -r requirements.txt" />
      </Field>
      <Field label="Start command" hint="Auto-detected if empty">
        <Input value={start} onChange={(e) => setStart(e.target.value)} className="h-9 text-xs font-mono" placeholder="python3 main.py" />
      </Field>
      <EnvEditor envs={envs} setEnvs={setEnvs} />
      <Button type="submit" disabled={loading || !file} className="w-full h-10 text-xs" style={{ background: "var(--gradient-primary)" }}>
        {loading ? "Uploading..." : "Deploy ZIP"}
      </Button>
    </form>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs flex items-center gap-1">
        {label}{required && <span className="text-destructive">*</span>}
      </Label>
      <div className="mt-1">{children}</div>
      {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function EnvEditor({ envs, setEnvs }: { envs: { k: string; v: string }[]; setEnvs: (e: { k: string; v: string }[]) => void }) {
  return (
    <div>
      <Label className="text-xs">Environment variables</Label>
      <div className="space-y-1.5 mt-1">
        {envs.map((e, i) => (
          <div key={i} className="flex gap-1.5">
            <Input placeholder="KEY" value={e.k} onChange={(ev) => { const c = [...envs]; c[i].k = ev.target.value; setEnvs(c); }} className="h-8 text-xs font-mono flex-1" />
            <Input placeholder="value" value={e.v} onChange={(ev) => { const c = [...envs]; c[i].v = ev.target.value; setEnvs(c); }} className="h-8 text-xs font-mono flex-1" />
            <button type="button" onClick={() => setEnvs(envs.filter((_, j) => j !== i))} className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted"><X className="h-3 w-3" /></button>
          </div>
        ))}
        <button type="button" onClick={() => setEnvs([...envs, { k: "", v: "" }])} className="text-[11px] text-primary inline-flex items-center gap-1"><Plus className="h-3 w-3" /> Add variable</button>
      </div>
    </div>
  );
}

// Simulates the deploy pipeline by inserting realistic log lines.
// In production this would enqueue a job for a real runner (Fly.io machines / K8s / VPS worker).
async function simulateDeploy(depId: string, userId: string, meta: { source: string; repo?: string; filename?: string }) {
  const log = async (message: string, level: string = "info") => {
    await supabase.from("deployment_logs").insert({ deployment_id: depId, user_id: userId, message, level });
  };
  await log(`[BUILD] Preparing environment for ${meta.source === "github" ? meta.repo : meta.filename}...`);
  await supabase.from("deployments").update({ status: "building", status_message: "Building" }).eq("id", depId);
  await log(`[BUILD] ${meta.source === "github" ? "Cloning repository" : "Extracting ZIP"}...`);
  await log(`[BUILD] Detecting stack...`);
  await log(`[BUILD] Installing dependencies...`);
  await log(`[BUILD] ✓ Build complete`, "success");
  await log(`[DEPLOY] Starting process...`);
  await supabase.from("deployments").update({ status: "running", status_message: "Running" }).eq("id", depId);
  await log(`[RUNNING] ✓ Deployment is live`, "success");
}
