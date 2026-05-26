import React from "react";
import Navbar from "@/components/public/Navbar";
import AboutUs from "@/components/public/AboutUs";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";

export default function NosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navegación Flotante */}
      <Navbar />

      {/* Contenido Principal con fondo unificado y patrón sutil */}
      <main className="flex-grow bg-stone-50 relative pt-24">
        {/* Subtle background pattern (dots) */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#d5b9b2_1px,transparent_1px)] opacity-[0.15] [background-size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10">
          {/* Sección Quiénes Somos */}
          <AboutUs />
        </div>
      </main>

      {/* Botón de WhatsApp Flotante */}
      <WhatsAppButton />

      {/* Pie de Página */}
      <Footer />
    </div>
  );
}
