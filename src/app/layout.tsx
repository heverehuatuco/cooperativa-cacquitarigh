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
  title: "COOPERATIVA AGRARIA CAFETALERA QUITARI",
  description:
    "Cooperativa Agraria Cafetalera QUITARI. Productos agrícolas de excelencia y comercio justo.",
  keywords: [
    "COOPERATIVA AGRARIA CAFETALERA QUITARI",
    "cooperativa",
    "café",
    "cacao",
    "productos agrarios",
    "comercio justo",
    "agricultura sostenible",
  ],
  authors: [{ name: "COOPERATIVA AGRARIA CAFETALERA QUITARI" }],
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
