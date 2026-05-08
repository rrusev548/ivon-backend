import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ivon — Premium training in AI and social media',
  description:
    'Three programs in AI and social media. Expert level, repeatable results. No hype.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
