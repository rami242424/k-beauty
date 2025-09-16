type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: "neutral" | "brand" | "outline";
};

export default function Badge({
  children,
  className = "",
  variant = "neutral",
}: Props) {
  const base =
    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium";

  const styles =
    variant === "brand"
      ? "bg-brand/10 text-brand-600"
      : variant === "outline"
      ? "border border-brand/40 text-brand-600"
      : "bg-gray-100 text-gray-700";

  return <span className={`${base} ${styles} ${className}`}>{children}</span>;
}
