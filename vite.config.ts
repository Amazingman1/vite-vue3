/*
 * @Author: wangxuan wangxuan
 * @Date: 2024-08-19 13:17:10
 * @LastEditors: wangxuan wangxuan
 * @LastEditTime: 2024-08-19 13:23:26
 * @FilePath: /vite-vue3/vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  base: './',
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname,'src')},
    ]
  },
  plugins: [vue(), tailwindcss()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false, // 移除所有注释
      }
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/chunks/[name]-[hash].js',
        assetFileNames (chunkInfo) {

          const extType =   chunkInfo.name?.split('.').pop() || '';
          const isFont = ['ttf', 'woff', 'woff2'].includes(extType)
          const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extType)

          if (chunkInfo.name && chunkInfo.name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (isFont) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          if (isImage) {
            return 'assets/images/[name]-[hash][extname]';
          }

          return 'assets/[ext]/[name]-[hash][extname]';
        },
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 设置警告阈值为1000KB 
    // reportCompressedSize: false, // 关闭压缩文件大小报告
    
  }
})
