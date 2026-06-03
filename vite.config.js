import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 4200,
    open: true,
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['marked', 'highlight.js'],
          export: ['html2pdf.js', 'html-docx-js-typescript', 'file-saver', 'jszip'],
          diagrams: ['mermaid'],
        },
      },
    },
  },
});
