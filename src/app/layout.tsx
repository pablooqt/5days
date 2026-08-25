import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'OmniTwin — Interactive 3D Building Management / Digital Twin',
  description:
    'Interactive 3D Digital Twin web application for smart building monitoring, spatial telemetry, and device management.',
  keywords: [
    '3D Building Management',
    'Digital Twin',
    'Three.js',
    'React Three Fiber',
    'Facility Management',
    'Smart Building',
  ],
    authors: [{ name: 'OmniTwin Systems' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans scroll-smooth h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F7F8FA] text-[#111827]">
        {children}
      </body>
    </html>
  );
}
