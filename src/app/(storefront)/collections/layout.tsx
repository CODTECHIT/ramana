import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Collections",
  description: "Explore our premium handcrafted gold and temple jewelry collections. Find the perfect piece for your special occasion.",
  openGraph: {
    title: "Shop Collections | Ramana Jewells",
    description: "Explore our premium handcrafted gold and temple jewelry collections. Find the perfect piece for your special occasion.",
  },
};

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
