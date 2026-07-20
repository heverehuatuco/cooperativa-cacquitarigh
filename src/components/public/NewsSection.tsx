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
    <section id="noticias" className="pt-24 pb-32 relative overflow-hidden bg-[linear-gradient(90deg,#2a5420,#102721)] font-inter">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url('/cafesinfondo.png')",
          backgroundSize: "auto 110%", // Ocupa todo el alto (110% para que rebase ligeramente y se vea más natural)
          backgroundPosition: "right center", // Centrado verticalmente a la derecha
          backgroundRepeat: "no-repeat"
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-white leading-[1.2] lg:w-1/2 tracking-tight">
            Nuestras últimas <br className="hidden lg:block" />
            <span className="text-[#75a331]">noticias</span>
          </h2>
          <p className="text-white/80 lg:w-1/3 leading-relaxed text-sm md:text-base font-medium">
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
                className="bg-white rounded-3xl overflow-hidden flex flex-col h-full group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              >
                {/* Imagen superior (Edge to edge) */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] overflow-hidden bg-stone-100">
                  {art.imageUrl ? (
                    <Image
                      src={art.imageUrl}
                      alt={art.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">
                      Sin imagen
                    </div>
                  )}
                  {/* Overlay sutil al hacer hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </div>

                {/* Área de contenido */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col bg-white">
                  {/* Fecha (Contexto crucial para noticias) */}
                  <div className="flex items-center text-xs font-bold text-[#75a331] uppercase tracking-wider mb-3">
                    {art.date}
                  </div>
                  
                  {/* Título */}
                  <h3 className="text-xl font-extrabold text-stone-900 leading-tight mb-3 line-clamp-2 group-hover:text-[#2a5420] transition-colors duration-300">
                    {art.title}
                  </h3>
                  
                  {/* Extracto */}
                  <p className="text-stone-600 text-sm leading-relaxed line-clamp-3 mb-6">
                    {art.excerpt}
                  </p>
                  
                  {/* Footer / Llamado a la acción */}
                  <div className="mt-auto pt-5 flex items-center justify-center w-full">
                    <div className="rainbow-green relative w-full z-0 overflow-hidden p-[2px] flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-[1.02]">
                      <div className="flex items-center justify-center py-2.5 text-white font-bold w-full text-center text-sm bg-stone-900 rounded-full relative z-10 transition-colors duration-300 group-hover:bg-[#1a3014]">
                        Leer artículo
                      </div>
                    </div>
                  </div>
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
                      <Calendar size={12} className="text-[#2a5420]" />
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
                <p className="text-sm font-semibold text-stone-500 border-l-2 border-[#75a331] pl-3 italic">
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
