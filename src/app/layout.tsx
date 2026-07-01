import type { Metadata } from "next";
import { Outfit, Roboto_Mono, Rubik } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cooperativa Cacquitari",
  description:
    "Cooperativa Agraria Cacquitari. Productos agrícolas de excelencia y comercio justo.",
  keywords: [
    "Cacquitari",
    "cooperativa",
    "café",
    "cacao",
    "productos agrarios",
    "comercio justo",
    "agricultura sostenible",
  ],
  authors: [{ name: "Cooperativa Cacquitari" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${robotoMono.variable} ${rubik.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
