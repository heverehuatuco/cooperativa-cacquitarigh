"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Hero() {
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().heroImageUrl) {
          setHeroImageUrl(docSnap.data().heroImageUrl);
        } else {
          setHeroImageUrl("/images/hero_background.png");
        }
      } catch (err) {
        console.error("Error al cargar imagen del hero:", err);
        setHeroImageUrl("/images/hero_background.png");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeroImage();
  }, []);

  return (
    <section
      id="inicio"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#faf7f2] via-white to-[#e6cec8]/20 pt-28 pb-0 px-3 sm:px-10 flex flex-col items-center"
    >
      {/* Decorative Blur Blobs to add soft color dynamics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-secondary-brand/5 blur-[80px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-primary-brand/5 blur-[100px]" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-grow flex-col items-center max-w-7xl mx-auto w-full">
        {/* Top badge-button */}
        <motion.button
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => {
            window.location.href = "/nosotros";
          }}
          className="mt-12 mb-6 flex items-center space-x-2 border border-secondary-brand/60 text-secondary-brand text-xs font-semibold rounded-full px-4 pr-1.5 py-1.5 hover:bg-secondary-brand/5 transition duration-300 cursor-pointer shadow-xs"
          type="button"
        >
          <span>Conoce nuestra historia y labor en el campo</span>
          <span className="flex items-center justify-center w-6 h-6 p-1 rounded-full bg-secondary-brand">
            <svg
              width="14"
              height="11"
              viewBox="0 0 16 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 6.5h14M9.5 1 15 6.5 9.5 12"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </motion.button>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center text-stone-900 font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-3xl leading-tight tracking-tight"
        >
          Líderes en el cultivo de café y cacao{" "}
          <span className="text-secondary-brand">de especialidad</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 text-center text-stone-600 max-w-xl text-sm sm:text-base leading-relaxed"
        >
          Cosechamos y acopiamos el esfuerzo de nuestros productores en la Microcuenca San Jerónimo Matzuriniari, llevando el sabor más puro a tu mesa.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          onClick={() => {
            window.location.href = "/productos";
          }}
          className="mt-8 bg-primary-brand hover:bg-primary-brand-light text-white px-6 pr-2.5 py-2.5 rounded-full text-sm font-medium flex items-center space-x-2 transition shadow-md hover:shadow-lg cursor-pointer"
          type="button"
        >
          <span>Ver Productos</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.821 11.999h13.43m0 0-6.714-6.715m6.715 6.715-6.715 6.715"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>

        {/* Main Cover Image at the bottom */}
        <div className="w-full max-w-5xl mt-16 overflow-hidden rounded-[50px] rounded-b-none border border-b-0 border-stone-200/60 shadow-lg bg-stone-100 min-h-[18rem] sm:min-h-[24rem] md:min-h-[28rem] flex items-center justify-center">
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-4 w-24 bg-stone-200 rounded"></div>
            </div>
          ) : (
            <motion.img
              initial={{ opacity: 0, scale: 1.05, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
              className="h-72 sm:h-96 md:h-[28rem] w-full object-cover select-none"
              src={heroImageUrl}
              alt="APASAJEM Cultivo"
            />
          )}
        </div>
      </main>
    </section>
  );
}
