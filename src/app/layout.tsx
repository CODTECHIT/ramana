import type { Metadata } from "next";
import "../styles/index.css";

export const metadata: Metadata = {
  title: "Ramana Jewells - Premium Jewellery",
  description: "Three generations of South Indian master craftsmen preserving the art of temple jewellery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
