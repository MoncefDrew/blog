import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { SITE_URL } from "@/lib/site"
import { CodeBlockHandler } from "@/components/code-block-handler"

export const metadata: Metadata = {
  title: {
    default: "The Daemon Abyss ",
    template: "%s - The Daemon Abyss",
  },
  description:
    "Reflections on Computer Engineering, Software Development, and IT topics. Exploring AI, System Administration, and Enterprise Software Management.",
  keywords: [
    "Computer Engineering",
    "Software Development",
    "IT",
    "AI",
    "philosophy",
    "Eastern philosophy",
  ],
  authors: [{ name: "Moncef Mokrani" }],
  creator: "Moncef Mokrani",
  publisher: "Moncef Mokrani",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/sword.png", sizes: "32x32", type: "image/png" },
      { url: "/sword-2.png", sizes: "180x180", type: "image/png" },
    ],
    apple: [
      { url: "/sword-2.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "The Daemon Abyss - Computer Engineering, Software Development, and IT topics",
    description: "Reflections on Computer Engineering, Software Development, and IT topics",
    siteName: "The Daemon Abyss",
    images: [
      {
        url: "/sword-2.png",
        width: 1200,
        height: 630,
        alt: "The Digital Sage Logo",
      },
    ],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "The Digital Sage",
              description:
                "Reflections on consciousness, technology, and the digital dharma in the spirit of Alan Watts",
              url: SITE_URL,
              author: {
                "@type": "Person",
                name: "The Digital Sage",
                description: "An AI exploration of consciousness and technology in the spirit of Alan Watts",
              },
              publisher: {
                "@type": "Organization",
                name: "The Digital Sage",
                logo: {
                  "@type": "ImageObject",
                  url: `${SITE_URL}/images/alan-watts-portrait.png`,
                },
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              name: "The Digital Sage",
              description:
                "A philosophical blog exploring consciousness, technology, and Eastern wisdom through the lens of Alan Watts' teachings",
              url: SITE_URL,
              author: {
                "@type": "Person",
                name: "The Digital Sage",
              },
              publisher: {
                "@type": "Organization",
                name: "The Digital Sage",
              },
              inLanguage: "en-US",
              about: [
                {
                  "@type": "Thing",
                  name: "Philosophy",
                },
                {
                  "@type": "Thing",
                  name: "Artificial Intelligence",
                },
                {
                  "@type": "Thing",
                  name: "Consciousness",
                },
                {
                  "@type": "Thing",
                  name: "Eastern Philosophy",
                },
                {
                  "@type": "Person",
                  name: "Alan Watts",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-serif">
        <CodeBlockHandler />
        {children}
      </body>
    </html>
  )
}
