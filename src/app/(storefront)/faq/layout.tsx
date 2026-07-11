import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about Ramana Jewells, our temple jewellery, shipping, returns, and custom orders.',
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
