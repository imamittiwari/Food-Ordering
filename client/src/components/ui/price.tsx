import { cn } from "@/lib/utils";

interface PriceProps {
  value: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Price({ value, className, size = "md" }: PriceProps) {
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  }).format(value);
  
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };
  
  return (
    <span className={cn("font-medium text-primary", sizeClasses[size], className)}>
      {formattedPrice}
    </span>
  );
}
