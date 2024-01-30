import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  base: "/",
  site: "https://bskylinx.com/",
  trailingSlash: "always",
  server: {
    port: 4321,
    host: true
  },
  integrations: [react(), tailwind()],
  output: "hybrid",
  adapter: cloudflare()
});