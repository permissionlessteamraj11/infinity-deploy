import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNav } from "@/components/app/BottomNav";

export const Route = createFileRoute("/_authenticated/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="min-h-screen pb-20">
      <main className="container-app py-6 max-w-2xl">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
