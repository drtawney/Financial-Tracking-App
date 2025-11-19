/**
 * financial-tracker/vite.config.ts
 *
 * Vite build configuration for the financial tracker application.
 * Includes React and Tailwind CSS plugins.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})