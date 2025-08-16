import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Determine which env file to use based on mode
  let envFile = '.env';
  if (mode === 'development') {
    envFile = '.env.dev';
  } else if (mode === 'remotedev') {
    envFile = '.env.remotedev';
  } else if (mode === 'localdev') {
    envFile = '.env';
  } else if (mode === 'production') {
    envFile = '.env.production';
  } else {
    envFile = '.env';
  }

  console.log(`🚀 Running in ${mode} mode, using ${envFile}`);

  return {
    plugins: [react(), svgr()],
    define: {
        global: "globalThis", // 👈 fixes "global is not defined"
    },
    publicDir: "public",
    build: {
      outDir: 'build', // 👈 output build files to 'build' folder instead of 'dist'
      emptyOutDir: true, // 👈 empty the output directory before building
      sourcemap: false, // 👈 disable source maps for production builds (optional)
      // Memory optimization settings
      chunkSizeWarningLimit: 1000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        mangle: {
          safari10: true,
        },
      },
      rollupOptions: {
        // Memory optimization: split vendor chunks
        output: {
          // Optional: customize chunk file names
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            vendor: ['react', 'react-dom'],
            utils: ['lodash', 'axios'],
            ui: ['@mui/material', '@mui/icons-material'],
          },
        },
        // Reduce memory usage during build
        maxParallelFileOps: 2,
      },
    },
    server: {
        // open the browser at project root
        open: true,
        port: 3000, // 👈 set default port to 3000
    },
    resolve: {
        alias: {
            "@": "/src",
            buffer: "buffer",
        },
    },
    optimizeDeps: {
        include: ["buffer"],
    },

    // esbuild configuration removed; Vite handles JSX automatically with the React plugin.
    // https://vitejs.dev/config/
    // Use project root index.html and serve static assets from public/
    root: process.cwd(),
});
