"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface FloatingItem {
  id: number;
  left: string;
  duration: number;
  delay: number;
  size: number;
  isCoffee: boolean;
  rotation: number;
}

interface CompanyInfo {
  whatsapp: string;
  whatsapp2: string;
  email: string;
  email2: string;
  address: string;
  address2: string;
  tiktok: string;
  facebook: string;
  youtube: string;
  instagram: string;
  logoUrl?: string;
  certImage1?: string;
  certImage2?: string;
  certImage3?: string;
  certImage4?: string;
  certImage5?: string;
  certImage6?: string;
}

const DEFAULT_INFO: CompanyInfo = {
  whatsapp: "51915233460",
  whatsapp2: "",
  email: "contacto@cacquitari.org",
  email2: "",
  address: "San Jerónimo, Matzuriniari, Satipo, Junín, Perú",
  address2: "",
  tiktok: "",
  facebook: "",
  youtube: "",
  instagram: "",
};

export default function Footer() {
  const [info, setInfo] = useState<CompanyInfo>(DEFAULT_INFO);
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInfo({ ...DEFAULT_INFO, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error al cargar la información del pie de página:", error);
      }
    };
    fetchCompanyInfo();

    // Generate floating items for the rain effect
    setFloatingItems(
      Array.from({ length: 35 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 90 + 5}%`,
        duration: 8 + Math.random() * 12, // 8s to 20s fall time
        delay: Math.random() * 10, // 0 to 10s initial delay
        size: 30 + Math.random() * 50, // 30px to 80px size
        isCoffee: Math.random() > 0.5,
        rotation: Math.random() * 360,
      }))
    );
  }, []);

  return (
    <div className="w-full px-4 md:px-8 pt-6 md:pt-8 pb-6 md:pb-8 flex justify-center mt-auto relative z-20">
      <footer className="relative w-full max-w-7xl bg-white rounded-3xl lg:rounded-full px-6 py-6 lg:py-3 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-0 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        
        {/* Floating Rain Effect */}
        {floatingItems.map((item) => (
          <motion.div
            key={item.id}
            className="absolute top-0 z-[1] opacity-30 pointer-events-none"
            initial={{ y: "-20vh", rotate: item.rotation }}
            animate={{ y: "50vh", rotate: item.rotation + 180 }}
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

        {/* Logo */}
        <div className="relative z-10 flex-shrink-0">
          <Link href="/" className="relative flex items-center gap-2 md:gap-3">
            <div className="relative h-10 w-10 md:h-12 md:w-12 flex-shrink-0 bg-transparent rounded-full overflow-hidden flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image 
                  src="/logocacquitari.webp" 
                  alt="Cacquitari Logo" 
                  fill 
                  sizes="48px" 
                  className="object-contain" 
                />
              </div>
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight animate-shine-text">
              CAC QUITARI
            </span>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <nav className="relative z-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-10 text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase text-stone-800">
          <Link href="/nosotros" className="hover:text-[#1a826e] hover:scale-105 transition-all duration-300">NOSOTROS</Link>
          <Link href="/productos" className="hover:text-[#1a826e] hover:scale-105 transition-all duration-300">PRODUCTOS</Link>
          <Link href="/contacto" className="hover:text-[#1a826e] hover:scale-105 transition-all duration-300">CONTACTO</Link>
        </nav>

        {/* Social Icons */}
        <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4 flex-shrink-0">
          {info.facebook && info.facebook !== "#" && info.facebook.trim() !== "" && (
            <a href={info.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1a826e] flex items-center justify-center text-white shadow-lg shadow-[#1a826e]/40 hover:bg-[#70f3be] hover:text-[#1a826e] hover:scale-110 hover:shadow-[#70f3be]/60 transition-all duration-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          )}
          {info.tiktok && info.tiktok !== "#" && info.tiktok.trim() !== "" && (
            <a href={info.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1a826e] flex items-center justify-center text-white shadow-lg shadow-[#1a826e]/40 hover:bg-[#70f3be] hover:text-[#1a826e] hover:scale-110 hover:shadow-[#70f3be]/60 transition-all duration-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
            </a>
          )}
          {info.instagram && info.instagram !== "#" && info.instagram.trim() !== "" && (
            <a href={info.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1a826e] flex items-center justify-center text-white shadow-lg shadow-[#1a826e]/40 hover:bg-[#70f3be] hover:text-[#1a826e] hover:scale-110 hover:shadow-[#70f3be]/60 transition-all duration-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          )}
          {info.youtube && info.youtube !== "#" && info.youtube.trim() !== "" && (
            <a href={info.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1a826e] flex items-center justify-center text-white shadow-lg shadow-[#1a826e]/40 hover:bg-[#70f3be] hover:text-[#1a826e] hover:scale-110 hover:shadow-[#70f3be]/60 transition-all duration-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
