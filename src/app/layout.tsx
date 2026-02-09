import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { SurveyProvider } from "@/context/SurveyContext";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Indikativ analys för digital mognad",
  description: "Powered by Great IT",
};

import NextAuthProvider from "@/components/providers/NextAuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={`${raleway.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}>
        <NextAuthProvider>
          <SurveyProvider>
            {children}
          </SurveyProvider>
        </NextAuthProvider>

        <footer className="mt-auto py-12 text-center text-xs tracking-[0.2em] font-bold text-text-muted/60 uppercase print:hidden">
          <p className="mb-2 text-accent">Powered by Great IT</p>
          <p>© 2026 Analys för digital mognad</p>
        </footer>
      </body>
    </html>
  );
}
