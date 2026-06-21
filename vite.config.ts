import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    // Inject VITE_APP_URL into index.html so og:image uses the absolute production URL
    {
      name: 'html-env',
      transformIndexHtml(html: string) {
        const appUrl = process.env.VITE_APP_URL || 'https://bidiq-frontend.onrender.com'
        return html.replace(/%VITE_APP_URL%/g, appUrl)
      },
    },
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "BidIQ Pro",
        short_name: "BidIQ",
        description: "The AI Procurement Operating System for SMEs",
        theme_color: "#1e3055",
        background_color: "#f0f4fa",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        navigateFallback: "/index.html"
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
})
