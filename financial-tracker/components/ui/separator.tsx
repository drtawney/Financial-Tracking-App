/**
 * financial-tracker/components/ui/separator.tsx
 *
 * Separator component using Radix UI primitives for visual separation.
 */
"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "./utils";

/**
 * Separator
 *
 * Visual separator for dividing content.
 * @param className - Optional class name
 * @param orientation - Orientation of the separator (horizontal/vertical)
 * @param decorative - Whether the separator is decorative
 * @param props - Standard Radix Separator Root props
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
