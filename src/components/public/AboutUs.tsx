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
      hoverClass: "hover:shadow-green-100 hover:border-green-300 hover:-translate-y-2"
    },
    {
      type: "Oportunidades",
      items: ["Demanda de mercado sostenible", "Expansión internacional", "Diversificación de portafolio", "Alianzas estratégicas"],
      icon: <TrendingUp size={28} />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      borderClass: "border-blue-100",
      hoverClass: "hover:shadow-blue-100 hover:border-blue-300 hover:-translate-y-2"
    },
    {
      type: "Debilidades",
      items: ["Limitaciones de recursos", "Dependencia del clima", "Alta competencia regional"],
      icon: <ArrowUpRight size={28} className="rotate-45" />,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      borderClass: "border-orange-100",
      hoverClass: "hover:shadow-orange-100 hover:border-orange-300 hover:-translate-y-2"
    },
    {
      type: "Amenazas",
      items: ["Cambios climáticos extremos", "Fluctuación de precios", "Nuevas regularizaciones"],
      icon: <Heart size={28} className="rotate-180" />,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      borderClass: "border-red-100",
      hoverClass: "hover:shadow-red-100 hover:border-red-300 hover:-translate-y-2"
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
    <section id="nosotros" className="relative pt-2 pb-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">



        {/* Historia Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 mt-6 lg:mt-8 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            Cooperativa Agraria Cafetalera Quitari Ltda.
          </h2>
        </div>

        {/* History Text & Images Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 mb-20 relative mt-10">

          {/* Left: Images */}
          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-full aspect-[4/5] md:aspect-square max-w-md mx-auto">
              {/* Decor */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-brand/20 rounded-full blur-3xl -z-10"></div>

              {/* Main Image */}
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-lg border border-stone-100">
                {aboutImageUrl1 ? <Image src={aboutImageUrl1} alt="Nosotros Fondo" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /> : <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-500 text-sm">Fondo</div>}
              </div>


            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            className="w-full lg:w-1/2 flex flex-col justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >

            <div className="space-y-4 text-stone-600 leading-relaxed text-[16px] sm:text-base text-justify">
              <p>
                Fundada el 02 de febrero del 2024 por un grupo de jóvenes productores en San Martin de Pangoa, Satipo Junín.
                Liderada por nuestro Gerente General, Samuel Kevin Taype Manrique, la cooperativa nació con una visión clara:
              </p>

              <blockquote className="p-4 border-l-4 border-primary-brand text-primary-brand font-medium italic my-6 bg-primary-brand/10 rounded-r-xl shadow-sm">
                "Mejorar las condiciones de vida de los productores de Pangoa, produciendo calidad de manera sostenible."
              </blockquote>

              <p>
                Hoy agrupamos a más de 200 jóvenes productores. Hemos implementado tecnologías de la información y alianzas especializadas de comercio justo.
              </p>
              <p>
                En su corta historia (2024) obtuvimos la certificación de café orgánico y en 2025 logramos exportar nuestro primer contenedor a Europa.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-10">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 flex flex-col hover:shadow-md transition-all duration-300"
              >
                <span className="text-3xl font-extrabold text-primary-brand mb-1">200+</span>
                <span className="text-[11px] sm:text-xs text-stone-500 font-bold uppercase tracking-widest">Socios Productores</span>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 flex flex-col hover:shadow-md transition-all duration-300"
              >
                <span className="text-3xl font-extrabold text-secondary-brand mb-1">2025</span>
                <span className="text-[11px] sm:text-xs text-stone-500 font-bold uppercase tracking-widest">Exportación Europa</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Estructura Organizacional */}
        <div className="mb-24 mt-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">Estructura Organizacional</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {estructura.map((area, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
                className={`group flex items-center gap-3 px-6 py-4 rounded-2xl border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl ${area.bg} ${area.border} ${area.hover}`}
              >
                <div className={`transition-colors duration-300 ${area.text} group-hover:text-white`}>
                  {area.icon}
                </div>
                <span className={`font-semibold transition-colors duration-300 text-stone-700 group-hover:text-white`}>
                  {area.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Análisis FODA */}
        <div className="mb-8 mt-16">
          <div className="text-center mb-12 flex flex-col items-center">

            <h3 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">Análisis FODA</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {foda.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`group bg-white p-6 xl:p-8 rounded-3xl shadow-sm border-2 transition-all duration-300 flex flex-col ${item.borderClass} ${item.hoverClass} hover:shadow-xl`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${item.iconBg} ${item.iconColor}`}>
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-stone-800 mb-4 tracking-tight">{item.type}</h4>
                <ul className="space-y-3 flex-grow">
                  {item.items.map((it, idx) => (
                    <li key={idx} className="flex items-start text-[15px] text-stone-600 leading-snug">
                      <span className={`mr-2.5 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.iconBg.replace('bg-', 'bg-').replace('100', '500')}`}></span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
