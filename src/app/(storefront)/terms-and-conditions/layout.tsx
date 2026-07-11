import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Review the terms and conditions for using the Ramana Jewells website and purchasing our premium temple jewellery.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
