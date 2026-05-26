"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Phone, Mail, MapPin } from "lucide-react";

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
}

const DEFAULT_INFO: CompanyInfo = {
  whatsapp: "51915233460",
  whatsapp2: "",
  email: "contacto@apasajem.org",
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
    <footer className="bg-primary-brand text-white border-t border-primary-brand-light shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Logo and Copyright */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          {info.logoUrl ? (
            <div className="bg-white/95 p-2 rounded-xl shadow-sm inline-block">
              <img src={info.logoUrl} alt="APASAJEM Logo" className="h-12 w-auto object-contain" />
            </div>
          ) : (
            <span className="text-2xl font-bold tracking-widest text-white drop-shadow-md">
              APASAJEM
            </span>
          )}
          <p className="text-xs text-white/80 font-medium">
            &copy; {new Date().getFullYear()} APASAJEM. Todos los derechos reservados.
          </p>
        </div>

        {/* Social Icons & Admin */}
        <div className="flex flex-col items-center md:items-end space-y-4">
          <div className="flex space-x-3">
            {info.facebook && (
              <a
                href={info.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1877F2] hover:bg-white text-white hover:text-[#1877F2] transition-all duration-300 flex items-center justify-center shadow-md"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            )}
            {info.tiktok && (
              <a
                href={info.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-black hover:bg-white text-white hover:text-black transition-all duration-300 flex items-center justify-center shadow-md"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M448 209.91a210.06 210.06 0 01-122.77-39.25V349.38A162.55 162.55 0 11185 188.31V278.2a74.62 74.62 0 1052.23 71.18V0l88 0a121.18 121.18 0 001.86 22.17h0A122.18 122.18 0 00381 102.39a121.43 121.43 0 0067 20.14Z" />
                </svg>
              </a>
            )}
            {info.youtube && (
              <a
                href={info.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#FF0000] hover:bg-white text-white hover:text-[#FF0000] transition-all duration-300 flex items-center justify-center shadow-md"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
