import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping and Returns',
  description: 'Learn about Ramana Jewells shipping policies, delivery times, and our hassle-free return and exchange processes.',
};

export default function ShippingReturnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
