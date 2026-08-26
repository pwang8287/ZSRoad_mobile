import { defineConfig } from 'vite'

export default defineConfig({
  base: '/ZSRoad_mobile/',
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          charts: ['echarts', 'lucide-react'],
          mobile: ['antd-mobile', 'react-mobile-picker']
        }
      }
    }
  }
})
