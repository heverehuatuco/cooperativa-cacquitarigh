"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Heart, Leaf, Users, Handshake, Lightbulb, UserCheck, BookOpen, Target, Eye } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AboutUs() {
  const [isExpanded, setIsExpanded] = useState(false);
  const values = [
    {
      icon: <Handshake className="text-secondary-brand" size={24} />,
      title: "Compromiso",
      desc: "Dedicación total al desarrollo y bienestar de nuestros productores y clientes.",
    },
    {
      icon: <Heart className="text-secondary-brand" size={24} />,
      title: "Calidad",
      desc: "Cuidamos rigurosamente cada grano para asegurar excelencia en nuestros productos.",
    },
    {
      icon: <ShieldCheck className="text-secondary-brand" size={24} />,
      title: "Transparencia",
      desc: "Garantizamos procesos claros y justos en el acopio, peso y valoración.",
    },
    {
      icon: <Leaf className="text-secondary-brand" size={24} />,
      title: "Sostenibilidad",
      desc: "Promovemos prácticas agrícolas respetuosas con el medio ambiente.",
    },
    {
      icon: <Users className="text-secondary-brand" size={24} />,
      title: "Solidaridad",
      desc: "Brindamos apoyo mutuo para el crecimiento conjunto de nuestra comunidad.",
    },
    {
      icon: <Lightbulb className="text-secondary-brand" size={24} />,
      title: "Innovación",
      desc: "Buscamos constantemente mejorar nuestras técnicas de cultivo y procesamiento.",
    },
    {
      icon: <UserCheck className="text-secondary-brand" size={24} />,
      title: "Respeto",
      desc: "Valoramos profundamente el trabajo de nuestros agricultores y nuestro entorno natural.",
    },
  ];

  const [aboutImageUrl1, setAboutImageUrl1] = useState("");
  const [aboutImageUrl2, setAboutImageUrl2] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.aboutImageUrl1) setAboutImageUrl1(data.aboutImageUrl1);
          if (data.aboutImageUrl2) setAboutImageUrl2(data.aboutImageUrl2);
        }
      } catch (err) {
        console.error("Error al cargar imágenes de nosotros:", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section id="nosotros" className="relative pt-8 pb-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-bold uppercase tracking-widest mb-4">
            Nuestra Asociación
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            Quiénes Somos
          </h2>
        </div>

        {/* History and Image Flex Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 mb-20 relative">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-violet-400/10 blur-3xl rounded-full pointer-events-none" />

          {/* Staggered Images */}
          <motion.div 
            className="w-full lg:w-1/2 flex justify-center relative min-h-[400px] lg:min-h-[500px]"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Back Image (Top Left) */}
              <div className="absolute top-0 left-0 w-3/4 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg z-0 border border-stone-100">
                {aboutImageUrl1 ? (
                  <img src={aboutImageUrl1} alt="Nosotros Fondo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-500 text-sm">Fondo</div>
                )}
              </div>
              
              {/* Front Image (Bottom Right) */}
              <div className="absolute top-24 right-0 w-3/4 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl z-10 border-4 border-white">
                {aboutImageUrl2 ? (
                  <img src={aboutImageUrl2} alt="Nosotros Frente" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-500 text-sm">Frente</div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Cards Stack */}
          <div className="space-y-6 px-4 md:px-0 w-full lg:w-1/2">
            
            {/* Historia (Card 1 - Violet Active Style) */}
            <motion.div 
              className="flex items-start rounded-xl py-4 pr-4 gap-6 max-w-md bg-violet-100 border border-violet-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-4 ml-4 shrink-0">
                <BookOpen color="#7F22FE" size={28} />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold text-slate-700">Nuestra Historia</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Fundada el 28 de septiembre de 2015 por 71 productores de la cuenca Los Ángeles de Edén.
                </p>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-slate-600 leading-relaxed overflow-hidden"
                    >
                      Buscamos el respaldo del Estado y otras instituciones para optimizar nuestra producción, logrando el acceso a mercados internacionales con certificaciones globales.
                    </motion.p>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[#7F22FE] font-bold text-xs hover:text-violet-700 transition-colors focus:outline-none mt-1"
                >
                  {isExpanded ? "Leer menos" : "Leer más..."}
                </button>
              </div>
            </motion.div>

            {/* Misión (Card 2 - Green Style) */}
            <motion.div 
              className="flex items-start rounded-xl py-4 pr-4 gap-6 max-w-md bg-white hover:bg-stone-50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-4 ml-4 shrink-0">
                <Target color="#00A63E" size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-700">Misión</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Producir y comercializar café y cacao de calidad, promoviendo el desarrollo sostenible y el bienestar de nuestros socios y comunidades.
                </p>
              </div>
            </motion.div>

            {/* Visión (Card 3 - Orange Style) */}
            <motion.div 
              className="flex items-start rounded-xl py-4 pr-4 gap-6 max-w-md bg-white hover:bg-stone-50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-4 ml-4 shrink-0">
                <Eye color="#F54900" size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-700">Visión</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ser una asociación reconocida por la excelencia de nuestro café y cacao, generando desarrollo económico, social y ambiental de manera sostenible.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Values Section */}
        <div className="pt-20 flex flex-col items-center">
          <div className="w-full mb-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
              Nuestros Valores Fundamentales
            </h3>
          </div>

          {/* Features Grid with Borders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl w-full border-t border-l border-stone-200">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="relative p-6 md:p-8 flex flex-col gap-4 border-r border-b border-stone-200 transition-all duration-300 cursor-pointer bg-white hover:bg-gradient-to-b hover:from-white hover:to-secondary-brand/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="text-secondary-brand bg-secondary-brand/10 p-2 rounded-lg">
                    {v.icon}
                  </div>
                  <h4 className="text-sm font-medium text-stone-800 leading-snug">
                    {v.title}
                  </h4>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
