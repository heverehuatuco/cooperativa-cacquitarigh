"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Loader2, Coffee, Bean, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  const [activeCategory, setActiveCategory] = useState<string>("Todos");

  const getCategoryColor = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes("café") || c.includes("cafe")) return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", badge: "bg-green-100 text-green-800" };
    if (c.includes("cacao")) return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", badge: "bg-orange-100 text-orange-800" };
    if (c.includes("derivados")) return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", badge: "bg-purple-100 text-purple-800" };
    return { bg: "bg-stone-50", text: "text-stone-700", border: "border-stone-200", badge: "bg-stone-100 text-stone-800" };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetched: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Product;
          if (data.available) {
            fetched.push({ ...data, id: doc.id });
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



  return (
    <section id="productos" className="relative pt-2 lg:pt-8 pb-2 lg:pb-4 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-8 lg:mb-16 mt-4 lg:mt-6 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >

          <h2 className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Productos Quitari
          </h2>
        </motion.div>



        {/* Layout con Sidebar y Cuadrícula */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto">
          
          {/* Sidebar (Categorías) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100/50 sticky top-28">
              <h3 className="font-bold text-lg text-stone-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1a826e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Categorías
              </h3>
              
              <div className="space-y-3">
                <div className="group">
                  <button 
                    onClick={() => setActiveCategory("Todos")} 
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${activeCategory === "Todos" ? "bg-[#f2f7f0] shadow-sm border border-[#1a826e]/20" : "hover:bg-stone-50 border border-transparent"}`}
                  >
                    <h4 className={`font-bold flex items-center transition-colors ${activeCategory === "Todos" ? "text-[#1a826e]" : "text-stone-800 hover:text-[#1a826e]"}`}>
                      Todos los Productos
                    </h4>
                  </button>
                </div>
                <div className="w-full h-px bg-stone-100/50"></div>

                <div className="group">
                  <button 
                    onClick={() => setActiveCategory("Café")} 
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${activeCategory === "Café" ? "bg-green-50 shadow-sm border border-green-200/50" : "hover:bg-stone-50 border border-transparent"}`}
                  >
                    <h4 className={`font-bold mb-2 flex items-center gap-3 transition-colors ${activeCategory === "Café" ? "text-green-700" : "text-stone-800"}`}>
                      <div className="w-10 h-10 rounded-lg bg-green-200/50 flex items-center justify-center p-1.5 shadow-inner">
                        <Image src="/cafeilustracion.webp" alt="Café" width={32} height={32} className="object-contain drop-shadow-sm" />
                      </div>
                      Café
                    </h4>
                    <span className={`text-sm flex items-center gap-1 transition-colors pl-[52px] ${activeCategory === "Café" ? "text-green-600 font-medium" : "text-stone-500"}`}>
                      Ver todos los cafés
                    </span>
                  </button>
                </div>
                <div className="w-full h-px bg-stone-100/50"></div>
                
                <div className="group">
                  <button 
                    onClick={() => setActiveCategory("Cacao")} 
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${activeCategory === "Cacao" ? "bg-orange-50 shadow-sm border border-orange-200/50" : "hover:bg-stone-50 border border-transparent"}`}
                  >
                    <h4 className={`font-bold mb-2 flex items-center gap-3 transition-colors ${activeCategory === "Cacao" ? "text-orange-700" : "text-stone-800"}`}>
                      <div className="w-10 h-10 rounded-lg bg-orange-200/50 flex items-center justify-center p-1.5 shadow-inner">
                        <Image src="/cacaoilustracion.webp" alt="Cacao" width={32} height={32} className="object-contain drop-shadow-sm" />
                      </div>
                      Cacao
                    </h4>
                    <span className={`text-sm flex items-center gap-1 transition-colors pl-[52px] ${activeCategory === "Cacao" ? "text-orange-600 font-medium" : "text-stone-500"}`}>
                      Ver todos los cacaos
                    </span>
                  </button>
                </div>
                <div className="w-full h-px bg-stone-100/50"></div>
                
                <div className="group">
                  <button 
                    onClick={() => setActiveCategory("Derivados")} 
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${activeCategory === "Derivados" ? "bg-purple-50 shadow-sm border border-purple-200/50" : "hover:bg-stone-50 border border-transparent"}`}
                  >
                    <h4 className={`font-bold mb-2 flex items-center gap-3 transition-colors ${activeCategory === "Derivados" ? "text-purple-700" : "text-stone-800"}`}>
                      <div className="w-10 h-10 rounded-lg bg-purple-200/50 flex items-center justify-center p-1.5 shadow-inner">
                        <Image src="/productosilustracion.webp" alt="Derivados" width={32} height={32} className="object-contain drop-shadow-sm" />
                      </div>
                      Derivados
                    </h4>
                    <span className={`text-sm flex items-center gap-1 transition-colors pl-[52px] ${activeCategory === "Derivados" ? "text-purple-600 font-medium" : "text-stone-500"}`}>
                      Ver derivados
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid Area */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-[#1a826e] mr-2" size={32} />
                <span className="text-stone-500">Cargando productos...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
                {dbProducts
                  .filter(item => activeCategory === "Todos" || item.category.toLowerCase().includes(activeCategory.toLowerCase()))
                  .map((item, index) => {
                    const colors = getCategoryColor(item.category);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                      >
                        <Link href={`/productos/${item.id}`} className="group cursor-pointer flex flex-col h-full bg-[#1a826e] rounded-3xl p-3 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-2xl hover:shadow-[#1a826e]/40 hover:-translate-y-1 transition-all duration-300">
                          {/* Image Card */}
                          <div className={`w-full aspect-[4/5] bg-[#f2faf8] rounded-2xl overflow-hidden relative mb-4 flex items-center justify-center p-6 transition-colors duration-500`}>
                            {/* Inner shadow/glow for the image container */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#1a826e]/5 to-transparent pointer-events-none"></div>
                            
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-contain p-4 drop-shadow-md transition-transform duration-700 group-hover:scale-110 relative z-10"
                              />
                            ) : (
                              <div className="w-full h-full bg-stone-200/50 flex items-center justify-center rounded-xl text-stone-400 font-medium relative z-10">Sin imagen</div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex flex-col space-y-2 px-3 pb-3">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider self-start bg-[#70f3be] text-[#0d453a] shadow-sm`}>
                              {item.category}
                            </span>
                            <h4 className={`text-[17px] font-bold text-white tracking-tight transition-colors line-clamp-1 group-hover:text-[#70f3be]`}>
                              {item.name}
                            </h4>
                            <p className="text-sm text-white/80 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}

                {dbProducts.length === 0 && (
                  // MOCK PRODUCTS FALLBACK
                  <>
                    {(activeCategory === "Todos" || activeCategory === "Café") && (
                      <motion.div
                        className="group cursor-pointer flex flex-col h-full bg-[#1a826e] rounded-3xl p-3 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-2xl hover:shadow-[#1a826e]/40 hover:-translate-y-1 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <Link href={`/productos/mock-1`} className="flex flex-col h-full">
                          <div className={`w-full aspect-[4/5] bg-[#f2faf8] rounded-2xl overflow-hidden relative mb-4 flex items-center justify-center p-6`}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#1a826e]/5 to-transparent pointer-events-none"></div>
                            <div className="w-full h-full flex flex-col items-center justify-center text-[#1a826e]/50 relative z-10">
                              <Coffee size={32} className="mb-2" />
                              <span className="text-sm font-medium">Foto Demo</span>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 px-3 pb-3">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider self-start bg-[#70f3be] text-[#0d453a] shadow-sm`}>Café</span>
                            <h4 className={`text-[17px] font-bold text-white tracking-tight transition-colors line-clamp-1 group-hover:text-[#70f3be]`}>
                              Café Tostado Premium (Demo)
                            </h4>
                            <p className="text-sm text-white/80 line-clamp-2 leading-relaxed">
                              Haz clic aquí para ver cómo luce la página de detalles individual.
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                    
                    {(activeCategory === "Todos" || activeCategory === "Cacao") && (
                      <motion.div
                        className="group cursor-pointer flex flex-col h-full bg-[#1a826e] rounded-3xl p-3 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-2xl hover:shadow-[#1a826e]/40 hover:-translate-y-1 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Link href={`/productos/mock-2`} className="flex flex-col h-full">
                          <div className={`w-full aspect-[4/5] bg-[#f2faf8] rounded-2xl overflow-hidden relative mb-4 flex items-center justify-center p-6`}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#1a826e]/5 to-transparent pointer-events-none"></div>
                            <div className="w-full h-full flex flex-col items-center justify-center text-[#1a826e]/50 relative z-10">
                              <Bean size={32} className="mb-2" />
                              <span className="text-sm font-medium">Foto Demo</span>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 px-3 pb-3">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider self-start bg-[#70f3be] text-[#0d453a] shadow-sm`}>Cacao</span>
                            <h4 className={`text-[17px] font-bold text-white tracking-tight transition-colors line-clamp-1 group-hover:text-[#70f3be]`}>
                              Pasta de Cacao 100% (Demo)
                            </h4>
                            <p className="text-sm text-white/80 line-clamp-2 leading-relaxed">
                              Haz clic aquí para ver cómo luce la página de detalles individual.
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
