/**
 * financial-tracker/components/ui/collapsible.tsx
 *
 * Collapsible component using Radix UI primitives.
 */
"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

/**
 * Collapsible
 *
 * Root collapsible container.
 * @param props - Standard Radix Collapsible Root props
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

/**
 * CollapsibleTrigger
 *
 * Button to toggle the collapsible content.
 * @param props - Standard Radix CollapsibleTrigger props
 */
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

/**
 * CollapsibleContent
 *
 * Content area that expands and collapses.
 * @param props - Standard Radix CollapsibleContent props
 */
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
