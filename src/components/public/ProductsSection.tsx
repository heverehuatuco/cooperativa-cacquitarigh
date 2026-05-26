"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface GalleryImages {
  img1: string;
  img2: string;
  img3: string;
  img4: string;
}

export default function ProductsSection() {
  const [images, setImages] = useState<GalleryImages | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setImages({
            img1: data.productGalleryImage1 || "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800",
            img2: data.productGalleryImage2 || "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&q=80&w=400",
            img3: data.productGalleryImage3 || "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=400",
            img4: data.productGalleryImage4 || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
          });
        }
      } catch (error) {
        console.error("Error al cargar imágenes de galería:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <section id="productos" className="relative pt-8 pb-20 bg-transparent">
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
            Nuestra Cosecha
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
            Productos que Ofrecemos
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Acopiamos y procesamos café y cacao con rigurosos estándares de calidad. Conoce nuestras líneas principales a través de nuestra galería.
          </p>
        </motion.div>

        {/* Bento Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-primary-brand mr-2" size={32} />
            <span className="text-stone-500">Cargando galería...</span>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left large image (col-span-6) */}
            <motion.div 
              className="md:col-span-6 h-64 md:h-[500px] rounded-xl overflow-hidden shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img src={images?.img1} alt="Galería de Productos 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>
            
            {/* Right side wrapper */}
            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              {/* Top left square */}
              <motion.div 
                className="col-span-1 h-32 md:h-[242px] rounded-xl overflow-hidden shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img src={images?.img2} alt="Galería de Productos 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>

              {/* Top right square */}
              <motion.div 
                className="col-span-1 h-32 md:h-[242px] rounded-xl overflow-hidden shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img src={images?.img3} alt="Galería de Productos 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>

              {/* Bottom wide */}
              <motion.div 
                className="col-span-2 h-40 md:h-[242px] rounded-xl overflow-hidden shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <img src={images?.img4} alt="Galería de Productos 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
