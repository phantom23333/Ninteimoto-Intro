import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/components/language-provider"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "NINTEIMOTO | Sliced Memory Reconstruction RPG",
  description: "Reconstruct memories in an infinite labyrinth. Powered by AI-native mechanics.",
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#050505",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased overflow-x-hidden">
        <LanguageProvider>
          <div className="noise-overlay" />
          {children}
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
