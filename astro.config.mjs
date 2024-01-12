import { defineConfig } from 'astro/config';
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  base: "/skydrop/",
  site: "https://nkte8.github.io/skydrop",
  server: {
    port: 4321,
    host: true
  },
  integrations: [react(), tailwind()]
});