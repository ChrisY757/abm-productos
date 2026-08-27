import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ABM de Productos - Next.js",
  description: "Laboratorio de Programación Web Frontend con Next.js y API REST",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
          {children}
        </div>
        <footer className="bg-white border-t border-slate-200 py-4 text-center text-sm text-slate-500">
          Facultad Politécnica - UNA | Programación Web Frontend
        </footer>
      </body>
    </html>
  );
}
