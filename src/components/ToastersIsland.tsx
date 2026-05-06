import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

/**
 * Mounted exactly once per page (in each .astro layout/page) so the
 * `useToast` global store has a single visible UI surface.
 */
const ToastersIsland = () => (
  <>
    <Toaster />
    <Sonner />
  </>
);

export default ToastersIsland;
