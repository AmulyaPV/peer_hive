import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "KCET Mentor Connect",
  description: "Connect with engineering students from top colleges for KCET counselling guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-50 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
