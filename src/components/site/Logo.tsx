import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-lg" };
  const iconSizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };
  return (
    <Link to="/" className="flex items-center gap-1.5 font-semibold tracking-tight">
      <Zap className={`${iconSizes[size]} fill-primary text-primary`} strokeWidth={0} />
      <span className={sizes[size]}>elitehosting</span>
    </Link>
  );
}
