"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
    imageUrl: "",
  },
  {
    id: "gal-2",
    title: "Control de Calidad del Café",
    description: "Sesión de catación profesional evaluando la fragancia, acidez y balance de nuestros cafés especiales.",
    category: "cafe",
    imageUrl: "",
  },
  {
    id: "gal-3",
    title: "Procesamiento de Cacao Fino",
    description: "Clasificación meticulosa de granos durante la fermentación para asegurar el perfil de sabor de exportación.",
    category: "cacao",
    imageUrl: "",
  },
  {
    id: "gal-4",
    title: "Cosecha Sostenible",
    description: "Trabajamos respetando el medio ambiente en cada etapa de la producción.",
    category: "cacao",
    imageUrl: "",
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

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % items.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [items.length]);

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
    <section id="galeria" className="relative pt-2 lg:pt-8 pb-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="text-center max-w-3xl mx-auto mb-4 lg:mb-10 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-stone-900 tracking-tight mb-2 lg:mb-4">
            Galería de Fotos
          </h2>
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
          <div className="flex flex-col gap-6">

            {/* Cinematic Main Featured Image */}
            <div className="relative w-full rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[16/7] shadow-2xl group bg-stone-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  {items[featuredIndex].imageUrl ? (
                    <Image
                      src={items[featuredIndex].imageUrl}
                      alt={items[featuredIndex].title}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-500">Sin Imagen</div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Glassmorphism Overlay at Bottom */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-transparent z-10 flex flex-col justify-end">
                <motion.div
                  key={`info-${featuredIndex}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <span className="inline-block px-3 py-1 mb-3 rounded-md bg-secondary-brand/20 backdrop-blur-md border border-secondary-brand/30 text-secondary-brand-light text-xs font-bold uppercase tracking-wider">
                    {items[featuredIndex].category || "Galería"}
                  </span>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-2 drop-shadow-md">
                    {items[featuredIndex].title}
                  </h3>
                  {items[featuredIndex].description && (
                    <p className="text-stone-300 text-sm md:text-base max-w-2xl line-clamp-2 md:line-clamp-none">
                      {items[featuredIndex].description}
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Elegant Navigation Controls */}
              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between z-20 pointer-events-none">
                <button
                  onClick={handlePrev}
                  className="pointer-events-auto w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="pointer-events-auto w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
                  aria-label="Siguiente"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
