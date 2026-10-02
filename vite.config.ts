import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // 部署在 GitHub Pages 的仓库子路径下（whwink.github.io/expense-tracker/）
  base: '/expense-tracker/',
  plugins: [react(), tailwindcss()],
})
