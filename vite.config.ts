import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/tokens.scss" as *;`,
      },
    },
  },
  server: { port: 5173 },
})
