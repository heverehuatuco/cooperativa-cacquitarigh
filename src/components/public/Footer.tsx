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
  tiktok: "https://www.tiktok.com",
  facebook: "https://www.facebook.com",
  youtube: "https://www.youtube.com",
  instagram: "https://www.instagram.com",
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
    <footer className="relative bg-white text-stone-900 border-t border-stone-200 py-12 md:py-16 overflow-hidden">
      
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Row: Logo & Navigation */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 pb-8 border-b border-stone-100">
          
          {/* Logo */}
          <div className="relative h-12 w-48 flex-shrink-0">
            <Image 
              src="/logocacquitari.webp" 
              alt="Cacquitari Logo" 
              fill 
              sizes="192px" 
              className="object-contain object-center lg:object-left" 
            />
          </div>
          
          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-stone-700">
            <Link href="/nosotros" className="hover:text-[#1a826e] transition-colors">NOSOTROS</Link>
            <Link href="/productos" className="hover:text-[#1a826e] transition-colors">PRODUCTOS</Link>
            <Link href="/contacto" className="hover:text-[#1a826e] transition-colors">CONTACTO</Link>
          </nav>
        </div>

        {/* Bottom Row: Contact Info & Socials */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 pt-8">
          
          {/* Contact Blocks (Horizontal wrap for compactness) */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-10 w-full lg:w-auto">
            
            {/* Address */}
            <div className="flex items-center gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a826e] flex items-center justify-center text-white flex-shrink-0 group-hover:bg-[#70f3be] group-hover:text-[#1a826e] transition-colors duration-300">
                <MapPin size={16} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] sm:text-xs font-bold text-stone-900 leading-tight">Dirección:</span>
                <span className="text-[11px] sm:text-xs text-stone-500 max-w-[140px] sm:max-w-[180px] truncate leading-tight">{info.address}</span>
              </div>
            </div>
            
            {/* WhatsApp */}
            <div className="flex items-center gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a826e] flex items-center justify-center text-white flex-shrink-0 group-hover:bg-[#70f3be] group-hover:text-[#1a826e] transition-colors duration-300">
                <Phone size={16} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] sm:text-xs font-bold text-stone-900 leading-tight">WhatsApp:</span>
                <span className="text-[11px] sm:text-xs text-stone-500 leading-tight">{info.whatsapp}</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a826e] flex items-center justify-center text-white flex-shrink-0 group-hover:bg-[#70f3be] group-hover:text-[#1a826e] transition-colors duration-300">
                <Mail size={16} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] sm:text-xs font-bold text-stone-900 leading-tight">Email:</span>
                <span className="text-[11px] sm:text-xs text-stone-500 leading-tight">{info.email}</span>
              </div>
            </div>
          </div>
          
          {/* Social Icons */}
          <div className="flex items-center justify-center gap-3 lg:ml-auto flex-shrink-0">
            {info.facebook && (
              <a href={info.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a826e] flex items-center justify-center text-white hover:bg-[#70f3be] hover:text-[#1a826e] hover:scale-110 transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            )}
            {info.tiktok && (
              <a href={info.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a826e] flex items-center justify-center text-white hover:bg-[#70f3be] hover:text-[#1a826e] hover:scale-110 transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
            )}
            
            {info.instagram && (
              <a href={info.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a826e] flex items-center justify-center text-white hover:bg-[#70f3be] hover:text-[#1a826e] hover:scale-110 transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            )}
{info.youtube && (
              <a href={info.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a826e] flex items-center justify-center text-white hover:bg-[#70f3be] hover:text-[#1a826e] hover:scale-110 transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            )}
          </div>
          
        </div>
      </div>
    </footer>
  );
}
