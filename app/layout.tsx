import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Byte Solutions — Empowering Your Vision",
  description:
    "Custom Apps, Websites, SaaS & AI-powered software built to scale. Digital Byte Solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,500&f[]=plus-jakarta-sans@400,500,600&display=swap"
        />
      </head>

      <body className="min-h-full flex flex-col bg-[#020813]">
        {children}
      </body>
    </html>
  );
}