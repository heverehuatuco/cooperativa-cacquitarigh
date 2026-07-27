"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, ShieldCheck, Sprout, Network, BookOpen, Leaf, Heart, ArrowUpRight, Briefcase, Calculator, Globe, HeartHandshake, Lightbulb, Coffee, AlertCircle, AlertTriangle, Quote } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import EditableText from "@/components/ui/EditableText";

export default function AboutUs() {
  const [aboutImageUrl1, setAboutImageUrl1] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.aboutImageUrl1) setAboutImageUrl1(data.aboutImageUrl1);

          const certs = [];
          if (data.certImage1) certs.push(data.certImage1);
          if (data.certImage2) certs.push(data.certImage2);
          if (data.certImage3) certs.push(data.certImage3);
          if (data.certImage4) certs.push(data.certImage4);
          if (data.certImage5) certs.push(data.certImage5);
          if (data.certImage6) certs.push(data.certImage6);
          setCertifications(certs);
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
      icon: <ShieldCheck size={32} strokeWidth={1.5} />,
      accentColor: "bg-emerald-500",
      lightBg: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      type: "Oportunidades",
      items: ["Demanda de mercado sostenible", "Expansión internacional", "Diversificación de portafolio", "Alianzas estratégicas"],
      icon: <TrendingUp size={32} strokeWidth={1.5} />,
      accentColor: "bg-blue-500",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      type: "Debilidades",
      items: ["Limitaciones de recursos", "Dependencia del clima", "Alta competencia regional"],
      icon: <AlertCircle size={32} strokeWidth={1.5} />,
      accentColor: "bg-amber-500",
      lightBg: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      type: "Amenazas",
      items: ["Cambios climáticos extremos", "Fluctuación de precios", "Nuevas regularizaciones"],
      icon: <AlertTriangle size={32} strokeWidth={1.5} />,
      accentColor: "bg-rose-500",
      lightBg: "bg-rose-50",
      textColor: "text-rose-600",
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

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 lg:mt-32 mb-16 flex flex-col lg:flex-row items-center justify-between gap-12 flex-grow">

          {/* LEFT: Text, Button and Glassmorphism */}
          <div className="w-full lg:w-[55%] flex flex-col items-start gap-8">
            <h2 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold text-white tracking-tight leading-[1.05]">
              <EditableText textKey="about.title" defaultText="Cooperativa Agraria Cafetalera Quitari Ltda." />
            </h2>

            <div className="flex flex-col items-start">
              <EditableText
                textKey="about.description"
                defaultText="Fundada el 02 de febrero del 2024 por un grupo de jóvenes productores en San Martin de Pangoa, Satipo Junín. Hoy agrupamos a más de 200 jóvenes productores implementando tecnologías y alianzas de comercio justo."
                as="p"
                multiline={true}
                className="text-white/90 text-base lg:text-lg font-medium leading-relaxed mb-6 max-w-xl"
              />
              <a href="#nosotros-historia" className="rainbow relative z-0 bg-white/15 overflow-hidden p-0.5 inline-flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100 group shadow-lg">
                <div className="flex items-center gap-2 px-7 py-3 text-white rounded-full font-bold bg-gray-900/80 backdrop-blur w-full text-center text-sm">
                  <EditableText textKey="about.button" defaultText="Conoce Nuestra Historia" />
                  <div className="bg-white/20 rounded-full p-1 group-hover:bg-white group-hover:text-gray-900 transition-colors">
                    <ArrowUpRight className="w-4 h-4 rotate-45" />
                  </div>
                </div>
              </a>
            </div>

            {/* Glassmorphism Quote Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl max-w-lg shadow-2xl mt-4">
              <EditableText
                textKey="about.quote"
                defaultText='"Mejorar las condiciones de vida de los productores de Pangoa, produciendo calidad de manera sostenible."'
                as="p"
                multiline={true}
                className="text-white text-base md:text-lg font-medium italic leading-relaxed"
              />
              <EditableText
                textKey="about.quoteAuthor"
                defaultText="- Samuel Kevin, Gerente General"
                as="p"
                className="text-white font-bold text-sm mt-4 tracking-wide"
              />
            </div>
          </div>

          {/* RIGHT: Image */}
          <motion.div
            className="relative w-full lg:w-[45%] h-[50vh] sm:h-[60vh] lg:h-[650px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 mt-10 lg:mt-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {aboutImageUrl1 ? (
              <Image src={aboutImageUrl1} alt="Gerente General" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" />
            ) : (
              <div className="w-full h-full bg-stone-700 flex items-center justify-center text-stone-400">Fondo</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
          </motion.div>

        </div>
      </section>

      {/* --- HISTORIA SECTION (Text Cards) --- */}
      <section id="nosotros-historia" className="relative py-32 bg-stone-50 font-rubik overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="mb-16 max-w-3xl">
            <h2 className="text-sm font-bold text-[#2a5420] uppercase tracking-widest mb-3">
              Nuestro Origen
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight mb-6">
              Conoce Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a5420] to-[#77ab63]">Historia</span> y Visión
            </h3>
            <p className="text-stone-600 text-lg md:text-xl font-medium max-w-2xl">
              Desde nuestros inicios en San Martín de Pangoa hasta convertirnos en una cooperativa con calidad de exportación.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Left Column (8 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col gap-8">

              {/* Card 1 */}
              <motion.div
                className="relative bg-white rounded-[2rem] p-8 md:p-10 flex flex-col border border-stone-100 shadow-xl shadow-stone-200/40 hover:-translate-y-2 transition-transform duration-500 overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl group-hover:bg-emerald-100 transition-colors duration-500"></div>

                <div className="relative z-10 mb-8">
                  <h4 className="text-2xl font-extrabold text-stone-900 mb-1 tracking-tight">Samuel Kevin Taype</h4>
                  <p className="text-xs font-bold text-[#2a5420] uppercase tracking-widest">Gerente General</p>
                </div>

                <div className="relative z-10 mb-10 flex-grow">
                  <Quote className="w-10 h-10 text-emerald-200 mb-4 transform -scale-x-100" />
                  <p className="text-stone-600 text-lg md:text-xl leading-relaxed font-medium italic">
                    "Mejorar las condiciones de vida de los productores de Pangoa, produciendo calidad de manera sostenible."
                  </p>
                </div>

                <div className="relative z-10 flex items-center gap-4 pt-6 border-t border-stone-100">
                  <div className="bg-emerald-50 text-[#2a5420] p-3.5 rounded-2xl">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="block font-extrabold text-2xl md:text-3xl text-stone-900 leading-none mb-1">100%</span>
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Compromiso Total</span>
                  </div>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                className="relative bg-white rounded-[2rem] p-8 md:p-10 flex flex-col border border-stone-100 shadow-xl shadow-stone-200/40 hover:-translate-y-2 transition-transform duration-500 overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors duration-500"></div>

                <div className="relative z-10 mb-8">
                  <h4 className="text-2xl font-extrabold text-stone-900 mb-1 tracking-tight">Crecimiento y Alianzas</h4>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Desarrollo Cooperativo</p>
                </div>

                <div className="relative z-10 mb-10 flex-grow">
                  <Quote className="w-10 h-10 text-blue-200 mb-4 transform -scale-x-100" />
                  <p className="text-stone-600 text-lg md:text-xl leading-relaxed font-medium">
                    Hoy agrupamos a más de 200 jóvenes productores. Hemos implementado tecnologías de la información y alianzas especializadas de comercio justo.
                  </p>
                </div>

                <div className="relative z-10 flex items-center gap-4 pt-6 border-t border-stone-100">
                  <div className="bg-blue-50 text-blue-600 p-3.5 rounded-2xl">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="block font-extrabold text-2xl md:text-3xl text-stone-900 leading-none mb-1">200+</span>
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Socios Productores</span>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Right Column (5 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col">

              {/* Card 3 (Tall & Dark) */}
              <motion.div
                className="relative bg-stone-900 rounded-[2rem] p-8 md:p-10 flex flex-col h-full shadow-2xl overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {/* Background image with overlay */}
                <div className="absolute inset-0 z-0">
                  <Image src="/heroconocenos.jpg" alt="Fondo Inicios" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-b from-stone-900/90 via-stone-900/95 to-stone-900" />
                </div>

                <div className="relative z-10 mb-8">
                  <h4 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Nuestros Inicios</h4>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">San Martín de Pangoa, Satipo</p>
                </div>

                <div className="relative z-10 flex-grow mb-10">
                  <p className="text-stone-300 text-base md:text-lg leading-relaxed mb-6 font-medium">
                    Fundada el 02 de febrero del 2024 por un grupo de jóvenes productores en San Martin de Pangoa, Satipo Junín.
                  </p>
                  <p className="text-stone-300 text-base md:text-lg leading-relaxed mb-6 font-medium">
                    Liderada por nuestro Gerente General, la cooperativa nació con una visión clara de impulsar el desarrollo regional a través de la excelencia en el café.
                  </p>
                  <p className="text-white text-base md:text-lg leading-relaxed font-bold">
                    En su corta historia (2024) obtuvimos la certificación de café orgánico y en 2025 logramos exportar nuestro primer contenedor a Europa.
                  </p>

                  {/* Certificaciones */}
                  {certifications.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-stone-700/80">
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Certificaciones Internacionales</p>
                      <div className="flex flex-wrap gap-4 items-center">
                        {certifications.map((cert, idx) => (
                          <div key={idx} className="relative w-32 h-32 hover:scale-105 transition-all duration-300 bg-white rounded-2xl p-3 shadow-lg">
                            <Image src={cert} alt={`Certificación ${idx + 1}`} fill sizes="128px" className="object-contain p-3" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative z-10 flex items-center gap-4 mt-auto pt-6 border-t border-stone-700/80">
                  <div className="bg-emerald-500/20 text-emerald-400 p-3.5 rounded-2xl">
                    <Globe className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="block font-extrabold text-2xl md:text-3xl text-white leading-none mb-1">2025</span>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Exportación a Europa</span>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      {/* --- OTRAS SECCIONES (FODA) --- */}
      <section id="nosotros-foda" className="relative py-32 lg:py-40 bg-stone-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 flex flex-col items-center">
            <h3 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight">Análisis FODA</h3>
            <p className="text-stone-500 mt-4 max-w-2xl mx-auto text-sm md:text-base">Evaluamos constantemente nuestra posición estratégica para asegurar un crecimiento sostenible.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 max-w-7xl mx-auto">
            {foda.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative bg-white rounded-[2rem] p-8 flex flex-col hover:-translate-y-2 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-stone-100 overflow-hidden min-h-[400px]"
              >
                {/* Accent Top Bar */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${item.accentColor} opacity-80 group-hover:opacity-100 transition-opacity`}></div>

                {/* Icon */}
                <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${item.lightBg} ${item.textColor}`}>
                  {item.icon}
                </div>

                <h4 className="text-2xl font-extrabold text-stone-900 mb-6 tracking-tight relative z-10">{item.type}</h4>

                <ul className="space-y-4 flex-grow relative z-10">
                  {item.items.map((it, idx) => (
                    <li key={idx} className="flex items-start text-[15px] text-stone-600 font-medium leading-relaxed">
                      <span className={`mr-3 mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.accentColor}`}></span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>

                {/* Decorative background icon */}
                <div className={`absolute -bottom-8 -right-8 opacity-[0.03] transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 ${item.textColor} pointer-events-none`}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, { size: 180 })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
