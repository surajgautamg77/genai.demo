import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/genaidemo',
  server: {
    port: 9000,
    allowedHosts: ['aibot14.studyineurope.xyz'], 
    host: true,
  },
})