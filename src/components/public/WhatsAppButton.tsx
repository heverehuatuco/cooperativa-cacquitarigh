"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_INFO = {
  whatsapp: "51915233460",
  facebook: "",
  tiktok: "",
  youtube: "",
};

export default function WhatsAppButton() {
  const [info, setInfo] = useState(DEFAULT_INFO);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setInfo({
            whatsapp: data.whatsapp ? data.whatsapp.replace(/\D/g, "") : DEFAULT_INFO.whatsapp,
            facebook: data.facebook || "",
            tiktok: data.tiktok || "",
            youtube: data.youtube || "",
          });
        }
      } catch (error) {
        console.error("Error al cargar redes sociales:", error);
      }
    };
    fetchInfo();

    // Mostrar el popup de WhatsApp automáticamente después de 4 segundos
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem("wa-popup-dismissed");
      if (!dismissed) {
        setShowPopup(true);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = `https://wa.me/${info.whatsapp}?text=Hola%20Cacquitari,%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20productos.`;

  return (
    <>
      {/* WhatsApp Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed right-20 top-1/2 -translate-y-1/2 z-40 w-80 bg-white rounded-3xl border border-stone-200/60 shadow-2xl shadow-stone-900/10 overflow-hidden flex flex-col font-sans"
          >
            {/* Cabecera del popup */}
            <div className="bg-primary-brand text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <svg
                    className="w-5 h-5 fill-white"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                  </svg>
                  <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-xs leading-none">Asistente Cacquitari</h4>
                  <span className="text-[10px] text-stone-300 block mt-1">En línea</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPopup(false);
                  sessionStorage.setItem("wa-popup-dismissed", "true");
                }}
                className="p-1 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Cerrar"
              >
                <X size={16} />
              </button>
            </div>

            {/* Cuerpo del popup */}
            <div className="p-4 bg-stone-50 border-b border-stone-100 flex-grow">
              <div className="bg-white p-3.5 rounded-2xl rounded-tr-none shadow-xs border border-stone-200/30">
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  ¡Hola! 👋 ¿Tienes alguna duda sobre nuestro café o cacao especial? Escríbenos directamente.
                </p>
                <span className="text-[9px] text-stone-400 mt-1 block text-right font-medium">Justo ahora</span>
              </div>
            </div>

            {/* Footer con llamada a la acción */}
            <div className="p-3 bg-white">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setShowPopup(false);
                  sessionStorage.setItem("wa-popup-dismissed", "true");
                }}
                className="flex items-center justify-center space-x-1.5 bg-secondary-brand hover:bg-secondary-brand-light text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-sm cursor-pointer"
              >
                <span>Hablemos por WhatsApp</span>
                <Send size={12} className="rotate-45" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sidebar Icons */}
      <motion.div 
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {info.facebook && (
          <motion.a
            href={info.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Facebook"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </motion.a>
        )}

        {info.tiktok && (
          <motion.a
            href={info.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-black hover:bg-stone-900 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="TikTok"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M448 209.91a210.06 210.06 0 01-122.77-39.25V349.38A162.55 162.55 0 11185 188.31V278.2a74.62 74.62 0 1052.23 71.18V0l88 0a121.18 121.18 0 001.86 22.17h0A122.18 122.18 0 00381 102.39a121.43 121.43 0 0067 20.14Z" />
            </svg>
          </motion.a>
        )}

        {info.youtube && (
          <motion.a
            href={info.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#FF0000] hover:bg-[#E60000] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="YouTube"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </motion.a>
        )}

        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-secondary-brand hover:bg-secondary-brand-light text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Contactar por WhatsApp"
        >
          <svg
            className="w-7 h-7 fill-current"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
          </svg>
        </motion.a>
      </motion.div>
    </>
  );
}
