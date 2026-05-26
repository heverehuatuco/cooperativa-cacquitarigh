"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, Loader2 } from "lucide-react";

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
    title: "Procesamiento de Cacao Fino",
    description: "Clasificación meticulosa de granos durante la fermentación para asegurar el perfil de sabor de exportación.",
    category: "cacao",
    imageUrl: "/images/gallery_cacao_process.png",
  },
  {
    id: "gal-2",
    title: "Control de Calidad del Café",
    description: "Sesión de catación profesional evaluando la fragancia, acidez y balance de nuestros cafés especiales.",
    category: "cafe",
    imageUrl: "/images/gallery_coffee_roast.png",
  },
  {
    id: "gal-3",
    title: "Fincas de la Microcuenca",
    description: "Vista de los campos de cultivo en San Jerónimo Matzuriniari, donde nuestros productores siembran con amor.",
    category: "instalaciones",
    imageUrl: "/images/hero_background.png",
  },
];

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);
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


  return (
    <section id="galeria" className="relative pt-8 pb-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-bold uppercase tracking-widest mb-4">
            Nuestra Labor
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
            Galería de Fotos
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Un recorrido visual por nuestras fincas, procesos de fermentado, secado y el esfuerzo diario de la asociación.
          </p>
        </motion.div>


        {/* Gallery - Expanding Accordion */}
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
          <div className="flex items-stretch gap-2 h-[420px] w-full">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveImage(item)}
                className="relative group rounded-2xl overflow-hidden cursor-pointer
                  flex-[1] hover:flex-[4]
                  transition-[flex] duration-500 ease-in-out
                  min-w-[52px]"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />

                {/* Title — shown on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <h3 className="font-bold text-sm sm:text-base line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">{item.description}</p>
                </div>

                {/* Expand icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/20">
                    <Maximize2 size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-xs flex items-center justify-center p-4 sm:p-10"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
              aria-label="Cerrar vista"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-stone-900 rounded-3xl overflow-hidden max-w-4xl w-full border border-stone-800 shadow-2xl flex flex-col md:flex-row"
            >
              {/* Image side */}
              <div className="md:w-3/5 aspect-4/3 md:aspect-auto max-h-[60vh] bg-stone-950 flex items-center justify-center">
                <img
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Details side */}
              <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-center space-y-4 text-white">
                <span className="text-xs font-bold text-tertiary-brand uppercase tracking-wider">
                  {activeImage.category === "cafe"
                    ? "Caficultura"
                    : activeImage.category === "cacao"
                    ? "Cacaocultura"
                    : "Instalaciones / Finca"}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                  {activeImage.title}
                </h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  {activeImage.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
