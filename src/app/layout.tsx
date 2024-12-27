import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

const font = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Vutor',
  description: 'Vutor is a tutoring platform for students',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.variable} ${font.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
