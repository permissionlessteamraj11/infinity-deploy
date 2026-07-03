import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Lock } from "lucide-react";

// Hardcoded admin credentials (client-side gate + role check in DB)
const ADMIN_USERNAME = "rajpapa";
const ADMIN_PASSWORD = "28@RajPapa";
const BAN_KEY = "eh_admin_banned";
const ATTEMPTS_KEY = "eh_admin_attempts";
const FP_KEY = "eh_admin_fp";

function getFingerprint(): string {
  let fp = localStorage.getItem(FP_KEY);
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem(FP_KEY, fp);
  }
  return fp;
}

export const Route = createFileRoute("/raj")({
  head: () => ({ meta: [{ title: "Access" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [banned, setBanned] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    getFingerprint();
    setBanned(localStorage.getItem(BAN_KEY) === "1");
    setAttempts(Number(localStorage.getItem(ATTEMPTS_KEY) ?? 0));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (banned) return;
    setLoading(true);
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem(ATTEMPTS_KEY, "0");
      sessionStorage.setItem("eh_admin_ok", "1");
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" }).then(async ({ data }) => {
          if (!data) {
            // Grant admin role via a one-time INSERT (RLS on user_roles requires service role; we allow via edge case)
            // If insert fails, admin can still be granted manually via DB
            await supabase.from("user_roles").insert({ user_id: u.user!.id, role: "admin" });
          }
        });
      }
      toast.success("Access granted");
      navigate({ to: "/raj/panel" });
    } else {
      const next = attempts + 1;
      setAttempts(next);
      localStorage.setItem(ATTEMPTS_KEY, String(next));
      if (next >= 3) {
        localStorage.setItem(BAN_KEY, "1");
        setBanned(true);
        toast.error("Device banned after 3 failed attempts");
      } else {
        toast.error(`Invalid credentials. ${3 - next} attempts left.`);
      }
    }
    setLoading(false);
  };

  if (banned) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card p-8 max-w-sm text-center">
          <Lock className="h-8 w-8 text-destructive mx-auto mb-3" />
          <h1 className="text-lg font-semibold">Device banned</h1>
          <p className="text-xs text-muted-foreground mt-2">Too many failed attempts. This device is permanently locked out.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="glass-card p-8 max-w-sm w-full space-y-4">
        <div className="text-center">
          <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
          <h1 className="text-lg font-semibold">Restricted area</h1>
          <p className="text-xs text-muted-foreground mt-1">Attempts remaining: {3 - attempts}</p>
        </div>
        <div><Label className="text-xs">Username</Label><Input value={username} onChange={(e) => setUsername(e.target.value)} className="h-9 text-xs mt-1" autoComplete="off" /></div>
        <div><Label className="text-xs">Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-9 text-xs mt-1" /></div>
        <Button type="submit" disabled={loading} className="w-full h-9 text-xs">{loading ? "Verifying..." : "Access panel"}</Button>
      </form>
    </div>
  );
}
