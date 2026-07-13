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
      Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 90 + 5}%`,
        duration: 10 + Math.random() * 20, // 10s to 30s fall time
        delay: Math.random() * 5, // 0 to 5s initial delay
        size: 30 + Math.random() * 50, // 30px to 80px size
        isCoffee: Math.random() > 0.5,
        rotation: Math.random() * 360,
      }))
    );
  }, []);

  return (
    <section className="relative w-full min-h-[100vh] flex items-center pt-24 pb-16 overflow-hidden bg-[linear-gradient(90deg,#2a5420,#102721)] font-inter">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">


        {/* Floating Rain Effect */}
        {floatingItems.map((item) => (
          <motion.div
            key={item.id}
            className="absolute top-0 z-[1] opacity-40 pointer-events-none drop-shadow-2xl"
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
          className="w-full lg:w-[50%] flex flex-col items-start relative pt-12 pl-6 pr-16 md:pt-20 md:pl-16 md:pr-4 pb-12 z-20"
        >
          {/* Glowing L-Frame */}
          <div className="absolute top-0 left-0 w-[120%] h-[1px] bg-gradient-to-r from-white/40 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-[1px] h-[150%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
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

        {/* Right Image Circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-[50%] flex items-center justify-center lg:justify-end relative mt-24 lg:mt-0 z-0"
        >
          <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[620px] lg:h-[620px] rounded-full p-[6px] lg:p-[12px] bg-[#75a331] z-10 shadow-2xl flex-shrink-0 lg:mr-10">
            {/* Concentric Background Circles (perfectly centered behind image) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] md:w-[1300px] md:h-[1300px] rounded-full bg-[linear-gradient(90deg,#285120,#77ab63)] pointer-events-none -z-20"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] md:w-[900px] md:h-[900px] rounded-full bg-[linear-gradient(90deg,#285120,#3d602f)] pointer-events-none -z-10"></div>
            
            <div className="relative w-full h-full rounded-full border-[8px] lg:border-[16px] border-white overflow-hidden bg-[#2c4e33]">
              {!isLoading && cardImages.img2 ? (
              <Image
                src={cardImages.img2}
                alt="Proceso"
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
              ) : (
                <div className="w-full h-full bg-[#406846] animate-pulse"></div>
              )}
              <div className="absolute inset-0 bg-black/10 transition-colors"></div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Refined Rounded Zigzag / Wave Divider - Responsive */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none">
        <svg
          width="100%"
          height="30"
          className="relative block w-full h-[30px]"
        >
          <defs>
            <pattern id="zigzag" width="36" height="30" patternUnits="userSpaceOnUse">
              <path d="M 0,15 Q 9,-5 18,15 T 36,15 L 36,30 L 0,30 Z" fill="#fafaf9" />
            </pattern>
          </defs>
          <rect width="100%" height="30" fill="url(#zigzag)" />
        </svg>
      </div>
    </section>
  );
}
