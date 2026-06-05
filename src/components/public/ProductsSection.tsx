"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Loader2, Coffee, Bean, Package } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  available: boolean;
}

export default function ProductsSection() {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetched: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Product;
          if (data.available) {
            fetched.push({ id: doc.id, ...data });
          }
        });
        setDbProducts(fetched);
      } catch (error) {
        console.error("Error al cargar productos de DB:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const products = [
    {
      category: "CAFÉ",
      icon: <Image src="/cafeilustracion.webp" alt="Café Ilustración" width={38} height={32} className="drop-shadow-md object-contain" />,
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
      icon: <Image src="/cacaoilustracion.webp" alt="Cacao Ilustración" width={32} height={32} className="drop-shadow-md object-contain" />,
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
      icon: <Image src="/productosilustracion.webp" alt="Derivados Ilustración" width={32} height={32} className="drop-shadow-md object-contain" />,
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

        {/* Modern E-commerce Gallery Grid */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
            Galería de Productos
          </h3>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-secondary-brand mr-2" size={32} />
            <span className="text-stone-500">Cargando productos...</span>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 px-4 sm:px-6">
            {dbProducts.map((item, index) => (
              <motion.div
                key={item.id}
                className="group cursor-pointer flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
              >
                {/* Image Card */}
                <div className="w-full aspect-[4/5] bg-[#f7f6f2] rounded-2xl overflow-hidden relative mb-4 flex items-center justify-center p-6 transition-colors group-hover:bg-[#f0efea]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-200 animate-pulse rounded-xl"></div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col space-y-1 px-1">
                  <h4 className="text-[15px] font-semibold text-stone-800 tracking-tight group-hover:text-secondary-brand transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-sm text-stone-500 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {dbProducts.length === 0 && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-10 text-stone-500">
                Próximamente agregaremos nuestros productos aquí.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
