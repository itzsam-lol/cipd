// Lenis disabled — relying on native CSS smooth-scroll for compatibility
// (Lenis intercepts wheel and uses an internal animated translate that
// breaks programmatic window.scrollTo and screenshot tooling.)
export default function SmoothScroll() {
  return null;
}
