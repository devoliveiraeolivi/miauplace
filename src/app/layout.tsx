import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MiauPlace - Adocao de Gatos",
  description: "Encontre seu novo melhor amigo. Plataforma de adocao de gatos que conecta gatinhos que precisam de um lar com familias cheias de amor.",
  keywords: ["adocao", "gatos", "pets", "animais", "adote", "felinos"],
  openGraph: {
    title: "MiauPlace - Adocao de Gatos",
    description: "Encontre seu novo melhor amigo felino",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
