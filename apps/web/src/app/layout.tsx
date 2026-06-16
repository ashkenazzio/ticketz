import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ticketz',
  description: 'Community-first event ticketing.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
