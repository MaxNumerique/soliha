import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import './globals.css';
import './styles/carousel.css';
import { Toaster } from 'react-hot-toast';
import Navbar from "@components/Navbar";
import Loading from "@components/Loading"; 

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const openSans = Open_Sans({ variable: "--font-open-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soliha Pyrénées Béarn Bigorre",
  description: "Soliha Pyrénées Béarn Bigorre",
  icons: {
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="emerald">
      <body className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} antialiased`}>
        <Toaster position="bottom-right" />
        <Navbar />
        <main>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </main>
      </body>
    </html>
  );
}