import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Retail Platform Store',
  description: 'Shop footwear, apparel, and uniforms',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
