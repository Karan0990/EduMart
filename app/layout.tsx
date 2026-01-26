import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"
import { Toaster } from "react-hot-toast"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StationeryHub - All Your Stationery Needs",
  description:
    "Quality stationery products for students, professionals, and creative minds.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>

        {children}

        <Toaster position="top-center" />
        <Analytics />

        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
