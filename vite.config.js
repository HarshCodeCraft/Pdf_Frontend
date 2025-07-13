import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    proxy: {
      '/.well-known': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: pathStr => pathStr // <- Don't remove this
      }
    }
  }
})
