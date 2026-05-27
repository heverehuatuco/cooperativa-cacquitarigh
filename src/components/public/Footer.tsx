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
    <footer className="bg-primary-brand text-white border-t border-primary-brand-light shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Logo and Copyright */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          {info.logoUrl ? (
            <div className="inline-block">
              <img src={info.logoUrl} alt="Cacquitari Logo" className="h-16 md:h-24 w-auto object-contain" />
            </div>
          ) : (
            <span className="text-2xl font-bold tracking-widest text-white drop-shadow-md">
              CACQUITARI
            </span>
          )}

          <p className="text-xs text-white/80 font-medium">
            &copy; {new Date().getFullYear()} CACQUITARI. Todos los derechos reservados.
          </p>
        </div>

        {/* Certifications (Right Side) */}
        <div className="flex flex-col items-center md:items-end space-y-3">
          <h4 className="text-sm md:text-base font-semibold text-amber-500 tracking-wide">
            Certificaciones Internacionales
          </h4>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6">
             {[info.certImage1, info.certImage2, info.certImage3, info.certImage4, info.certImage5, info.certImage6]
              .filter(Boolean)
              .map((certUrl, idx) => (
                <div key={idx} className="inline-flex items-center justify-center">
                  <img src={certUrl as string} alt={`Certificación ${idx + 1}`} className="h-16 md:h-20 w-auto object-contain" />
                </div>
              ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
