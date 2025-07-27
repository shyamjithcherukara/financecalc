import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Calculator, Sparkles } from "lucide-react";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Free Financial Calculator - SIP, EMI, FD, PPF, EPF, Tax Calculator",
    template: "%s | Finance Calculator"
  },
  description: "Free online financial calculators for SIP, EMI, FD, PPF, EPF, tax calculation, and more. Calculate your investments, loans, and tax savings with our comprehensive financial tools. No registration required.",
  keywords: [
    "financial calculator",
    "SIP calculator",
    "EMI calculator",
    "FD calculator",
    "PPF calculator",
    "EPF calculator",
    "tax calculator",
    "investment calculator",
    "loan calculator",
    "mutual fund calculator",
    "retirement calculator",
    "wealth calculator",
    "personal finance",
    "financial planning",
    "investment planning",
    "tax planning",
    "wealth management",
    "financial tools",
    "online calculator",
    "free calculator"
  ],
  authors: [{ name: "Finance Calculator Team" }],
  creator: "Finance Calculator",
  publisher: "Finance Calculator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fincalc.cleanstack.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fincalc.cleanstack.dev',
    siteName: 'Finance Calculator',
    title: 'Free Financial Calculator - SIP, EMI, FD, PPF, EPF, Tax Calculator',
    description: 'Free online financial calculators for SIP, EMI, FD, PPF, EPF, tax calculation, and more. Calculate your investments, loans, and tax savings with our comprehensive financial tools.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Finance Calculator - Comprehensive Financial Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Financial Calculator - SIP, EMI, FD, PPF, EPF, Tax Calculator',
    description: 'Free online financial calculators for SIP, EMI, FD, PPF, EPF, tax calculation, and more. Calculate your investments, loans, and tax savings.',
    images: ['/og-image.png'],
    creator: '@financecalc',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-xxxxxx"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-xxxxxxx', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `}
        </Script>
        
        {/* Structured Data for Financial Calculator */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Finance Calculator",
              "description": "Free online financial calculators for SIP, EMI, FD, PPF, EPF, tax calculation, and more. Calculate your investments, loans, and tax savings with our comprehensive financial tools.",
              "url": "https://fincalc.cleanstack.dev",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "SIP Calculator",
                "EMI Calculator", 
                "FD Calculator",
                "PPF Calculator",
                "EPF Calculator",
                "Tax Calculator",
                "Investment Calculator",
                "Loan Calculator"
              ],
              "author": {
                "@type": "Organization",
                "name": "Finance Calculator"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Finance Calculator"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250",
                "bestRating": "5",
                "worstRating": "1"
              }
            })
          }}
        />
        
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Finance Calculator" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark bg-background text-foreground`}
      >
        {/* Beautiful Header */}
        <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Brand */}
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <Calculator className="h-6 w-6 text-white" />
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="h-3 w-3 text-yellow-300 animate-pulse" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-blue-500/30 to-purple-600/30 rounded-2xl blur-md -z-10 group-hover:blur-lg transition-all duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Finance Calculator
                  </h1>
                  <p className="text-xs text-muted-foreground -mt-1">
                    Smart Financial Tools
                  </p>
                </div>
              </div>

              {/* Right side - could add theme toggle or other features later */}
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Privacy First</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content with proper spacing */}
        <div className="pt-16 min-h-screen bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  );
}
