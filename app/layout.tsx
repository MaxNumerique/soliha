import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import './globals.css';
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
    icon: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGxpb25zfGVufDB8fDB8fHww",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="emerald">
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