import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: ['all']
  }
})
