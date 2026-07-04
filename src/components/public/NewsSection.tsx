"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion as m, AnimatePresence as Ap } from "framer-motion";
import { Calendar, X, Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";

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
    imageUrl: "https://images.unsplash.com/photo-1559825481-12a05cc00344?q=80&w=800&auto=format&fit=crop",
    date: "12 de Octubre, 2024",
  },
  {
    id: "news-2",
    title: "Capacitación en Abonos Orgánicos",
    excerpt: "Apostando por la agricultura sostenible con biofertilizantes.",
    content: "Con el objetivo de seguir promoviendo una caficultura sostenible y de bajo impacto ambiental, Cacquitari llevó a cabo el Taller Práctico de Manejo y Elaboración de Abonos Orgánicos. La capacitación contó con la participación de más de 45 caficultores de Pangoa.\n\nDurante la jornada se enseñó a formular compostajes a partir de pulpa de café y recursos locales, reduciendo los costos de fertilización química y mejorando la estructura microbiológica del suelo. Estas acciones garantizan la salud de las fincas a largo plazo y la consistencia en el rendimiento por hectárea.",
    imageUrl: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?q=80&w=800&auto=format&fit=crop",
    date: "05 de Noviembre, 2024",
  },
  {
    id: "news-3",
    title: "Renovación de Certificaciones",
    excerpt: "Mantenemos nuestros estándares de calidad internacional y comercio justo.",
    content: "Anunciamos con orgullo la renovación de nuestras principales certificaciones orgánicas y de comercio justo (Fairtrade).",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
    date: "20 de Noviembre, 2024",
  }
];

export default function NewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"), limit(3));
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
        } else if (fetchedNews.length < 3) {
           setArticles([...fetchedNews, ...MOCK_NEWS.slice(fetchedNews.length, 3)]);
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
    <section id="noticias" className="pt-16 pb-24 relative overflow-hidden bg-white">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/fondofoda.jpeg"
          alt="Fondo de Noticias"
          fill
          quality={100}
          className="object-cover object-center"
        />
        {/* Gradient Overlay: starts in white, fades to image color */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-[#1a231a]/70"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-stone-900 leading-[1.2] lg:w-1/2 tracking-tight">
            Nuestras últimas <br className="hidden lg:block"/>
            <span className="text-[#1a826e]">noticias</span>
          </h2>
          <p className="text-stone-600 lg:w-1/3 leading-relaxed text-sm md:text-base font-medium">
            Bienvenidos a nuestra sección de noticias, donde el conocimiento y la actualidad se encuentran. Explora nuestros logros, comunicados y tendencias en la cooperativa.
          </p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-stone-900 mr-2" size={32} />
            <span className="text-stone-500">Cargando publicaciones...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {articles.map((art) => (
              <div 
                key={art.id} 
                onClick={() => setActiveArticle(art)}
                className="bg-[#f7f8f7] rounded-[2rem] p-4 sm:p-5 flex flex-col h-full group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-stone-200"
              >
                {/* Card Top Text Area */}
                <div className="px-2 pt-4 pb-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-stone-900 leading-tight line-clamp-2">
                      {art.title}
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a826e] transition-colors duration-300">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
                
                {/* Card Bottom Image */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mt-auto shadow-sm">
                  {art.imageUrl ? (
                    <Image 
                      src={art.imageUrl} 
                      alt={art.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400 text-sm">
                      Sin imagen
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
                  {activeArticle.imageUrl && (
                    <Image
                      src={activeArticle.imageUrl}
                      alt={activeArticle.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 z-10">
                  <div className="space-y-1.5">
                    <div className="flex items-center text-xs text-stone-300 space-x-2">
                      <Calendar size={12} className="text-[#1a826e]" />
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
                <p className="text-sm font-semibold text-stone-500 border-l-2 border-[#1a826e] pl-3 italic">
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
