import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    minify: 'esbuild',
  },
  test: {
    environment: 'happy-dom',
  }
});
