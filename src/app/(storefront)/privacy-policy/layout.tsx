import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the privacy policy of Ramana Jewells to understand how we protect and manage your personal data.',
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
