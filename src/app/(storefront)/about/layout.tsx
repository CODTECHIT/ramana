import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Ramana Jewells - three generations of master craftsmen preserving the heritage and art of temple jewellery in South India.",
  openGraph: {
    title: "About Us | Ramana Jewells",
    description: "Learn about Ramana Jewells - three generations of master craftsmen preserving the heritage and art of temple jewellery in South India.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
