import React, { Suspense } from "react";
import Navbar from "@/components/public/Navbar";
import ProductsSection from "@/components/public/ProductsSection";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";

export default function ProductosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navegación Flotante */}
      <Navbar />

      {/* Contenido Principal con fondo unificado y patrón sutil */}
      <main className="flex-grow bg-stone-50 relative pt-24">
        {/* Subtle background pattern (dots) */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#d5b9b2_1px,transparent_1px)] opacity-[0.15] [background-size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10">
          {/* Sección de Productos */}
          <Suspense fallback={<div className="flex justify-center items-center py-20"><span className="text-stone-500">Cargando catálogo...</span></div>}>
            <ProductsSection />
          </Suspense>
        </div>
      </main>

      {/* Botón de WhatsApp Flotante */}
      <WhatsAppButton />

      {/* Pie de Página */}
      <Footer />
    </div>
  );
}
