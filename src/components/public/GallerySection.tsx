"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import EditableText from "@/components/ui/EditableText";

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
    title: "Sostenibilidad",
    description: "Donec eros cursus nam senectus tempus vestibulum aliquet varius porttitor curae aliquam aenean himenaeos mattis",
    category: "instalaciones",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "gal-2",
    title: "Innovación",
    description: "Malesuada ante arcu est, a felis porttitor, auctor venenatis augue quam consectetur massa fermentum pulvinar primis tincidunt potenti massa etiam bibendum",
    category: "cafe",
    imageUrl: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "gal-3",
    title: "Cultivo",
    description: "Volutpat sollicitudin convallis potenti urna vehicula purus sociosqu sapien",
    category: "cacao",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "gal-4",
    title: "Cosecha",
    description: "Aenean lobortis, potenti donec a aliquam nulla urna risus auctor etiam primis aenean",
    category: "cacao",
    imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=600&auto=format&fit=crop",
  }
];

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);
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

        if (fetchedItems.length < 4) {
          // If not enough items in DB to fill the 4 grid spots, combine with mocks
          setItems([...fetchedItems, ...MOCK_GALLERY.slice(fetchedItems.length, 4)]);
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
    <section id="galeria" className="relative pt-28 lg:pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >

          {/* Overtitle / Etiqueta */}
          <EditableText 
            textKey="gallery.eyebrow" 
            defaultText="Nuestra Galería" 
            className="inline-block py-1.5 px-4 rounded-full bg-[#75a331]/10 text-[#4b6d35] text-sm font-bold tracking-widest uppercase mb-4 shadow-sm border border-[#75a331]/20"
          />

          {/* Título Principal con Gradiente */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-stone-800 tracking-tight leading-[1.2] mb-6 font-outfit">
            <EditableText textKey="gallery.title.1" defaultText="Descubriendo la Belleza e Innovación de la" /> <br className="hidden md:block" />
            <EditableText 
              textKey="gallery.title.2" 
              defaultText="Agricultura Sostenible" 
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#75a331] via-[#4b6d35] to-[#2a5420]" 
            />
          </h2>

          {/* Subtítulo descriptivo */}
          <EditableText 
            textKey="gallery.description" 
            defaultText="A través de impactantes visuales e imágenes inspiradoras, te invitamos a conocer el corazón de nuestro trabajo, nuestra tierra y nuestra gente."
            as="p"
            multiline={true}
            className="text-stone-500 text-base md:text-lg max-w-2xl leading-relaxed font-medium"
          />
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-primary-brand mr-2" size={32} />
            <span className="text-stone-500">Cargando galería...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 lg:gap-6 min-h-[600px] lg:min-h-[700px]">
            {items.slice(0, 4).map((item, index) => {
              let gridClass = "";
              if (index === 0) gridClass = "md:row-span-2 md:col-span-1 h-[300px] md:h-auto";
              else if (index === 1) gridClass = "md:col-span-2 md:row-span-1 h-[250px] md:h-auto";
              else gridClass = "md:col-span-1 md:row-span-1 h-[250px] md:h-auto";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
                  className={`relative rounded-[2rem] overflow-hidden group shadow-sm border border-stone-100 ${gridClass}`}
                >
                  <Image
                    src={item.imageUrl || MOCK_GALLERY[index].imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 pt-20 pb-6 px-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/80">
                    <p className="text-white/90 text-xs sm:text-sm font-medium leading-relaxed drop-shadow-md transform translate-y-2 opacity-90 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
