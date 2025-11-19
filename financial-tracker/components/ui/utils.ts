/**
 * financial-tracker/components/ui/utils.ts
 *
 * Utility functions for class name merging and Tailwind CSS integration.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn
 *
 * Merges class names using clsx and tailwind-merge.
 * @param inputs - List of class values
 * @returns Merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
