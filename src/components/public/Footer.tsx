"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
  certImage1?: string;
  certImage2?: string;
  certImage3?: string;
  certImage4?: string;
  certImage5?: string;
  certImage6?: string;
}

export default function Footer() {
  const [certs, setCerts] = useState<string[]>([]);
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as CompanyInfo;
          
          const extractedCerts: string[] = [];
          if (data.certImage1) extractedCerts.push(data.certImage1);
          if (data.certImage2) extractedCerts.push(data.certImage2);
          if (data.certImage3) extractedCerts.push(data.certImage3);
          if (data.certImage4) extractedCerts.push(data.certImage4);
          if (data.certImage5) extractedCerts.push(data.certImage5);
          if (data.certImage6) extractedCerts.push(data.certImage6);
          
          setCerts(extractedCerts);
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

  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full px-4 md:px-8 py-6 md:py-8 mt-auto z-20 flex justify-center">
      <footer className="relative w-full max-w-7xl bg-[#1a826e] rounded-[2.5rem] px-6 py-6 md:px-10 md:py-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-[#115e4f] overflow-hidden">
        
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

        {/* Left: Logo & Copyright */}
        <div className="relative z-10 flex flex-col items-center lg:items-start gap-3">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <div className="relative h-12 w-12 md:h-14 md:w-14 flex-shrink-0 bg-transparent rounded-full overflow-hidden flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image 
                  src="/logocacquitari.webp" 
                  alt="Cacquitari Logo" 
                  fill 
                  sizes="56px" 
                  className="object-contain" 
                />
              </div>
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight text-white">
              CAC QUITARI
            </span>
          </Link>
          <p className="text-white/80 text-[13px] md:text-sm font-medium tracking-wide text-center lg:text-left mt-1">
            © {currentYear} CAC QUITARI. Todos los derechos reservados.
          </p>
        </div>

        {/* Right: Certifications */}
        {certs.length > 0 && (
          <div className="relative z-10 flex flex-col items-center lg:items-end gap-3">
            <h3 className="text-white font-extrabold text-sm tracking-widest uppercase">
              Certificaciones Internacionales:
            </h3>
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3">
              {certs.map((cert, index) => (
                <div key={index} className="relative h-14 w-14 md:h-16 md:w-16 bg-white border border-white/20 rounded-2xl p-2 flex items-center justify-center shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-white/50 transition-all duration-300">
                  <div className="relative w-full h-full">
                    <Image 
                      src={cert} 
                      alt={`Certificación ${index + 1}`}
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </footer>
    </div>
  );
}
