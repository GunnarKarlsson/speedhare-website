import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { sitemapPlugin } from "./vite.sitemap";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.API_PROXY_TARGET || "http://127.0.0.1:80";

  return {
    plugins: [react(), sitemapPlugin(env)],
    test: {
      environment: "node",
      include: ["src/**/*.test.ts"],
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
