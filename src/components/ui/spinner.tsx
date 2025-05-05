import { cn } from "@/lib/utils";

export function Spinner({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-spin rounded-full border-4 border-muted border-t-foreground", className)} {...props} />
  );
}
