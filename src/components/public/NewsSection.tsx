"use client";

import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion as m, AnimatePresence as Ap } from "framer-motion";
import { Calendar, X, Loader2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: any;
}

const MOCK_NEWS: NewsArticle[] = [
  {
    id: "news-1",
    title: "Gran acopio de Cacao Fino de Aroma",
    excerpt: "Nuestros socios superaron las metas de acopio con una calidad excepcional.",
    content: "La COOPERATIVA AGRARIA CAFETALERA QUITARI LTDA culminó con gran éxito la campaña de acopio de cacao fino de aroma correspondiente a este periodo. Gracias al estricto seguimiento técnico brindado a las fincas asociadas, se ha logrado un grano con un porcentaje de fermentación óptimo de más del 85%, lo que garantiza notas frutales y florales muy cotizadas en los mercados especiales.\n\nEste logro representa una mejora directa en la retribución económica de los asociados, reafirmando el compromiso de Cacquitari de consolidar un modelo agrícola sustentable e inclusivo.",
    imageUrl: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=600",
    date: "12 de Octubre, 2024",
  },
  {
    id: "news-2",
    title: "Capacitación en Abonos Orgánicos",
    excerpt: "Apostando por la agricultura sostenible con biofertilizantes.",
    content: "Con el objetivo de seguir promoviendo una caficultura sostenible y de bajo impacto ambiental, Cacquitari llevó a cabo el Taller Práctico de Manejo y Elaboración de Abonos Orgánicos. La capacitación contó con la participación de más de 45 caficultores de Pangoa.\n\nDurante la jornada se enseñó a formular compostajes a partir de pulpa de café y recursos locales, reduciendo los costos de fertilización química y mejorando la estructura microbiológica del suelo. Estas acciones garantizan la salud de las fincas a largo plazo y la consistencia en el rendimiento por hectárea.",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600",
    date: "05 de Noviembre, 2024",
  },
];

export default function NewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"), limit(6));
        const querySnapshot = await getDocs(q);
        const fetchedNews: NewsArticle[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          let dateStr = data.date;
          if (data.date && typeof data.date.toDate === "function") {
            const dateObj = data.date.toDate();
            dateStr = dateObj.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
          }
          fetchedNews.push({ id: doc.id, ...data, date: dateStr } as NewsArticle);
        });

        if (fetchedNews.length === 0) {
          setArticles(MOCK_NEWS);
        } else {
          setArticles(fetchedNews);
        }
      } catch (error) {
        console.error("Error al cargar noticias:", error);
        setArticles(MOCK_NEWS);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section id="noticias" className="py-24 relative bg-white overflow-hidden">
      <style>{`
        .swiper-button-prev:after,
        .swiper-rtl .swiper-button-next:after {
            content: '' !important;
        }
        .swiper-button-next:after,
        .swiper-rtl .swiper-button-prev:after {
            content: '' !important;
        }
        .swiper-slide.swiper-slide-active {
            --tw-border-opacity: 1 !important;
            border-color: rgb(79 70 229 / var(--tw-border-opacity)) !important;
        }
        .swiper-slide.swiper-slide-active h3 {
            color: rgb(79 70 229) !important;
        }
        .swiper-pagination {
            position: relative;
            margin-top: 2rem;
        }
        .swiper-pagination-bullet-active {
            background-color: rgb(79 70 229) !important;
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center flex-col lg:flex-row lg:justify-between gap-8">
          
          <div className="w-full flex justify-between flex-col lg:w-2/5">
            <div className="block lg:text-left text-center">
              <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem] mb-5">
                Nuestras últimas <span className="text-indigo-600">noticias</span>
              </h2>
              <p className="text-gray-500 mb-10 max-lg:max-w-xl max-lg:mx-auto">
                Bienvenidos a nuestra sección de noticias, donde el conocimiento y la actualidad se encuentran. Explora nuestros logros, comunicados y tendencias en la cooperativa.
              </p>
            </div>
            
            {/* Slider controls */}
            <div className="flex items-center lg:justify-start justify-center lg:mt-0 mt-8 gap-8 mb-4">
              <button 
                onClick={() => swiperRef.current?.slidePrev()}
                className="group flex justify-center items-center border border-solid border-indigo-600 w-11 h-11 transition-all duration-500 rounded-full hover:bg-indigo-600"
              >
                <svg className="h-6 w-6 text-indigo-600 group-hover:text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.9999 12L4.99992 12M9.99992 6L4.70703 11.2929C4.3737 11.6262 4.20703 11.7929 4.20703 12C4.20703 12.2071 4.3737 12.3738 4.70703 12.7071L9.99992 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button 
                onClick={() => swiperRef.current?.slideNext()}
                className="group flex justify-center items-center border border-solid border-indigo-600 w-11 h-11 transition-all duration-500 rounded-full hover:bg-indigo-600"
              >
                <svg className="h-6 w-6 text-indigo-600 group-hover:text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12L19 12M14 18L19.2929 12.7071C19.6262 12.3738 19.7929 12.2071 19.7929 12C19.7929 11.7929 19.6262 11.6262 19.2929 11.2929L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="w-full lg:w-3/5 overflow-visible">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-indigo-600 mr-2" size={32} />
                <span className="text-stone-500">Cargando publicaciones...</span>
              </div>
            ) : (
              <Swiper
                modules={[Pagination]}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                slidesPerView={1}
                spaceBetween={20}
                loop={true}
                pagination={{ clickable: true }}
                breakpoints={{
                  568: { slidesPerView: 2, spaceBetween: 28 },
                  768: { slidesPerView: 2, spaceBetween: 28 },
                  1024: { slidesPerView: 2, spaceBetween: 32 },
                }}
                className="mySwiper w-full h-full pb-10"
              >
                {articles.map((art) => (
                  <SwiperSlide key={art.id} className="group">
                    <div className="flex items-center mb-6 h-56 w-full rounded-2xl overflow-hidden shadow-sm">
                      <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="flex items-center text-xs text-stone-400 space-x-2 mb-3">
                      <Calendar size={14} className="text-indigo-400" />
                      <span>{art.date}</span>
                    </div>
                    <h3 className="text-xl text-gray-900 font-medium leading-8 mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-gray-500 leading-6 transition-all duration-500 mb-6 line-clamp-3">
                      {art.excerpt}
                    </p>
                    <button 
                      onClick={() => setActiveArticle(art)}
                      className="cursor-pointer flex items-center gap-2 text-lg text-indigo-700 font-semibold"
                    >
                      Leer más
                      <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.25 6L13.25 6M9.5 10.5L13.4697 6.53033C13.7197 6.28033 13.8447 6.15533 13.8447 6C13.8447 5.84467 13.7197 5.71967 13.4697 5.46967L9.5 1.5" stroke="#4338CA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>

      {/* Article Detail Modal */}
      <Ap>
        {activeArticle && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveArticle(null)}
            className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
              aria-label="Cerrar noticia"
            >
              <X size={24} />
            </button>

            <m.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[85vh] border border-stone-200 flex flex-col shadow-2xl relative z-50"
            >
              {/* Cover */}
              <div className="h-64 w-full relative bg-stone-200 shrink-0">
                <img
                  src={activeArticle.imageUrl}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center text-xs text-stone-300 space-x-2">
                      <Calendar size={12} className="text-indigo-400" />
                      <span>{activeArticle.date}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                      {activeArticle.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
                <p className="text-sm font-semibold text-stone-500 border-l-2 border-indigo-600 pl-3 italic">
                  {activeArticle.excerpt}
                </p>
                <div className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {activeArticle.content}
                </div>
              </div>
            </m.div>
          </m.div>
        )}
      </Ap>
    </section>
  );
}
