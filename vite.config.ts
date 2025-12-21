import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      // This acts as a "dummy" file to stop the error
      "./runtimeConfig": "./runtimeConfig.browser", 
    },
  },
})