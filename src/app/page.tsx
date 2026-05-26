import React from "react";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import GallerySection from "@/components/public/GallerySection";
import NewsSection from "@/components/public/NewsSection";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navegación Flotante */}
      <Navbar />

      {/* Secciones con fondo unificado y patrón sutil */}
      <main className="flex-grow bg-stone-50 relative">
        {/* Subtle background pattern (dots) */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#d5b9b2_1px,transparent_1px)] opacity-[0.15] [background-size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10">
          {/* Héroe de Presentación */}
          <Hero />

        {/* Muestra de Productos (Café y Cacao) */}

        {/* Galería de Fotos */}
        <GallerySection />

        {/* Blog / Noticias Recientes */}
        <NewsSection />

        </div>
      </main>

      {/* Botón de WhatsApp Flotante */}
      <WhatsAppButton />

      {/* Pie de Página */}
      <Footer />
    </div>
  );
}
