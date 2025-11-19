/**
 * components/ui/collapsible.tsx
 *
 * Collapsible component using Radix UI primitives.
 */
"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible@1.1.3";

/**
 * Collapsible
 *
 * Root collapsible container.
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
