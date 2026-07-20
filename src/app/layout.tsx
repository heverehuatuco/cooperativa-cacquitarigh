import type { Metadata } from "next";
import { Outfit, Roboto_Mono, Rubik, Inter, Poppins } from "next/font/google";
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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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

import { WebTextProvider } from "@/context/WebTextContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${robotoMono.variable} ${rubik.variable} ${inter.variable} ${poppins.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 font-sans">
        <AuthProvider>
          <WebTextProvider>
            {children}
          </WebTextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
