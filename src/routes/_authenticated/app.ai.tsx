import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/ai")({
  component: AiTab,
});

function AiTab() {
  const [email, setEmail] = useState("");
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div
        className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Sparkles className="h-7 w-7 text-white" />
      </div>
      <h1 className="text-2xl font-semibold">AI Assistant</h1>
      <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">Coming soon</p>
      <p className="text-sm text-muted-foreground mt-4 max-w-sm">
        We're building an AI agent that will debug your deploys, suggest fixes, and generate code —
        right inside your dashboard.
      </p>
      <form
        className="mt-6 flex gap-2 w-full max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("We'll notify you when it launches");
          setEmail("");
        }}
      >
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="you@example.com"
          className="h-9 text-xs"
        />
        <Button type="submit" size="sm" className="h-9 text-xs gap-1">
          <Bell className="h-3 w-3" /> Notify me
        </Button>
      </form>
    </div>
  );
}
