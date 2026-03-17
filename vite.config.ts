import { resolve } from "path";
import fs from "node:fs";
import { defineConfig, type UserConfig } from "vite";
import { fontless } from "fontless";
import tailwindcss from "@tailwindcss/vite";
import kirby from "vite-plugin-kirby";

export default defineConfig(({ mode }) => {
  return {
    root: "src",

    base: mode === "development" ? "/" : "/dist/",

    build: {
      outDir: resolve(process.cwd(), "public/dist"),
      emptyOutDir: true,
      rollupOptions: {
        input: [
          // "index.ts", "styles/index.css"
          resolve(process.cwd(), "src/index.ts"),
          resolve(process.cwd(), "src/styles/index.css"),
          ...(fs.existsSync(resolve(process.cwd(), "src/styles/templates"))
            ? fs
                .readdirSync(resolve(process.cwd(), "src/styles/templates"))
                .filter((file) => file.endsWith(".css"))
                .map((file) => resolve(process.cwd(), "src/styles/templates", file))
            : []),
        ],
      },
    },

    resolve: {
      alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
    },

    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,

      // 1. Let DDEV handle the SSL. Vite runs on HTTP internally.
      // https: false as any,

      // 2. THIS IS THE FIX FOR THE .dev FILE:
      // It forces the plugin to write "https://site.ddev.site:5173"
      origin: `${process.env.DDEV_PRIMARY_URL}:5173`,

      // 3. Simple, permissive CORS for local dev
      cors: true,

      // 4. Force Vite's websocket to connect securely through DDEV's router
      hmr: {
        host: `${process.env.DDEV_SITENAME}.ddev.site`, // resolves to "site.ddev.site"
        protocol: "wss",
      },
    },

    plugins: [
      fontless({
        families: [
          {
            name: "Codec Pro",
            src: [
              {
                url: "/assets/fonts/CodecProVariableGX.ttf",
                format: "truetype-variations",
              },
            ],
            weight: "38 682",
          },
        ],
        defaults: {
          preload: true,
          subsets: ["latin-extended"],
          formats: ["woff2", "ttf"],
        },
      }),
      tailwindcss(),
      kirby({
        watch: [
          "../site/(templates|snippets|controllers|models|layouts)/**/*.php",
          "../content/**/*",
        ],
        kirbyConfigDir: "site/config",
      }),
    ],
  } satisfies UserConfig;
});
