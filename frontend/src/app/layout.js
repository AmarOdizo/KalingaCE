import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import AlertOverride from "@/components/AlertOverride";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://kalingacomputer.com"),
  title: {
    default: "Kalinga Computer Education | Premium Computer & Technical Training",
    template: "%s | Kalinga Computer Education",
  },
  description:
    "Empower your career with specialized IT, computing, and professional courses at Kalinga Computer Education. Hands-on training, industry certifications, and top placement rates.",
  keywords: [
    "Computer Education",
    "Software Training",
    "Web Development",
    "Python",
    "Java",
    "Tally",
    "DCA",
    "PGDCA",
    "AI",
  ],
  authors: [{ name: "Kalinga Computer Education" }],
  creator: "Kalinga Computer Education",
  publisher: "Kalinga Computer Education",
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kalingacomputer.com",
    title: "Kalinga Computer Education | Premium Computer & Technical Training",
    description: "Empower your career with specialized IT, computing, and professional courses at Kalinga Computer Education. Hands-on training, industry certifications, and top placement rates.",
    siteName: "Kalinga Computer Education",
    images: [
      {
        url: "https://kalingacomputer.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kalinga Computer Education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalinga Computer Education | Premium Computer & Technical Training",
    description: "Empower your career with specialized IT, computing, and professional courses at Kalinga Computer Education. Hands-on training, industry certifications, and top placement rates.",
    images: ["https://kalingacomputer.com/og-image.png"],
  },
  other: {
    "article:published_time": "2026-08-14T15:49:58.979Z",
    "twitter:card": "summary",
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": "https://kalingacomputer.com/#organization",
    "name": "Kalinga Computer Education",
    "url": "https://kalingacomputer.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://kalingacomputer.com/klogo.png",
    },
    "image": "https://kalingacomputer.com/opengraph-image.png",
    "description": "Empower your career with specialized IT, computing, and professional courses at Kalinga Computer Education. Hands-on training, industry certifications, and top placement rates.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Athagarh, Cuttack",
      "addressLocality": "Athagarh",
      "addressRegion": "Odisha",
      "postalCode": "754029",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9876543210",
      "contactType": "admissions",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi", "or"]
    },
    "sameAs": [
      "https://www.facebook.com",
      "https://www.instagram.com"
    ]
  };

  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <NavbarWrapper />
        <AlertOverride />
        {children}
      </body>
    </html>
  );
}

