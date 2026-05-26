"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, ShieldCheck, Sprout, Network, BookOpen, Leaf, Heart, ArrowUpRight } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AboutUs() {
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

  const foda = [
    { type: "Fortalezas", items: ["Producción de alta calidad", "Sostenibilidad", "Fortalecimiento de la comunidad", "Innovación", "Compromiso con los productores"], color: "bg-green-100 text-green-700", icon: <ShieldCheck /> },
    { type: "Oportunidades", items: ["Crecimiento del mercado sostenible", "Nuevos mercados internacionales", "Diversificación de productos", "Alianzas estratégicas"], color: "bg-blue-100 text-blue-700", icon: <TrendingUp /> },
    { type: "Debilidades", items: ["Limitaciones de recursos", "Dependencia agrícola", "Competencia en el mercado"], color: "bg-orange-100 text-orange-700", icon: <ArrowUpRight className="rotate-45" /> },
    { type: "Amenazas", items: ["Cambios climáticos", "Fluctuaciones en precios internacionales", "Normativas y regularizaciones"], color: "bg-red-100 text-red-700", icon: <Heart className="rotate-180" /> },
  ];

  const impactos = [
    { title: "Mejora en la calidad de vida", desc: "Obtención de precio justo y estable, mejorando ingresos y bienestar." },
    { title: "Identidad cultural", desc: "Preservación de la diversidad de etnias culturales a través de prácticas sostenibles." },
    { title: "Empoderamiento de las mujeres", desc: "Capacitación y apoyo para mejorar su estatus y contribuir a sus familias." },
    { title: "Protección del medio ambiente", desc: "Prácticas sostenibles para preservar la biodiversidad y proteger recursos." },
    { title: "Acceso a mercados", desc: "Alianzas especializadas en comercio justo y sostenibilidad." },
  ];

  return (
    <section id="nosotros" className="relative pt-8 pb-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Historia Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-bold uppercase tracking-widest mb-4">
            Nuestra Historia
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            Cooperativa Agraria Cafetalera Quitari Ltda.
          </h2>
        </div>

        {/* History Text & Images Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 mb-20 relative">
          <motion.div 
            className="w-full lg:w-1/2 flex justify-center relative min-h-[400px]"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute top-0 left-0 w-3/4 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg z-0 border border-stone-100">
                {aboutImageUrl1 ? <img src={aboutImageUrl1} alt="Nosotros Fondo" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-500 text-sm">Fondo</div>}
              </div>
              <div className="absolute top-24 right-0 w-3/4 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl z-10 border-4 border-white">
                {aboutImageUrl2 ? <img src={aboutImageUrl2} alt="Nosotros Frente" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-500 text-sm">Frente</div>}
              </div>
            </div>
          </motion.div>

          <div className="px-4 md:px-0 w-full lg:w-1/2 text-stone-600 text-sm sm:text-base leading-relaxed space-y-4">
            <p>
              Fundada el <strong>02 de febrero del 2024</strong>, por un grupo de jóvenes productores de café y cacao, en el distrito de San Martin de Pangoa, Satipo Junín, Perú.
            </p>
            <p>
              Desde sus inicios, la cooperativa ha estado liderada por el Gerente General, <strong>Samuel Kevin Taype Manrique</strong>, quien ha sido fundamental en el crecimiento y éxito de la organización.
            </p>
            <p>
              Los jóvenes productores fundadores compartían un objetivo común: mejorar las condiciones de vida de los productores de Pangoa, produciendo productos de calidad de manera sostenible. Con esta visión, la cooperativa ha logrado atraer a más de 200 jóvenes productores de la región.
            </p>
            <p>
              Hemos implementado estrategias innovadoras utilizando tecnologías de la información y estableciendo alianzas de comercio justo. En su corta historia, en 2024 obtuvo la certificación de café orgánico y en 2025 logró exportar su primer contenedor de café a Europa.
            </p>
          </div>
        </div>

        {/* Estructura Organizacional */}
        <div className="mb-24 mt-20 lg:mt-40">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">Estructura Organizacional</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {["Gerencia", "Contabilidad", "Comercialización", "Talento Humano", "Sostenibilidad", "Innovación y Desarrollo", "Control de Calidad", "Producción"].map((area, i) => (
              <div key={i} className="bg-white border border-stone-200 shadow-sm rounded-xl px-6 py-4 font-medium text-stone-700 flex items-center gap-3">
                <Network className="text-primary-brand" size={20} />
                {area}
              </div>
            ))}
          </div>
        </div>

        {/* Impacto */}
        <div className="mb-24">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">Nuestro Impacto</h3>
            <p className="text-stone-500 mt-2">Transformando la vida de nuestros socios en la región</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {impactos.map((imp, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <Leaf className="text-secondary-brand mb-4" size={28} />
                <h4 className="font-bold text-stone-800 mb-2">{imp.title}</h4>
                <p className="text-sm text-stone-600">{imp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Análisis FODA */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">Análisis FODA</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {foda.map((section, idx) => {
              // Extract colors based on existing config
              let borderColor = "";
              let iconBg = "";
              let iconColor = "";
              
              if (section.type === "Fortalezas") {
                borderColor = "border-green-200";
                iconBg = "bg-green-100";
                iconColor = "text-green-600";
              } else if (section.type === "Oportunidades") {
                borderColor = "border-blue-200";
                iconBg = "bg-blue-100";
                iconColor = "text-blue-600";
              } else if (section.type === "Debilidades") {
                borderColor = "border-orange-200";
                iconBg = "bg-orange-100";
                iconColor = "text-orange-600";
              } else {
                borderColor = "border-red-200";
                iconBg = "bg-red-100";
                iconColor = "text-red-600";
              }

              return (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: idx * 0.1 }} 
                  className={`p-6 md:p-8 rounded-2xl border ${borderColor} bg-white flex flex-col items-center text-center transition-all hover:shadow-md cursor-pointer`}
                >
                  <div className={`w-14 h-14 rounded-full mb-5 flex items-center justify-center ${iconBg} ${iconColor}`}>
                    {section.icon}
                  </div>
                  <h4 className="font-bold text-[17px] text-stone-800 mb-3">{section.type}</h4>
                  <p className="text-[13px] text-stone-500 leading-relaxed">
                    {section.items.join(", ")}.
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
