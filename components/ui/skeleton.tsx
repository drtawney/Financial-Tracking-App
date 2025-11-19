/**
 * components/ui/skeleton.tsx
 *
 * Skeleton component for placeholder loading states.
 */
import { cn } from "./utils";

/**
 * Skeleton
 *
 * Animated placeholder element for loading states.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
