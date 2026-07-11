import type { Metadata } from "next";
import "../styles/index.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ramanajewells.com"),
  title: {
    default: "Ramana Jewells | Premium Handcrafted South Indian Temple Jewellery",
    template: "%s | Ramana Jewells",
  },
  description: "Three generations of South Indian master craftsmen preserving the art of temple jewellery. Explore our exclusive gold, bridal, and antique collections.",
  keywords: ["temple jewellery", "gold", "south indian jewellery", "handcrafted", "premium", "bridal jewelry", "antique gold", "Ramana Jewells", "kundan", "polki"],
  authors: [{ name: "Ramana Jewells", url: "https://ramanajewells.com" }],
  creator: "Ramana Jewells",
  publisher: "Ramana Jewells",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Ramana Jewells",
    title: "Ramana Jewells | Premium Handcrafted Jewellery",
    description: "Three generations of South Indian master craftsmen preserving the art of temple jewellery.",
    images: [
      {
        url: "/og-image.jpg", // Make sure to place an og-image.jpg in your public folder!
        width: 1200,
        height: 630,
        alt: "Ramana Jewells - Premium South Indian Jewellery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ramana Jewells | Premium Handcrafted Jewellery",
    description: "Three generations of South Indian master craftsmen preserving the art of temple jewellery.",
    images: ["/og-image.jpg"],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
