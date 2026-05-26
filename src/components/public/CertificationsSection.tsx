"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";

interface CertData {
  title: string;
  image: string;
}

export default function CertificationsSection() {
  const [stopScroll, setStopScroll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState<CertData[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const newCardData: CertData[] = [];
          
          if (data.certImage1) newCardData.push({ image: data.certImage1, title: data.certTitle1 || "Certificación 1" });
          if (data.certImage2) newCardData.push({ image: data.certImage2, title: data.certTitle2 || "Certificación 2" });
          if (data.certImage3) newCardData.push({ image: data.certImage3, title: data.certTitle3 || "Certificación 3" });
          if (data.certImage4) newCardData.push({ image: data.certImage4, title: data.certTitle4 || "Certificación 4" });
          if (data.certImage5) newCardData.push({ image: data.certImage5, title: data.certTitle5 || "Certificación 5" });
          if (data.certImage6) newCardData.push({ image: data.certImage6, title: data.certTitle6 || "Certificación 6" });

          if (newCardData.length > 0) {
            // Aseguramos que hayan al menos 4 ítems repitiendo si es necesario para que el slider no se vea vacío
            const items = [...newCardData];
            while (items.length < 4) {
              items.push(items[items.length % newCardData.length]);
            }
            setCardData(items);
          }
        }
      } catch (error) {
        console.error("Error al cargar certificaciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="relative pt-12 pb-24 bg-transparent">
      <style>{`
          .marquee-inner {
              animation: marqueeScroll linear infinite;
          }

          @keyframes marqueeScroll {
              0% {
                  transform: translateX(0%);
              }

              100% {
                  transform: translateX(-50%);
              }
          }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Header Premium */}
        <motion.div
          className="text-center max-w-3xl mx-auto flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-bold uppercase tracking-widest mb-4">
            Reconocimientos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
            Nuestras Certificaciones
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            El compromiso con la calidad y el medio ambiente nos ha llevado a obtener los siguientes reconocimientos a nivel nacional e internacional.
          </p>
        </motion.div>
      </div>

      <div 
        className="overflow-hidden w-full relative max-w-7xl mx-auto min-h-[20rem]" 
        onMouseEnter={() => setStopScroll(true)} 
        onMouseLeave={() => setStopScroll(false)}
      >
          {loading ? (
            <div className="flex justify-center items-center h-[20rem]">
              <span className="text-stone-400">Cargando certificaciones...</span>
            </div>
          ) : cardData.length === 0 ? (
            <div className="flex justify-center items-center h-[20rem]">
              <span className="text-stone-400">No hay certificaciones publicadas.</span>
            </div>
          ) : (
            <>
              {/* Los degradados laterales usan el mismo color de fondo de la página (stone-50) para un efecto de desvanecimiento perfecto */}
              <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-stone-50 to-transparent" />
              
              <div className="marquee-inner flex w-fit" style={{ animationPlayState: stopScroll ? "paused" : "running", animationDuration: cardData.length * 2500 + "ms" }}>
                  <div className="flex">
                      {[...cardData, ...cardData].map((card, index) => (
                          <div key={index} className="w-64 sm:w-72 mx-4 h-[20rem] rounded-2xl overflow-hidden relative group hover:scale-95 transition-all duration-500 shadow-sm border border-stone-200 cursor-pointer bg-white">
                              <img src={card.image} alt={card.title} className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110" />
                              <div className="flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 absolute bottom-0 backdrop-blur-sm left-0 w-full h-full bg-stone-900/60">
                                  <p className="text-white text-xl font-bold text-center tracking-wide drop-shadow-md">{card.title}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
              
              <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-stone-50 to-transparent" />
            </>
          )}
      </div>
    </section>
  );
}
