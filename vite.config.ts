import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Custom plugin to exclude unwanted images during build
const excludeImagesPlugin = () => {
  return {
    name: 'exclude-images',
    generateBundle(options: any, bundle: any) {
      // List of files to keep
      const keepFiles = [
        'matson-icon-qY7ypm7U.png',
        'hero-wedding-DuoSUXYL.jpg',
        'index-um8msJ26.css',
        'index-BZ0xK0Hf.js'
      ];
      
      // Remove unwanted image files from the bundle
      Object.keys(bundle).forEach(fileName => {
        if (fileName.includes('.jpg') || fileName.includes('.png')) {
          const shouldKeep = keepFiles.some(keepFile => fileName.includes(keepFile.replace(/[-_][a-zA-Z0-9]+\.(jpg|png)/, '')));
          if (!shouldKeep) {
            delete bundle[fileName];
          }
        }
      });
    }
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
    mode === 'development' && componentTagger(),
    excludeImagesPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          
          // Router
          if (id.includes('node_modules/react-router-dom')) {
            return 'router';
          }
          
          // Form handling
          if (id.includes('node_modules/react-hook-form') || 
              id.includes('node_modules/@hookform/resolvers') || 
              id.includes('node_modules/zod')) {
            return 'form';
          }
          
          // Backend
          if (id.includes('node_modules/@supabase/supabase-js')) {
            return 'supabase';
          }
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'query';
          }
          
          // Utilities
          if (id.includes('node_modules/clsx') || 
              id.includes('node_modules/class-variance-authority') || 
              id.includes('node_modules/tailwind-merge')) {
            return 'utils';
          }
          
          // Icons
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          
          // Animations
          if (id.includes('node_modules/framer-motion')) {
            return 'animations';
          }
          
          // Radix UI components
          if (id.includes('node_modules/@radix-ui')) {
            return 'ui-components';
          }
          
          // Vendor chunk for other dependencies
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'sonner',
    ],
    exclude: [
      // Exclude heavy unused dependencies
      'recharts',
      'embla-carousel-react',
      'vaul',
      'cmdk',
      'date-fns',
      'react-day-picker',
      'react-resizable-panels',
      'input-otp',
      'next-themes',
    ],
  },
}));
