import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ThanPerfect',
  description: 'Simple SSO for home-made webapps',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

