"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Loader2, Coffee, Sparkles, Package } from "lucide-react";

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
      icon: <Coffee className="text-primary-brand" />,
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
      icon: <Sparkles className="text-secondary-brand" />,
      items: [
        { name: "Cacao Quitari Fino", desc: "Cultivado en regiones cálidas de Pangoa, notas frutales y especias." },
        { name: "Cacao Quitari con Leche", desc: "Mezclado con leche, sabor suave y cremoso." },
        { name: "Cacao Quitari con Nueces", desc: "Sabor Crunch y sabroso." }
      ]
    },
    {
      category: "DERIVADOS & CHOCHOKI",
      icon: <Package className="text-tertiary-brand" />,
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
          className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-bold uppercase tracking-widest mb-4">
            Nuestros Productos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
            Productos Quitari
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Nuestra cooperativa ofrece una amplia selección de productos premium derivados del esfuerzo en el campo. Contamos con presentaciones en:
            <br/><span className="font-semibold text-stone-700">Bolsas: 250g, 500g, 1kg | Tabletas: 100g, 200g, 500g | Frascos: 200g, 500g</span>
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-6xl mx-auto">
          {products.map((cat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="bg-stone-50 p-6 flex items-center gap-4 border-b border-stone-200">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-stone-100">{cat.icon}</div>
                <h3 className="font-bold text-xl text-stone-800">{cat.category}</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-6">
                  {cat.items.map((item, idx) => (
                    <li key={idx}>
                      <h4 className="font-bold text-stone-900 text-sm mb-1">{item.name}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
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
