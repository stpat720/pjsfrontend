import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  display: 'swap',
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Portfolio - Patrick J Stephen",
  description: "Portfolio of work by patrick J Stephen, Photography, Motion, Design, 3d and Digital Art",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

