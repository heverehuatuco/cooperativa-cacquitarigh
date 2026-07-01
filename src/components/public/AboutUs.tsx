"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, ShieldCheck, Sprout, Network, BookOpen, Leaf, Heart, ArrowUpRight, Briefcase, Calculator, Globe, HeartHandshake, Lightbulb, Coffee } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

export default function AboutUs() {
  const [aboutImageUrl1, setAboutImageUrl1] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.aboutImageUrl1) setAboutImageUrl1(data.aboutImageUrl1);
        }
      } catch (err) {
        console.error("Error al cargar imágenes de nosotros:", err);
      }
    };
    fetchSettings();
  }, []);

  const foda = [
    {
      type: "Fortalezas",
      items: ["Producción de alta calidad", "Prácticas sostenibles", "Fuerte lazo comunitario", "Innovación constante", "Compromiso total"],
      icon: <ShieldCheck size={28} />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      borderClass: "border-green-100",
    },
    {
      type: "Oportunidades",
      items: ["Demanda de mercado sostenible", "Expansión internacional", "Diversificación de portafolio", "Alianzas estratégicas"],
      icon: <TrendingUp size={28} />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      borderClass: "border-blue-100",
    },
    {
      type: "Debilidades",
      items: ["Limitaciones de recursos", "Dependencia del clima", "Alta competencia regional"],
      icon: <ArrowUpRight size={28} className="rotate-45" />,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      borderClass: "border-orange-100",
    },
    {
      type: "Amenazas",
      items: ["Cambios climáticos extremos", "Fluctuación de precios", "Nuevas regularizaciones"],
      icon: <Heart size={28} className="rotate-180" />,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      borderClass: "border-red-100",
    },
  ];

  const estructura = [
    { name: "Gerencia", icon: <Briefcase size={22} />, bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600", hover: "hover:bg-blue-600 hover:border-blue-600 hover:shadow-blue-200" },
    { name: "Contabilidad", icon: <Calculator size={22} />, bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600", hover: "hover:bg-emerald-600 hover:border-emerald-600 hover:shadow-emerald-200" },
    { name: "Comercialización", icon: <Globe size={22} />, bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-600", hover: "hover:bg-purple-600 hover:border-purple-600 hover:shadow-purple-200" },
    { name: "Talento Humano", icon: <HeartHandshake size={22} />, bg: "bg-pink-50", border: "border-pink-100", text: "text-pink-600", hover: "hover:bg-pink-600 hover:border-pink-600 hover:shadow-pink-200" },
    { name: "Sostenibilidad", icon: <Leaf size={22} />, bg: "bg-green-50", border: "border-green-100", text: "text-green-600", hover: "hover:bg-green-600 hover:border-green-600 hover:shadow-green-200" },
    { name: "Innovación y Desarrollo", icon: <Lightbulb size={22} />, bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-500", hover: "hover:bg-amber-500 hover:border-amber-500 hover:shadow-amber-200" },
    { name: "Control de Calidad", icon: <ShieldCheck size={22} />, bg: "bg-teal-50", border: "border-teal-100", text: "text-teal-600", hover: "hover:bg-teal-600 hover:border-teal-600 hover:shadow-teal-200" },
    { name: "Producción", icon: <Coffee size={22} />, bg: "bg-orange-50", border: "border-orange-100", text: "text-orange-600", hover: "hover:bg-orange-600 hover:border-orange-600 hover:shadow-orange-200" },
  ];

  return (
    <>
      {/* --- HERO SECTION --- */}
      <section id="nosotros-hero" className="relative pt-32 pb-16 min-h-[85vh] flex flex-col justify-end bg-stone-900">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/heroconocenos.jpg"
            alt="Fondo Nosotros Hero"
            fill
            quality={100}
            className="object-cover object-center"
          />
          {/* Gradient Overlay to make white text pop */}
          <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex-grow flex flex-col justify-end">
          
          {/* TOP ROW: Title and Text */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10">
            
            {/* LEFT: Title */}
            <div className="w-full lg:w-[55%]">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
                Cooperativa Agraria Cafetalera Quitari Ltda.
              </h2>
            </div>

            {/* RIGHT: Intro Text & Button */}
            <div className="w-full lg:w-[45%] lg:pl-10 flex flex-col items-start">
              <p className="text-white/90 text-base lg:text-lg font-medium leading-relaxed mb-6">
                Fundada el 02 de febrero del 2024 por un grupo de jóvenes productores en San Martin de Pangoa, Satipo Junín. Hoy agrupamos a más de 200 jóvenes productores implementando tecnologías y alianzas de comercio justo.
              </p>
              <a href="#nosotros-historia" className="bg-[#1a826e] hover:bg-[#219d85] text-white font-bold py-3 px-7 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group text-sm">
                Conoce Nuestra Historia
                <div className="bg-white/20 rounded-full p-1 group-hover:bg-white group-hover:text-[#1a826e] transition-colors">
                  <ArrowUpRight className="w-4 h-4 rotate-45" />
                </div>
              </a>
            </div>
          </div>

          {/* BOTTOM ROW: Large Image Card with Floating Badge */}
          <motion.div
            className="relative w-full h-[40vh] sm:h-[50vh] lg:h-[550px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Image */}
            {aboutImageUrl1 ? (
              <Image src={aboutImageUrl1} alt="Gerente General" fill sizes="(max-width: 1200px) 100vw, 1200px" className="object-cover object-center" />
            ) : (
              <div className="w-full h-full bg-stone-700 flex items-center justify-center text-stone-400">Fondo</div>
            )}

            {/* Floating Glassmorphism Quote Card (Bottom Left) */}
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white/20 backdrop-blur-xl border border-white/30 p-5 md:p-6 rounded-3xl max-w-xs md:max-w-md shadow-2xl">
              <div>
                <p className="text-white text-sm md:text-base font-semibold italic leading-snug">
                  "Mejorar las condiciones de vida de los productores de Pangoa, produciendo calidad de manera sostenible."
                </p>
                <p className="text-white/80 text-xs md:text-sm mt-2 font-bold tracking-wide">- Samuel Kevin, Gerente General</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* --- HISTORIA SECTION (Text Cards) --- */}
      <section id="nosotros-historia" className="relative py-24 bg-white font-rubik">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-14 max-w-2xl">
            <h2 className="text-[2.5rem] md:text-5xl font-extrabold text-stone-900 tracking-tight mb-2 leading-tight">
              Conoce Más Sobre <span className="text-stone-400">Nuestra Historia</span>
            </h2>
            <h3 className="text-[2.5rem] md:text-5xl font-extrabold text-stone-400 tracking-tight leading-tight">
              y Nuestra Visión
            </h3>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left Column */}
            <div className="flex flex-col gap-8">
              
              {/* Card 1 */}
              <motion.div 
                className="bg-[#F8F9FA] rounded-[2rem] p-10 flex flex-col h-full border border-stone-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-8">
                  <h4 className="text-xl font-extrabold text-stone-900 mb-1 tracking-tight">Samuel Kevin Taype</h4>
                  <p className="text-[15px] italic text-stone-500 font-medium">Gerente General</p>
                </div>
                
                <span className="text-5xl text-stone-900 font-sans leading-none h-6 block mb-5 italic font-black tracking-tighter">"</span>
                <p className="text-stone-600 text-[15px] md:text-base leading-relaxed mb-10 font-medium">
                  Mejorar las condiciones de vida de los productores de Pangoa, produciendo calidad de manera sostenible.
                </p>

                <div className="flex items-center gap-3 mt-auto pt-2">
                  <span className="font-extrabold text-3xl text-stone-900 tracking-tight">100%</span>
                  <span className="text-sm font-bold text-stone-500 uppercase tracking-wider">Compromiso</span>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                className="bg-[#F8F9FA] rounded-[2rem] p-10 flex flex-col h-full border border-stone-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mb-8">
                  <h4 className="text-xl font-extrabold text-stone-900 mb-1 tracking-tight">Crecimiento y Alianzas</h4>
                  <p className="text-[15px] italic text-stone-500 font-medium">Desarrollo Cooperativo</p>
                </div>
                
                <span className="text-5xl text-stone-900 font-sans leading-none h-6 block mb-5 italic font-black tracking-tighter">"</span>
                <p className="text-stone-600 text-[15px] md:text-base leading-relaxed mb-10 font-medium">
                  Hoy agrupamos a más de 200 jóvenes productores. Hemos implementado tecnologías de la información y alianzas especializadas de comercio justo.
                </p>

                <div className="flex items-center gap-3 mt-auto pt-2">
                  <span className="font-extrabold text-3xl text-stone-900 tracking-tight">200+</span>
                  <span className="text-sm font-bold text-stone-500 uppercase tracking-wider">Socios Productores</span>
                </div>
              </motion.div>

            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-8 h-full">
              
              {/* Card 3 (Tall) */}
              <motion.div 
                className="bg-[#F8F9FA] rounded-[2rem] p-10 border border-stone-100 flex flex-col h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="mb-8">
                  <h4 className="text-xl font-extrabold text-stone-900 mb-1 tracking-tight">Nuestros Inicios</h4>
                  <p className="text-[15px] italic text-stone-500 font-medium">San Martín de Pangoa, Satipo</p>
                </div>
                
                <span className="text-5xl text-stone-900 font-sans leading-none h-6 block mb-5 italic font-black tracking-tighter">"</span>
                <div className="flex-grow mb-10">
                  <p className="text-stone-600 text-[15px] md:text-base leading-relaxed mb-6 font-medium">
                    Fundada el 02 de febrero del 2024 por un grupo de jóvenes productores en San Martin de Pangoa, Satipo Junín. 
                  </p>
                  <p className="text-stone-600 text-[15px] md:text-base leading-relaxed mb-6 font-medium">
                    Liderada por nuestro Gerente General, la cooperativa nació con una visión clara de impulsar el desarrollo regional a través de la excelencia en el café.
                  </p>
                  <p className="text-stone-600 text-[15px] md:text-base leading-relaxed font-medium">
                    En su corta historia (2024) obtuvimos la certificación de café orgánico y en 2025 logramos exportar nuestro primer contenedor a Europa.
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-auto pt-2">
                  <span className="font-extrabold text-3xl text-stone-900 tracking-tight">2025</span>
                  <span className="text-sm font-bold text-stone-500 uppercase tracking-wider">Exportación a Europa</span>
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      {/* --- OTRAS SECCIONES (FODA) --- */}
      <section id="nosotros-foda" className="relative py-24 bg-[#1a231a] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/fondofoda.jpeg"
            alt="Fondo Análisis FODA"
            fill
            quality={100}
            className="object-cover object-center"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="bg-white/70 backdrop-blur-md px-10 py-4 rounded-full shadow-xl border border-white/50 inline-block">
              <h3 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight drop-shadow-sm">Análisis FODA</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 xl:gap-8 max-w-7xl mx-auto">
            {foda.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group bg-white/70 backdrop-blur-md p-4 sm:p-6 xl:p-8 rounded-[1.5rem] flex flex-col hover:-translate-y-2 transition-transform duration-300 border border-white/50 shadow-xl"
              >
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-105 shadow-sm ${item.iconBg} ${item.iconColor}`}>
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-stone-900 mb-4 tracking-tight">{item.type}</h4>
                <ul className="space-y-3 flex-grow">
                  {item.items.map((it, idx) => (
                    <li key={idx} className="flex items-start text-[15px] text-stone-900 font-medium leading-snug">
                      <span className={`mr-2.5 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.iconBg.replace('bg-', 'bg-').replace('100', '500')}`}></span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
