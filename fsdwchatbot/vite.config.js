// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss({
      // This is the object you need to add
      darkMode: 'class',
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
      ],
    }),
  ],
})
