import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< Updated upstream
    port: 5173,
=======
    port: 3000, 
>>>>>>> Stashed changes
  }
})
