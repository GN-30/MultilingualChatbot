import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    // Pass the Tailwind CSS configuration directly to the plugin
    tailwindcss({
      // The configuration object must be nested inside a 'config' key
      config: {
        // This is the crucial line that enables class-based dark mode
        darkMode: 'class',
        
        // This tells Tailwind where your classes are being used
        content: [
          "./src/**/*.{js,jsx,ts,tsx}",
        ],
        
        // You can include other standard Tailwind config here if needed
        theme: {
          extend: {},
        },
        plugins: [],
      }
    }),
  ],
})

