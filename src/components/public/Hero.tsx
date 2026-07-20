"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { ArrowRight, Star, Play } from "lucide-react";
import Link from "next/link";

interface FloatingItem {
  id: number;
  left: string;
  duration: number;
  delay: number;
  size: number;
  isCoffee: boolean;
  rotation: number;
}

export default function Hero() {
  const [cardImages, setCardImages] = useState({
    img2: "",
    img3: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCardImages({
            img2: data.heroCardImage2 || "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=800&auto=format&fit=crop",
            img3: data.heroCardImage3 || "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=400&auto=format&fit=crop"
          });
        }
      } catch (err) {
        console.error("Error al cargar imágenes del hero:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();

    // Generate floating items for the rain effect
    setFloatingItems(
      Array.from({ length: 40 }).map((_, i) => {
        // Use an average of two random numbers to cluster items towards the center (triangular distribution)
        const centerClusteredPosition = (Math.random() + Math.random()) / 2;
        return {
          id: i,
          left: `${centerClusteredPosition * 90 + 5}%`,
          duration: 10 + Math.random() * 20, // 10s to 30s fall time
          delay: Math.random() * 5, // 0 to 5s initial delay
          size: 30 + Math.random() * 50, // 30px to 80px size
          isCoffee: Math.random() > 0.5,
          rotation: Math.random() * 360,
        };
      })
    );
  }, []);

  return (
    <section className="relative w-full min-h-[100vh] flex items-center pt-24 pb-16 overflow-hidden bg-[linear-gradient(90deg,#2a5420,#102721)] font-inter">
      {/* Background Effect */}
      <div className="absolute inset-0 z-[30] pointer-events-none">


        {/* Floating Rain Effect */}
        {floatingItems.map((item) => (
          <motion.div
            key={item.id}
            className="absolute top-0 z-[1] opacity-80 pointer-events-none drop-shadow-2xl brightness-110"
            initial={{ y: "-20vh", rotate: item.rotation }}
            animate={{ y: "120vh", rotate: item.rotation + 180 }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ left: item.left }}
          >
            <div style={{ width: item.size, height: item.size, position: 'relative' }}>
              <Image
                src={item.isCoffee ? "/cafeilustracion.webp" : "/cacaoilustracion.webp"}
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        ))}

      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-0 flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[50%] flex flex-col items-start relative pt-12 pl-6 pr-16 md:pt-20 md:pl-16 md:pr-4 pb-4 lg:pb-12 z-20"
        >
          {/* Glowing Frame */}
          <div className="absolute top-0 left-0 w-[120%] h-[1px] bg-gradient-to-r from-white/40 to-transparent pointer-events-none"></div>
          <h1 className="text-6xl sm:text-7xl lg:text-[6.5rem] font-black leading-[1.05] tracking-tight font-outfit text-glow-sweep -ml-1">
            Cooperativa <br className="hidden lg:block" />Agraria Cafetalera Quitari Ltda
          </h1>
          <p className="mt-8 text-white/90 text-base md:text-lg lg:text-xl max-w-xl font-medium leading-relaxed drop-shadow-md">
            Nos dedicamos con pasión al acopio de café y cacao de la más alta calidad en el distrito de Pangoa-VRAEM, transformándolos en productos finales listos para deleitar tu paladar en cada taza.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <Link
              href="/productos"
              className="rainbow relative z-0 bg-white/15 overflow-hidden p-0.5 flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100 group shadow-xl"
            >
              <div className="flex items-center gap-4 pl-6 pr-2 py-2 text-white rounded-full font-bold bg-gray-900/80 backdrop-blur w-full text-center text-sm lg:text-base">
                Nuestros Productos
                <div className="bg-white text-gray-900 rounded-full p-2.5 flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Right Image Presentation (Premium Leaf / Stacked Glass) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-[50%] flex items-center justify-center lg:justify-end relative mt-2 lg:mt-0 z-0"
        >
          {/* Ambient Glowing Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] bg-[#75a331] rounded-full blur-[100px] lg:blur-[140px] opacity-30 pointer-events-none -z-20"></div>

          {/* Contenedor relativo centralizado para mantener el panel de fondo atado a la imagen en móviles */}
          <div className="relative lg:mr-10">
            {/* Glassmorphic Background Panel (Offset & Rotated) */}
            <div className="absolute top-[15px] left-[15px] lg:top-[25px] lg:left-[25px] w-full h-full rounded-[100px_24px_100px_24px] sm:rounded-[130px_30px_130px_30px] lg:rounded-[160px_30px_160px_30px] bg-white/5 backdrop-blur-2xl border border-white/20 -z-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] rotate-6"></div>
            
            {/* Main Image Container (Leaf Shape) */}
            <div className="relative w-[280px] h-[360px] sm:w-[380px] sm:h-[460px] lg:w-[480px] lg:h-[580px] rounded-[100px_24px_100px_24px] sm:rounded-[130px_30px_130px_30px] lg:rounded-[160px_30px_160px_30px] p-[8px] lg:p-[12px] bg-white/10 backdrop-blur-md shadow-2xl border border-white/30 group overflow-visible -rotate-3 transition-transform duration-700 hover:rotate-0 hover:scale-[1.02]">
              
              <div className="relative w-full h-full rounded-[92px_16px_92px_16px] sm:rounded-[122px_22px_122px_22px] lg:rounded-[148px_22px_148px_22px] overflow-hidden bg-[#2c4e33] shadow-inner">
                {!isLoading && cardImages.img2 ? (
                  <Image
                    src={cardImages.img2}
                    alt="Cultivo Cacquitari"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-[#406846] animate-pulse"></div>
                )}
                {/* Subtle lighting overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 mix-blend-overlay pointer-events-none"></div>
              </div>
              
            </div>
          </div>
        </motion.div>

      </div>

      {/* Premium Layered Wave Divider */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none">
        <svg 
          viewBox="0 0 1440 120" 
          className="relative block w-full h-[60px] md:h-[100px] lg:h-[130px]" 
          preserveAspectRatio="none"
        >
          {/* Capa trasera - más suave */}
          <path 
            d="M0,60 C240,120 480,0 720,20 C960,40 1200,100 1440,60 L1440,120 L0,120 Z" 
            fill="#fafaf9" 
            opacity="0.25"
          />
          {/* Capa media */}
          <path 
            d="M0,80 C320,140 420,20 720,60 C1020,100 1120,80 1440,40 L1440,120 L0,120 Z" 
            fill="#fafaf9" 
            opacity="0.5"
          />
          {/* Capa frontal sólida */}
          <path 
            d="M0,100 C280,120 500,60 720,80 C940,100 1160,110 1440,80 L1440,120 L0,120 Z" 
            fill="#fafaf9"
          />
        </svg>
      </div>
    </section>
  );
}
