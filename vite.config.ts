import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Custom plugin to exclude unwanted images during build
const excludeImagesPlugin = () => {
  return {
    name: "exclude-images",
    generateBundle(options: any, bundle: any) {
      // List of files to keep
      const keepFiles = [
        "matson-icon-qY7ypm7U.png",
        "hero-wedding-DuoSUXYL.jpg",
        "index-um8msJ26.css",
        "index-BZ0xK0Hf.js",
      ];

      // Remove unwanted image files from the bundle
      Object.keys(bundle).forEach((fileName) => {
        if (fileName.includes(".jpg") || fileName.includes(".png")) {
          const shouldKeep = keepFiles.some((keepFile) =>
            fileName.includes(
              keepFile.replace(/[-_][a-zA-Z0-9]+\.(jpg|png)/, ""),
            ),
          );
          if (!shouldKeep) {
            delete bundle[fileName];
          }
        }
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    excludeImagesPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": {},
    global: "globalThis",
  },
  esbuild: {
    minify: mode === "production",
    target: "es2015",
  },
  build: {
    sourcemap: true,
    target: "es2015",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React - keep these together and ensure they're bundled
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "react-vendor";
          }

          // Radix UI components
          if (id.includes("node_modules/@radix-ui")) {
            return "radix";
          }

          // Form handling
          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/@hookform/resolvers") ||
            id.includes("node_modules/zod")
          ) {
            return "form";
          }

          // Backend
          if (id.includes("node_modules/@supabase/supabase-js")) {
            return "supabase";
          }
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "query";
          }

          // UI libraries
          if (
            id.includes("node_modules/class-variance-authority") ||
            id.includes("node_modules/clsx") ||
            id.includes("node_modules/tailwind-merge")
          ) {
            return "ui-utils";
          }

          // Large chart libraries
          if (id.includes("node_modules/recharts")) {
            return "charts";
          }

          // Motion libraries
          if (id.includes("node_modules/framer-motion")) {
            return "motion";
          }

          // Vendor chunk for other dependencies
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-router-dom",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",
      "lucide-react",
      "sonner",
      "framer-motion",
      "react-hook-form",
      "@hookform/resolvers",
      "zod",
      "@supabase/supabase-js",
      "@tanstack/react-query",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    exclude: [
      // Only exclude very large dependencies that aren't needed initially
      "recharts",
      "embla-carousel-react",
      "vaul",
      "cmdk",
      "react-day-picker",
      "react-resizable-panels",
      "input-otp",
    ],
  },
}));
