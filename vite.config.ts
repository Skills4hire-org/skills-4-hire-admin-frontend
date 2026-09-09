import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-redux', 'react-is'],
          // Data fetching & state
          'vendor-data': ['@tanstack/react-query', 'axios', 'socket.io-client'],
          // Radix UI primitives
          'vendor-radix': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-progress',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            'radix-ui',
          ],
          // Icons
          'vendor-icons': ['lucide-react', 'react-icons', '@iconify/react'],
          // Charts
          'vendor-charts': ['recharts'],
          // Utilities
          'vendor-utils': [
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
            'sonner',
            'date-fns',
            'zod',
            'jwt-decode',
            'next-themes',
          ],
          // Carousel / media
          'vendor-media': [
            'embla-carousel-react',
            'swiper',
            'yet-another-react-lightbox',
            'vaul',
          ],
        },
      },
    },
  },
})
