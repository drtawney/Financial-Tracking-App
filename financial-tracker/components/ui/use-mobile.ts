/**
 * financial-tracker/components/ui/use-mobile.ts
 *
 * React hook to determine if the viewport is mobile-sized.
 */
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * useIsMobile
 *
 * React hook to determine if the viewport is mobile-sized.
 * @returns True if the viewport width is less than the mobile breakpoint
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
