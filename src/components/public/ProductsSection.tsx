"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Loader2, Coffee, Bean, Package } from "lucide-react";

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

  const products = [
    {
      category: "CAFÉ",
      icon: <Coffee size={28} className="text-white drop-shadow-md" />,
      headerBg: "bg-gradient-to-br from-emerald-400 to-green-600",
      cardBorder: "border-green-100",
      hoverShadow: "hover:shadow-green-200/60 hover:border-green-400",
      iconBg: "bg-white/20 backdrop-blur-sm border-white/30",
      titleColor: "text-white drop-shadow-sm",
      items: [
        { name: "Café Quitari Gourmet", desc: "Cultivado en las laderas de los bosques de Pangoa, notas frutales y chocolate." },
        { name: "Café Quitari Organic", desc: "Sin químicos, certificación orgánica, opción saludable." },
        { name: "Tsinane Coffe Vraem", desc: "Café étnico representativo cultural de nuestras mujeres indígenas." },
        { name: "Café Quitari Expresso", desc: "Fuerte e intenso, notas de caramelo y nuez." },
        { name: "Paradise Coffe", desc: "Representación al campo." }
      ]
    },
    {
      category: "CACAO",
      icon: <Bean size={28} className="text-white drop-shadow-md" />,
      headerBg: "bg-gradient-to-br from-amber-400 to-orange-500",
      cardBorder: "border-orange-100",
      hoverShadow: "hover:shadow-orange-200/60 hover:border-orange-400",
      iconBg: "bg-white/20 backdrop-blur-sm border-white/30",
      titleColor: "text-white drop-shadow-sm",
      items: [
        { name: "Cacao Quitari Fino", desc: "Cultivado en regiones cálidas de Pangoa, notas frutales y especias." },
        { name: "Cacao Quitari con Leche", desc: "Mezclado con leche, sabor suave y cremoso." },
        { name: "Cacao Quitari con Nueces", desc: "Sabor Crunch y sabroso." }
      ]
    },
    {
      category: "DERIVADOS & CHOCHOKI",
      icon: <Package size={28} className="text-white drop-shadow-md" />,
      headerBg: "bg-gradient-to-br from-purple-400 to-indigo-500",
      cardBorder: "border-purple-100",
      hoverShadow: "hover:shadow-purple-200/60 hover:border-purple-400",
      iconBg: "bg-white/20 backdrop-blur-sm border-white/30",
      titleColor: "text-white drop-shadow-sm",
      items: [
        { name: "Chocolate Quitari", desc: "Elaborado con cacao de alta calidad, perfecto para regalos." },
        { name: "Chocolate Memoris Hut", desc: "En memoria de Ucharima Taipe Hector." },
        { name: "Mermelada de Café Quitari", desc: "Perfecta para acompañar tostadas o galletas." },
        { name: "Café Instantáneo Quitari (Chochoki)", desc: "Opción práctica elaborada con café de alta calidad." }
      ]
    }
  ];

  return (
    <section id="productos" className="relative pt-8 pb-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 mt-6 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1.5 px-5 rounded-full bg-primary-brand/10 text-primary-brand text-xs font-extrabold uppercase tracking-widest mb-4">
            Lo que ofrecemos
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Productos Quitari
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-6xl mx-auto">
          {products.map((cat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1, duration: 0.5 }} 
              className={`group bg-white rounded-[2rem] shadow-sm border-2 ${cat.cardBorder} overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${cat.hoverShadow}`}
            >
              <div className={`${cat.headerBg} p-6 sm:p-8 flex flex-col items-center text-center gap-4 transition-colors duration-300 relative overflow-hidden`}>
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className={`p-4 rounded-2xl shadow-inner border transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 ${cat.iconBg}`}>
                  {cat.icon}
                </div>
                <h3 className={`font-black text-2xl tracking-tight ${cat.titleColor}`}>{cat.category}</h3>
              </div>
              <div className="p-7 sm:p-8">
                <ul className="space-y-6">
                  {cat.items.map((item, idx) => (
                    <li key={idx} className="group/item">
                      <h4 className="font-bold text-stone-900 text-[16px] mb-1.5 group-hover/item:text-primary-brand transition-colors duration-200 flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-stone-200 group-hover/item:bg-primary-brand transition-colors duration-200 group-hover/item:scale-125"></span>
                        {item.name}
                      </h4>
                      <p className="text-[14px] text-stone-500 leading-relaxed pl-4">{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bento Gallery Grid */}
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">Galería de Productos</h3>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-primary-brand mr-2" size={32} />
            <span className="text-stone-500">Cargando galería...</span>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
            <motion.div 
              className="md:col-span-6 h-64 md:h-[500px] rounded-xl overflow-hidden shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img src={images?.img1} alt="Galería 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>
            
            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              <motion.div 
                className="col-span-1 h-32 md:h-[242px] rounded-xl overflow-hidden shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img src={images?.img2} alt="Galería 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>

              <motion.div 
                className="col-span-1 h-32 md:h-[242px] rounded-xl overflow-hidden shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img src={images?.img3} alt="Galería 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>

              <motion.div 
                className="col-span-2 h-40 md:h-[242px] rounded-xl overflow-hidden shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <img src={images?.img4} alt="Galería 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
