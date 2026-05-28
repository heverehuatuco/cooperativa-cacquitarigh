"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import Image from "next/image";

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
        className="overflow-hidden w-full relative max-w-6xl mx-auto select-none" 
      >
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="text-stone-400">Cargando certificaciones...</span>
            </div>
          ) : cardData.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <span className="text-stone-400">No hay certificaciones publicadas.</span>
            </div>
          ) : (
            <>
              {/* Degradado izquierdo */}
              <div className="absolute left-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-gradient-to-r from-stone-50 to-transparent" />
              
              <div className="marquee-inner flex will-change-transform min-w-[200%] w-fit" style={{ animationDuration: "15s" }}>
                  <div className="flex items-center">
                      {[...cardData, ...cardData].map((card, index) => (
                          <div key={index} className="relative w-40 sm:w-48 lg:w-56 h-20 sm:h-24 mx-6 sm:mx-10 opacity-80 hover:opacity-100 transition-opacity cursor-pointer filter grayscale hover:grayscale-0">
                            <Image 
                              src={card.image} 
                              alt={card.title} 
                              fill
                              sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 224px"
                              className="object-contain" 
                            />
                          </div>
                      ))}
                  </div>
              </div>
              
              {/* Degradado derecho */}
              <div className="absolute right-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-stone-50 to-transparent" />
            </>
          )}
      </div>
    </section>
  );
}
