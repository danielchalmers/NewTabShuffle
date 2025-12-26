import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        newtab: resolve(__dirname, 'src/newtab/index.html'),
        options: resolve(__dirname, 'src/options/index.html'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Place JS files in their respective directories
          return `${chunkInfo.name}/${chunkInfo.name}.js`;
        },
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          // Extract the entry name from the facadeModuleId if available
          if (name.endsWith('.css')) {
            if (name.includes('newtab')) {
              return 'newtab/newtab.css';
            } else if (name.includes('options')) {
              return 'options/options.css';
            }
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
  plugins: [
    {
      name: 'html-transform',
      closeBundle() {
        // After build, remove duplicate HTML files from src/ directory
        const distDir = resolve(process.cwd(), 'dist');
        const srcDir = path.join(distDir, 'src');
        
        // Remove the src directory if it exists
        if (fs.existsSync(srcDir)) {
          fs.rmSync(srcDir, { recursive: true, force: true });
        }
      },
    },
    viteStaticCopy({
      targets: [
        {
          src: 'src/manifest.json',
          dest: '.',
        },
        {
          src: 'src/icons/*.png',
          dest: 'icons',
        },
        {
          src: 'src/newtab/index.html',
          dest: 'newtab',
        },
        {
          src: 'src/options/index.html',
          dest: 'options',
        },
      ],
    }),
  ],
});
