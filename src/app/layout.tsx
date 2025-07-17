import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Providers } from "@/components/Provider";
import '@rainbow-me/rainbowkit/styles.css';
import { Suspense } from 'react';
import LoadingComponent from '@/components/LoadingComponent';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Umi Developer Toolkit",
  description: "Start building on Umi Instantly",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Providers>
            <Suspense fallback={<LoadingComponent />}>
              {children}
            </Suspense>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}