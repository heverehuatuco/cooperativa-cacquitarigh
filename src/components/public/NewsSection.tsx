"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion as m, AnimatePresence as Ap } from "framer-motion";
import { Calendar, ArrowRight, X, Loader2 } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: any; // timestamp or string
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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"), limit(6));
        const querySnapshot = await getDocs(q);
        const fetchedNews: NewsArticle[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Formatear fecha si es Firebase Timestamp
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
    <section id="noticias" className="relative pt-8 pb-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <m.div
          className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-bold uppercase tracking-widest mb-4">
            Actualidad
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            Noticias y Actividades
          </h2>
        </m.div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-primary-brand mr-2" size={32} />
            <span className="text-stone-500">Cargando publicaciones...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {articles.map((art, idx) => (
              <m.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={art.id}
                className="bg-white rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-xl rounded-br-xl overflow-hidden shadow-sm border border-stone-100 flex flex-col justify-between hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group"
              >
                <div>
                  {/* Portada */}
                  <div className="h-56 w-full overflow-hidden bg-stone-200">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  </div>

                  {/* Body info */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center text-xs text-stone-500 space-x-2">
                      <Calendar size={14} className="text-tertiary-brand" />
                      <span>{art.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 line-clamp-2 hover:text-primary-brand transition-colors cursor-pointer" onClick={() => setActiveArticle(art)}>
                      {art.title}
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => setActiveArticle(art)}
                    className="inline-flex items-center space-x-1.5 text-sm font-bold text-primary-brand hover:text-primary-brand-light transition-colors group"
                  >
                    <span>Leer completo</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </m.article>
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
            className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4"
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
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[85vh] border border-stone-200 flex flex-col shadow-2xl"
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
                      <Calendar size={12} className="text-tertiary-brand" />
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
                <p className="text-sm font-semibold text-stone-500 border-l-2 border-primary-brand pl-3 italic">
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
