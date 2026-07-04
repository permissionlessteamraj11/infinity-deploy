import { Link } from "@tanstack/react-router";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        src="/logo.webp"
        alt="EliteHosting Logo"
        className={`${sizes[size]} w-auto object-contain`}
      />
    </Link>
  );
}
