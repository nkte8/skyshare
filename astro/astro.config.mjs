import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"
import cloudflare from "@astrojs/cloudflare"
import partytown from "@astrojs/partytown"
import { i18n } from "astro-i18n-aut/integration"

const defaultLocale = "ja"
const locales = {
    ja: "ja", // the `defaultLocale` value must present in `locales` keys
    en: "en",
}

// https://astro.build/config
/** @type {import('tailwindcss').Config} */
export default defineConfig({
    base: "/",
    site: "https://skyshare.uk/",
    server: {
        port: 4321,
        host: true,
    },
    integrations: [
        react(),
        tailwind(),
        partytown(),
        i18n({
            locales,
            defaultLocale,
        }),
    ],
    output: "hybrid",
    adapter: cloudflare(),
    trailingSlash: "always",
    build: {
        format: "directory",
    },
    routing: {
        prefixDefaultLocale: true,
    },
})

import { defineConfig } from "astro/config"
