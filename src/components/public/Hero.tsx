"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import EditableText from "@/components/ui/EditableText";

export default function Hero() {
  const [cardImages, setCardImages] = useState({
    bgImage: "",
    img1: "",
    img2: "",
    img3: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCardImages({
            bgImage: data.heroBgImage || "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=800&auto=format&fit=crop",
            img1: data.heroCardImage1 || "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=400&auto=format&fit=crop",
            img2: data.heroCardImage2 || "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=400&auto=format&fit=crop",
            img3: data.heroCardImage3 || "https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?q=80&w=400&auto=format&fit=crop"
          });
        }
      } catch (err) {
        console.error("Error al cargar imágenes del hero:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  const floatingImages = [
    { id: 1, src: '/cafeilustracion.webp', size: 55, duration: 15, delay: 0, left: '5%' },
    { id: 2, src: '/cacaoilustracion.webp', size: 65, duration: 18, delay: 3, left: '15%' },
    { id: 3, src: '/productosilustracion.webp', size: 50, duration: 12, delay: 6, left: '25%' },
    { id: 4, src: '/cafeilustracion.webp', size: 70, duration: 14, delay: 1, left: '35%' },
    { id: 5, src: '/cacaoilustracion.webp', size: 45, duration: 17, delay: 8, left: '45%' },
    { id: 6, src: '/cafeilustracion.webp', size: 60, duration: 13, delay: 2, left: '55%' },
    { id: 7, src: '/cacaoilustracion.webp', size: 75, duration: 16, delay: 5, left: '65%' },
    { id: 8, src: '/productosilustracion.webp', size: 55, duration: 14, delay: 7, left: '75%' },
    { id: 9, src: '/cafeilustracion.webp', size: 65, duration: 18, delay: 0, left: '85%' },
    { id: 10, src: '/cacaoilustracion.webp', size: 50, duration: 15, delay: 4, left: '95%' },
    { id: 11, src: '/cafeilustracion.webp', size: 55, duration: 12, delay: 9, left: '12%' },
    { id: 12, src: '/cacaoilustracion.webp', size: 60, duration: 17, delay: 2, left: '28%' },
    { id: 13, src: '/productosilustracion.webp', size: 45, duration: 14, delay: 6, left: '42%' },
    { id: 14, src: '/cafeilustracion.webp', size: 70, duration: 16, delay: 1, left: '58%' },
    { id: 15, src: '/cacaoilustracion.webp', size: 55, duration: 13, delay: 5, left: '72%' },
    { id: 16, src: '/cafeilustracion.webp', size: 65, duration: 18, delay: 8, left: '88%' },
  ];

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col lg:flex-row bg-transparent font-inter">
      {/* Fondo Fotográfico (80% a la derecha) */}
      <div className="absolute top-0 right-0 w-full lg:w-[80%] h-full z-0 overflow-hidden pointer-events-none">
        {!isLoading && cardImages.bgImage ? (
          <Image
            src={cardImages.bgImage}
            alt="Fondo Cacquitari"
            fill
            className="object-cover object-center"
            priority
          />
        ) : (
          <div className="w-full h-full bg-stone-200 animate-pulse"></div>
        )}
      </div>

      {/* Background Graphic Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[50%] bg-[#f4ebd0] rounded-full blur-[120px] opacity-40"></div>
      </div>

      {/* Alignment Container */}
      <div className="w-full h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pointer-events-none">
        {/* Left Column (Text) */}
        <div className="w-full lg:w-[65%] xl:w-[60%] pt-32 pb-16 pointer-events-auto relative">
          
          {/* Plant Illustration on Left - Smaller and aligned to the left */}
          <div className="absolute bottom-[-2%] left-[-25%] md:left-[-30%] lg:left-[-35%] w-[80%] sm:w-[70%] lg:w-[65%] xl:w-[55%] h-[65%] lg:h-[70%] z-0 pointer-events-none opacity-90 transition-transform duration-700">
            <Image 
              src="/plantacafe.png" 
              alt="Planta de café" 
              fill 
              className="object-contain object-left-bottom" 
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl relative z-10"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tight font-outfit -ml-1">
              <EditableText textKey="hero.title.1" defaultText="Cooperativa" className="text-[#657a55] block mb-1" />
              <EditableText textKey="hero.title.2" defaultText="Agraria" className="text-[#657a55] block mb-3" />
              <EditableText textKey="hero.title.3" defaultText="Cafetalera" className="text-[#1a3014]" /><br />
              <EditableText textKey="hero.title.4" defaultText="Quitari Ltda" className="text-[#1a3014]" />
            </h1>
            
            <div className="relative mt-8 max-w-xl">
              {/* Subtle glow behind text for perfect legibility without a harsh box */}
              <div className="absolute inset-0 bg-[#FDFBF7]/60 blur-xl -z-10 rounded-full"></div>
              <EditableText 
                textKey="hero.description" 
                defaultText="Nos dedicamos con pasión al acopio de café y cacao de la más alta calidad, transformándolo en el distrito de Pangoa-VRAEM para deleitar tu paladar en cada taza." 
                as="p" 
                className="text-gray-800 text-base md:text-lg lg:text-xl font-medium leading-relaxed"
                multiline={true} 
              />
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
              <Link
                href="/productos"
                className="rainbow-green relative z-0 bg-white/15 overflow-hidden p-0.5 flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100 group shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
              >
                <div className="flex items-center gap-4 pl-7 pr-2 py-1.5 text-white font-bold w-full text-center text-sm lg:text-base bg-gray-900/90 backdrop-blur rounded-full relative z-10">
                  <EditableText textKey="hero.button" defaultText="Nuestros Productos" />
                  <div className="bg-white text-[#274a21] rounded-full p-2.5 flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature Cards - Floating on the bottom edge of the entire Hero section */}
      <div className="absolute bottom-0 left-1/2 lg:left-auto lg:right-[15%] -translate-x-1/2 lg:translate-x-0 translate-y-1/2 z-30 flex flex-row justify-center gap-3 lg:gap-6 w-full lg:w-auto px-4 lg:px-0 pointer-events-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 100 }}
          className="flex flex-col items-center w-[130px] lg:w-[180px] transform hover:-translate-y-4 transition-transform duration-300 relative z-20 group"
        >
          {/* Imagen circular superior */}
          <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-[4px] border-white group-hover:border-[#75a331] transition-colors duration-300 shadow-lg z-10 bg-white">
            <Image 
              src={cardImages.img1} 
              alt="Calidad Certificada" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
          {/* Rectángulo blanco inferior */}
          <div className="w-full bg-white pt-14 pb-6 lg:pt-20 lg:pb-8 px-2 lg:px-4 rounded-[24px] lg:rounded-[35px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:shadow-[0_20px_50px_rgba(117,163,49,0.3)] transition-shadow duration-300 -mt-12 lg:-mt-16 relative z-0 flex flex-col items-center">
            <EditableText 
              textKey="hero.card1" 
              defaultText="CALIDAD<br/>CERTIFICADA" 
              className="text-[11px] lg:text-[13px] font-black text-center text-[#1a3014] group-hover:text-[#4b6d35] transition-colors duration-300 leading-tight uppercase tracking-wider block w-full"
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 100 }}
          className="flex flex-col items-center w-[130px] lg:w-[180px] transform hover:-translate-y-4 transition-transform duration-300 relative z-20 group"
        >
          <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-[4px] border-white group-hover:border-[#75a331] transition-colors duration-300 shadow-lg z-10 bg-white">
            <Image 
              src={cardImages.img2} 
              alt="Tradición" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
          <div className="w-full bg-white pt-14 pb-6 lg:pt-20 lg:pb-8 px-2 lg:px-4 rounded-[24px] lg:rounded-[35px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:shadow-[0_20px_50px_rgba(117,163,49,0.3)] transition-shadow duration-300 -mt-12 lg:-mt-16 relative z-0 flex flex-col items-center">
            <EditableText 
              textKey="hero.card2" 
              defaultText="TRADICIÓN Y<br/>SABOR" 
              className="text-[11px] lg:text-[13px] font-black text-center text-[#1a3014] group-hover:text-[#4b6d35] transition-colors duration-300 leading-tight uppercase tracking-wider block w-full"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, type: "spring", stiffness: 100 }}
          className="flex flex-col items-center w-[130px] lg:w-[180px] transform hover:-translate-y-4 transition-transform duration-300 relative z-20 group"
        >
          <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-[4px] border-white group-hover:border-[#75a331] transition-colors duration-300 shadow-lg z-10 bg-white">
            <Image 
              src={cardImages.img3} 
              alt="Pasión" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
          <div className="w-full bg-white pt-14 pb-6 lg:pt-20 lg:pb-8 px-2 lg:px-4 rounded-[24px] lg:rounded-[35px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:shadow-[0_20px_50px_rgba(117,163,49,0.3)] transition-shadow duration-300 -mt-12 lg:-mt-16 relative z-0 flex flex-col items-center">
            <EditableText 
              textKey="hero.card3" 
              defaultText="PASIÓN Y<br/>COMPROMISO" 
              className="text-[11px] lg:text-[13px] font-black text-center text-[#1a3014] group-hover:text-[#4b6d35] transition-colors duration-300 leading-tight uppercase tracking-wider block w-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Lluvia de imágenes - Sobre todos los componentes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[100]">
        {floatingImages.map((img) => (
          <motion.div
            key={img.id}
            className="absolute drop-shadow-2xl"
            style={{ left: img.left, width: img.size, height: img.size, top: '-20%' }}
            animate={{
              top: '120%',
              rotate: [0, 360],
            }}
            transition={{
              duration: img.duration,
              delay: img.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Image 
              src={img.src} 
              alt="Elemento flotante" 
              fill 
              className="object-contain opacity-90" 
            />
          </motion.div>
        ))}
      </div>

    </section>
  );
}

