"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

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
};

export default function Footer() {
  const [info, setInfo] = useState<CompanyInfo>(DEFAULT_INFO);

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
  }, []);

  return (
    <footer className="relative bg-primary-brand text-white border-t border-white/10 overflow-hidden">
      {/* Subtle modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex flex-col md:flex-row items-center md:items-center justify-between gap-8 md:gap-4">
        
        {/* Left Side: Logo & Copyright */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          {info.logoUrl ? (
            <div className="relative h-16 md:h-20 w-40 md:w-56 hover:scale-105 transition-transform duration-500">
              <Image src={info.logoUrl} alt="Cacquitari Logo" fill sizes="(max-width: 768px) 160px, 224px" className="object-contain object-center md:object-left" />
            </div>
          ) : (
            <span className="text-2xl font-black tracking-widest text-white drop-shadow-md">
              CACQUITARI
            </span>
          )}
          <p className="text-xs text-white/60 font-medium text-center md:text-left">
            &copy; {new Date().getFullYear()} CACQUITARI. Todos los derechos reservados.
          </p>
        </div>

        {/* Right Side: Certifications */}
        <div className="flex flex-col items-center md:items-end space-y-4">
          <h4 className="text-xs md:text-sm font-bold text-white tracking-[0.15em] uppercase opacity-90 text-center md:text-right">
            Certificaciones Internacionales
          </h4>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6">
             {[info.certImage1, info.certImage2, info.certImage3, info.certImage4, info.certImage5, info.certImage6]
              .filter(Boolean)
              .map((certUrl, idx) => (
                <div key={idx} className="relative h-16 md:h-20 w-16 md:w-20 hover:scale-110 hover:-translate-y-1 transition-all duration-300 drop-shadow-lg">
                  <Image src={certUrl as string} alt={`Certificación ${idx + 1}`} fill sizes="(max-width: 768px) 64px, 80px" className="object-contain" />
                </div>
              ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
