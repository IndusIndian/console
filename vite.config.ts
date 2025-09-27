import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Suppress specific warnings
    logOverride: {
      'this-is-undefined-in-esm': 'silent'
    }
  },
  build: {
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'antd-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('axios')) {
              return 'utils-vendor';
            }
            return 'vendor';
          }
          // App chunks
          if (id.includes('src/components/Templates')) {
            return 'templates';
          }
          if (id.includes('src/components/AccountManagement')) {
            return 'account';
          }
          if (id.includes('src/components/DeviceManagement')) {
            return 'device';
          }
          if (id.includes('src/contexts')) {
            return 'contexts';
          }
        }
      }
    },
    // Enable minification
    minify: 'esbuild',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging
    sourcemap: false
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'antd', '@ant-design/icons', 'react-router-dom', 'axios']
  }
})
