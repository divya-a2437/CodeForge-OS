import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeForge OS',
  description: 'A multi-agent software delivery platform for planning, designing, implementing, testing, and releasing software.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
