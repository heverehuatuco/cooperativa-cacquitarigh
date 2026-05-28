"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

export default function Hero() {
  const [cardImages, setCardImages] = useState({
    img1: "",
    img2: "",
    img3: ""
  });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCardImages(prev => ({
            img1: data.heroCardImage1 || prev.img1,
            img2: data.heroCardImage2 || prev.img2,
            img3: data.heroCardImage3 || prev.img3
          }));
        }
      } catch (err) {
        console.error("Error al cargar imágenes del hero:", err);
      }
    };
    fetchImages();
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-primary-brand pt-24 pb-20 flex flex-col items-center">
      
      {/* Topographic Background SVG (Inline for simplicity) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='topo' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 100 Q 25 50 50 100 T 100 100 M0 50 Q 25 0 50 50 T 100 50' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23topo)'/%3E%3C/svg%3E")`, backgroundSize: '400px 400px' }}></div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center mt-4">

        {/* Headlines */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-center max-w-4xl leading-tight tracking-tight drop-shadow-sm"
        >
          COOPERATIVA AGRARIA CAFETALERA QUITARI LTDA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-center text-white/90 text-sm md:text-base lg:text-lg max-w-2xl font-medium"
        >
          Cultivamos con pasión, procesamos con altos estándares y llevamos el sabor más puro del VRAEM para que lo disfrutes en cada taza.
        </motion.p>

        {/* Floating Cards Display */}
        <div className="mt-20 md:mt-32 relative w-full max-w-5xl h-[500px] flex justify-center items-center perspective-1000">

          {/* Card 1 (Left, Tilted Left) */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotate: -20 }}
            animate={{ opacity: 1, y: 20, rotate: -12 }}
            transition={{ type: "spring", stiffness: 80, delay: 0.6 }}
            className="absolute z-10 w-48 sm:w-64 md:w-72 bg-white p-3 md:p-4 rounded-2xl shadow-2xl border border-stone-100 hover:z-40 transition-transform hover:scale-105 left-2 sm:left-10 md:left-12 lg:left-8 top-12 sm:top-8"
          >
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="w-6 h-6 rounded-full bg-stone-200 overflow-hidden relative"></div>
              <span className="text-xs font-semibold text-stone-700">cacquitari_cacao</span>
            </div>
            <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 relative bg-stone-100">
              {cardImages.img1 ? <Image src={cardImages.img1} alt="Cacao" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : <div className="w-full h-full animate-pulse bg-stone-200"></div>}
            </div>
            <div className="flex items-center gap-2 px-1 mb-1">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-100 text-red-500 text-[10px]">❤️</span>
              <span className="text-[10px] font-medium text-stone-500">Apasíonate por el Cacao</span>
            </div>
          </motion.div>

          {/* Card 2 (Center, Straight, Elevated) */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: -40, rotate: 0 }}
            transition={{ type: "spring", stiffness: 80, delay: 0.8 }}
            className="absolute z-30 w-56 sm:w-72 md:w-80 bg-white p-3 md:p-4 rounded-2xl shadow-2xl border border-stone-100 hover:scale-105 transition-transform left-1/2 -translate-x-1/2 top-0"
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-stone-200 overflow-hidden relative"></div>
                <span className="text-xs font-semibold text-stone-700">cacquitari_cafe</span>
              </div>
              <span className="text-stone-400 tracking-widest text-[10px]">•••</span>
            </div>
            <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-stone-100 relative">
              {cardImages.img2 ? <Image src={cardImages.img2} alt="Coffee" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" priority /> : <div className="w-full h-full animate-pulse bg-stone-200"></div>}
            </div>
            <div className="flex items-center gap-3 px-1">
              <span className="text-stone-600">♡</span>
              <span className="text-stone-600">💬</span>
              <span className="text-stone-600">✈️</span>
            </div>
          </motion.div>

          {/* Card 3 (Right, Tilted Right) */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotate: 20 }}
            animate={{ opacity: 1, y: 30, rotate: 12 }}
            transition={{ type: "spring", stiffness: 80, delay: 0.7 }}
            className="absolute z-20 w-48 sm:w-64 md:w-72 bg-white p-3 md:p-4 rounded-2xl shadow-2xl border border-stone-100 hover:z-40 transition-transform hover:scale-105 right-2 sm:right-10 md:right-12 lg:right-8 top-16 sm:top-12"
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-stone-200 overflow-hidden relative"></div>
                <span className="text-xs font-semibold text-stone-700">cacquitari_vida</span>
              </div>
            </div>
            <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 relative bg-stone-100">
              {cardImages.img3 ? <Image src={cardImages.img3} alt="Life" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : <div className="w-full h-full animate-pulse bg-stone-200"></div>}
            </div>
            <div className="px-1 text-[10px] text-stone-500 font-medium leading-snug">
              Desarrollando la comunidad a través de la producción sostenible y comercio justo.
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
