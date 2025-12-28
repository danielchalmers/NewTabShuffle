import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        newtab: resolve(__dirname, 'src/newtab/index.html'),
        options: resolve(__dirname, 'src/options/index.html'),
        popup: resolve(__dirname, 'src/popup/index.html'),
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
            } else if (name.includes('popup')) {
              return 'popup/popup.css';
            }
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
  plugins: [
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
      ],
    }),
    {
      name: 'move-html-files',
      closeBundle() {
        const distDir = resolve(process.cwd(), 'dist');
        const srcDir = path.join(distDir, 'src');
        
        // Move HTML files from dist/src/ to dist/ and remove src dir
        if (fs.existsSync(srcDir)) {
          // Move newtab HTML
          const newtabSrc = path.join(srcDir, 'newtab', 'index.html');
          const newtabDest = path.join(distDir, 'newtab', 'index.html');
          if (fs.existsSync(newtabSrc)) {
            let html = fs.readFileSync(newtabSrc, 'utf-8');
            // Fix paths: replace ../../newtab/ with ./
            html = html.replace(/\.\.\/\.\.\/newtab\//g, './');
            // Fix paths: replace ../../chunks/ with ../chunks/
            html = html.replace(/\.\.\/\.\.\/chunks\//g, '../chunks/');
            fs.writeFileSync(newtabDest, html);
          }
          
          // Move options HTML
          const optionsSrc = path.join(srcDir, 'options', 'index.html');
          const optionsDest = path.join(distDir, 'options', 'index.html');
          if (fs.existsSync(optionsSrc)) {
            let html = fs.readFileSync(optionsSrc, 'utf-8');
            // Fix paths: replace ../../options/ with ./
            html = html.replace(/\.\.\/\.\.\/options\//g, './');
            // Fix paths: replace ../../chunks/ with ../chunks/
            html = html.replace(/\.\.\/\.\.\/chunks\//g, '../chunks/');
            fs.writeFileSync(optionsDest, html);
          }

          // Move popup HTML
          const popupSrc = path.join(srcDir, 'popup', 'index.html');
          const popupDest = path.join(distDir, 'popup', 'index.html');
          if (fs.existsSync(popupSrc)) {
            let html = fs.readFileSync(popupSrc, 'utf-8');
            // Fix paths: replace ../../popup/ with ./
            html = html.replace(/\.\.\/\.\.\/popup\//g, './');
            // Fix paths: replace ../../chunks/ with ../chunks/
            html = html.replace(/\.\.\/\.\.\/chunks\//g, '../chunks/');
            fs.writeFileSync(popupDest, html);
          }
          
          // Remove the src directory
          fs.rmSync(srcDir, { recursive: true, force: true });
        }
      },
    },
  ],
});
