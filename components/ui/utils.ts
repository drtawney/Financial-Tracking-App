/**
 * components/ui/utils.ts
 *
 * Utility function for merging Tailwind CSS class names with clsx and tailwind-merge.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn
 *
 * Merges class names using clsx and tailwind-merge to handle Tailwind CSS class conflicts.
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
