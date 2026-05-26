import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "APASAJEM | Café y Cacao de Alta Calidad",
  description:
    "Asociación de Productores Agrarios de la Microcuenca San Jerónimo Matzuriniari. Acopio, procesamiento y comercialización de café y cacao especial de alta calidad.",
  keywords: [
    "APASAJEM",
    "café",
    "cacao",
    "acopio de café",
    "cacao orgánico",
    "San Jerónimo Matzuriniari",
    "asociación agraria",
    "agricultura sostenible",
  ],
  authors: [{ name: "APASAJEM" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
