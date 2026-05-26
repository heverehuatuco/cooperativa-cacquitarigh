"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: "cafe" | "cacao" | "instalaciones" | string;
  imageUrl: string;
}

const MOCK_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Fincas de la Microcuenca",
    description: "Vista de los campos de cultivo en San Jerónimo Matzuriniari, donde nuestros productores siembran con amor.",
    category: "instalaciones",
    imageUrl: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "gal-2",
    title: "Control de Calidad del Café",
    description: "Sesión de catación profesional evaluando la fragancia, acidez y balance de nuestros cafés especiales.",
    category: "cafe",
    imageUrl: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "gal-3",
    title: "Procesamiento de Cacao Fino",
    description: "Clasificación meticulosa de granos durante la fermentación para asegurar el perfil de sabor de exportación.",
    category: "cacao",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "gal-4",
    title: "Cosecha Sostenible",
    description: "Trabajamos respetando el medio ambiente en cada etapa de la producción.",
    category: "cacao",
    imageUrl: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800",
  }
];

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedItems: GalleryItem[] = [];

        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() } as GalleryItem);
        });

        if (fetchedItems.length === 0) {
          setItems(MOCK_GALLERY);
        } else {
          setItems(fetchedItems);
        }
      } catch (error) {
        console.error("Error al cargar la galería:", error);
        setItems(MOCK_GALLERY);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const handleNext = () => {
    if (items.length > 0) {
      setFeaturedIndex((prev) => (prev + 1) % items.length);
    }
  };

  const handlePrev = () => {
    if (items.length > 0) {
      setFeaturedIndex((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  return (
    <section id="galeria" className="relative pt-16 pb-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching the new reference image */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-stone-800 tracking-tight mb-4">
            Galería de Fotos
          </h2>
          <p className="text-stone-500 text-base mb-6">
            Un recorrido visual por nuestras fincas, procesos de fermentado, secado y el esfuerzo diario de la cooperativa.
          </p>
          <button className="bg-primary-brand hover:brightness-110 transition-all text-white text-sm font-semibold px-6 py-2.5 rounded-md flex items-center gap-2">
            Ver Todo <ArrowRight size={16} />
          </button>
        </motion.div>

        {/* Gallery Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-primary-brand mr-2" size={32} />
            <span className="text-stone-500">Cargando galería...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-stone-400 text-sm">
            No hay imágenes en la galería aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Left Column: Stacked Thumbnails */}
            <div className="col-span-1 md:col-span-3 flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-visible snap-x pb-2 md:pb-0">
              {items.slice(0, 3).map((item, idx) => (
                <div 
                  key={item.id}
                  onClick={() => setFeaturedIndex(idx)}
                  className={`flex-1 min-w-[140px] md:min-w-0 min-h-[100px] md:min-h-0 rounded-xl overflow-hidden cursor-pointer relative group transition-all duration-300 ${idx === featuredIndex ? 'ring-2 ring-primary-brand shadow-md scale-[1.02]' : 'opacity-80 hover:opacity-100 hover:scale-[1.01]'}`}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors"></div>
                </div>
              ))}
            </div>

            {/* Right Column: Featured Large Image */}
            <div className="col-span-1 md:col-span-9 relative rounded-xl overflow-hidden aspect-[4/3] md:aspect-[16/10] lg:aspect-[21/9] group bg-stone-100">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={featuredIndex}
                  src={items[featuredIndex].imageUrl} 
                  alt={items[featuredIndex].title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover absolute inset-0"
                />
              </AnimatePresence>
              
              {/* Controls */}
              <button 
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-stone-800 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 z-10"
                aria-label="Anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-stone-800 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 z-10"
                aria-label="Siguiente"
              >
                <ChevronRight size={20} />
              </button>

              {/* Optional Title Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent z-10">
                <motion.h3 
                  key={`title-${featuredIndex}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-white font-semibold text-lg md:text-xl shadow-sm"
                >
                  {items[featuredIndex].title}
                </motion.h3>
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
