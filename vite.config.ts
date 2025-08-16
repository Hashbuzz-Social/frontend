import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Determine which env file to use based on mode
  let envFile = '.env';
  if (mode === 'development') {
    envFile = '.env.dev';
  } else if (mode === 'localdev') {
    envFile = '.env';
  } else {
    envFile = '.env';
  }

  console.log(`🚀 Running in ${mode} mode, using ${envFile}`);

  return {
    plugins: [react(), svgr()],
    define: {
      global: 'globalThis', // 👈 fixes "global is not defined"
    },
    publicDir: 'public',
    build: {
      outDir: 'build', // 👈 output build files to 'build' folder instead of 'dist'
      emptyOutDir: true, // 👈 empty the output directory before building
      sourcemap: false, // 👈 disable source maps for production builds (optional)
      rollupOptions: {
        output: {
          // Optional: customize chunk file names
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    server: {
      // open the browser at project root
      open: true,
      port: 3000, // 👈 set default port to 3000
    },
    resolve: {
      alias: {
        '@': '/src',
        buffer: 'buffer',
      },
    },
    optimizeDeps: {
      include: ['buffer'],
    },

    // esbuild configuration removed; Vite handles JSX automatically with the React plugin.
    // https://vitejs.dev/config/
    // Use project root index.html and serve static assets from public/
    root: process.cwd(),
  };
});
