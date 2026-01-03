import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { resolve } from 'path'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import { readFileSync } from 'fs'
import { spawn } from 'child_process'

// Custom Vue 2 compatible SVG loader
const svgLoader = () => {
  return {
    name: 'vite-svg-loader-vue2',
    transform(code, id) {
      if (id.endsWith('.svg')) {
        const svg = readFileSync(id, 'utf-8')
        // Extract SVG content (remove XML declaration and clean up)
        const svgContent = svg
          .replace(/<\?xml[^>]*\?>/g, '')
          .replace(/<!--[\s\S]*?-->/g, '')
          .trim()
        
        // Return Vue 2 component using render function (no template compiler needed)
        return {
          code: `
            export default {
              name: 'SvgIcon',
              render(h) {
                return h('span', {
                  domProps: {
                    innerHTML: ${JSON.stringify(svgContent)}
                  }
                })
              }
            }
          `,
          map: null
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [
    createVuePlugin(),
    svgLoader(),
    electron([
      {
        entry: 'src/background.js',
        onstart(options) {
          // Start Electron after build completes
          setTimeout(() => {
            const electronPath = require('electron')
            spawn(electronPath, [resolve(__dirname, 'dist_electron/background.js')], {
              stdio: 'inherit'
            })
          }, 1000)
        },
        vite: {
          resolve: {
            alias: {
              '@': resolve(__dirname, 'src')
            }
          },
          build: {
            outDir: 'dist_electron',
            rollupOptions: {
              external: ['electron']
            }
          }
        }
      }
    ]),
    renderer()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  },
  server: {
    port: 5173,
    strictPort: true
  }
})

