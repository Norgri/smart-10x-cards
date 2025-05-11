import { cn } from "@/lib/utils";

type SpinnerProps = React.HTMLAttributes<HTMLDivElement>;

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-current border-t-transparent text-primary", className)}
      {...props}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
