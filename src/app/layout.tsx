import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ivon — AI tools & prompts',
  description: 'A curated catalog of AI tools and ready-to-use prompts.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
