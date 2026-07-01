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
    img1: "",
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
            // Force /fondohero.jpg for the background, ignoring database for now
            img1: "/fondohero.jpg",
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
    <section className="relative w-full min-h-[100vh] flex items-center pt-24 pb-16 overflow-hidden bg-[#1a231a]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {!isLoading && cardImages.img1 ? (
          <Image
            src={cardImages.img1}
            alt="Cacquitari Farm"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-stone-900 animate-pulse"></div>
        )}
        
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

        {/* Overlay gradient to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-[2]"></div>
        <div className="absolute inset-0 bg-black/40 md:hidden z-[2]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-0 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[55%] flex flex-col items-start"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black text-white leading-[1.05] tracking-tight drop-shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
            Cooperativa <br className="hidden lg:block"/>Agraria Cafetalera Cacquitari Ltda
          </h1>
          <p className="mt-6 text-white/90 text-base md:text-lg lg:text-xl max-w-xl font-medium leading-relaxed drop-shadow-md">
            Cultivamos con pasión, procesamos con altos estándares y llevamos el sabor más puro del VRAEM para que lo disfrutes en cada taza.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <Link
              href="/productos"
              className="flex items-center gap-4 bg-[#1a826e] text-white text-sm lg:text-base font-bold pl-6 pr-2 py-2 rounded-full hover:bg-[#219d85] transition-all shadow-xl group"
            >
              Nuestros Productos
              <div className="bg-white text-[#1a826e] rounded-full p-2.5 flex items-center justify-center transition-transform group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Right Cards */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-[45%] flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4 lg:gap-6 relative mt-10 lg:mt-32"
        >
          {/* Left Image Card with Play Button */}
          <div className="relative w-full max-w-[280px] sm:w-[260px] h-[220px] sm:h-[280px] rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer z-10 sm:translate-y-8">
            {!isLoading && cardImages.img2 ? (
              <Image 
                src={cardImages.img2}
                alt="Proceso"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-stone-300 animate-pulse"></div>
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 transition-transform group-hover:scale-110 shadow-lg">
                <Play className="w-6 h-6 text-white ml-1 fill-white drop-shadow-sm" />
              </div>
            </div>
          </div>

          {/* Right Dark Glass Card */}
          <div className="w-full max-w-[280px] sm:w-[280px] h-[220px] sm:h-[280px] glass-panel-dark rounded-[2rem] p-6 sm:p-8 flex flex-col justify-center shadow-2xl relative z-20 sm:-translate-x-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden relative flex-shrink-0 border-2 border-white/20">
                {!isLoading && cardImages.img3 ? (
                  <Image 
                    src={cardImages.img3}
                    alt="Icono"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-600 animate-pulse"></div>
                )}
              </div>
              <h3 className="text-white font-bold text-sm lg:text-base leading-tight mt-1">
                Calidad certificada en cada cosecha
              </h3>
            </div>
            <p className="text-white/70 text-xs sm:text-sm font-medium leading-relaxed">
              Nuestro compromiso es llevar los mejores granos de cacao y café desde las tierras del VRAEM hasta tu mesa, asegurando sostenibilidad y comercio justo.
            </p>
          </div>
        </motion.div>

      </div>

      {/* Impactful Layered Wave Divider */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none">
        <svg 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[100px] sm:h-[150px] lg:h-[250px]"
        >
          <path fill="#ffffff" fillOpacity="0.4" d="M0,128 C400,256 700,320 1100,256 C1300,224 1400,64 1440,0 L1440,320 L0,320 Z"></path>
          <path fill="#ffffff" fillOpacity="0.7" d="M0,192 C400,288 700,320 1100,288 C1300,256 1400,128 1440,64 L1440,320 L0,320 Z"></path>
          <path fill="#ffffff" d="M0,256 C400,320 700,320 1100,320 C1300,320 1400,192 1440,128 L1440,320 L0,320 Z"></path>
        </svg>
      </div>
    </section>
  );
}
