// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// STATIC_EXPORT=1 builds a fully prerendered static site (GitHub Pages) instead of the Cloudflare worker.
const staticExport = process.env.STATIC_EXPORT === "1";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(staticExport && {
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
      // SPA shell served by GitHub Pages as 404.html, so unknown URLs render the router's not-found view.
      spa: { enabled: true, maskPath: "/?shell", prerender: { outputPath: "/404" } },
    }),
  },
  ...(staticExport && { nitro: false as const }),
});
