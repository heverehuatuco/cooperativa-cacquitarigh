"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ContactSection() {
  const [info, setInfo] = useState<CompanyInfo>(DEFAULT_INFO);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInfo({ ...DEFAULT_INFO, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error al cargar info de contacto:", err);
      }
    };
    fetchCompanyInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      if (!formData.name || !formData.email || !formData.message || !formData.subject) {
        throw new Error("Por favor completa todos los campos obligatorios (*).");
      }

      // Guardar el mensaje en la colección "contacts" de Firestore
      await addDoc(collection(db, "contacts"), {
        ...formData,
        status: "unread",
        createdAt: new Date(), // Se guarda como objeto Date de JS que Firebase mapea a Timestamp
      });

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="relative pt-8 pb-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-bold uppercase tracking-widest mb-4">
            Canales de Atención
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Contáctate con{" "}
            <span className="bg-gradient-to-r from-primary-brand to-tertiary-brand bg-clip-text text-transparent">
              Nosotros
            </span>
          </h2>
          <p className="mt-3 text-stone-500 text-sm max-w-lg mx-auto">
            Estamos a tu servicio. Escríbenos, llámanos o visítanos directamente en la asociación.
          </p>
        </motion.div>

        {/* Contact info chips row */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* WhatsApp chip */}
          <a
            href={`https://wa.me/${info.whatsapp}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white border border-stone-200 hover:border-[#25D366]/50 hover:shadow-md px-5 py-3 rounded-2xl text-sm text-stone-700 transition-all duration-200"
          >
            <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#25D366"/>
              <path fill="#fff" d="M23.5 8.5A10.45 10.45 0 0 0 16 5.5C10.75 5.5 6.5 9.75 6.5 15a9.44 9.44 0 0 0 1.4 4.97L6.5 25.5l5.68-1.49A9.5 9.5 0 0 0 16 24.5c5.25 0 9.5-4.25 9.5-9.5a9.44 9.44 0 0 0-2-5.5zm-7.5 14.6a7.9 7.9 0 0 1-4.02-1.1l-.29-.17-2.99.78.8-2.91-.19-.3A7.87 7.87 0 0 1 8.1 15c0-4.36 3.55-7.9 7.9-7.9a7.9 7.9 0 0 1 7.9 7.9c0 4.36-3.54 7.9-7.9 7.9zm4.33-5.92c-.24-.12-1.4-.69-1.62-.77-.22-.08-.37-.12-.53.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1-.37-1.91-1.18-.71-.63-1.18-1.41-1.32-1.65-.14-.24-.01-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.29-.73-1.76-.19-.46-.39-.4-.53-.41h-.45c-.16 0-.42.06-.64.3-.22.24-.83.81-.83 1.98s.85 2.3.97 2.46c.12.16 1.68 2.56 4.06 3.59.57.24 1.01.39 1.35.5.57.18 1.09.15 1.5.09.46-.07 1.41-.58 1.61-1.13.2-.55.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28z"/>
            </svg>
            <div>
              <p className="text-xs text-stone-400 leading-none mb-0.5">WhatsApp</p>
              <p className="font-semibold text-stone-800">+{info.whatsapp}</p>
            </div>
          </a>

          {info.whatsapp2 && (
            <a
              href={`https://wa.me/${info.whatsapp2}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white border border-stone-200 hover:border-[#25D366]/50 hover:shadow-md px-5 py-3 rounded-2xl text-sm text-stone-700 transition-all duration-200"
            >
              <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#25D366"/>
                <path fill="#fff" d="M23.5 8.5A10.45 10.45 0 0 0 16 5.5C10.75 5.5 6.5 9.75 6.5 15a9.44 9.44 0 0 0 1.4 4.97L6.5 25.5l5.68-1.49A9.5 9.5 0 0 0 16 24.5c5.25 0 9.5-4.25 9.5-9.5a9.44 9.44 0 0 0-2-5.5zm-7.5 14.6a7.9 7.9 0 0 1-4.02-1.1l-.29-.17-2.99.78.8-2.91-.19-.3A7.87 7.87 0 0 1 8.1 15c0-4.36 3.55-7.9 7.9-7.9a7.9 7.9 0 0 1 7.9 7.9c0 4.36-3.54 7.9-7.9 7.9zm4.33-5.92c-.24-.12-1.4-.69-1.62-.77-.22-.08-.37-.12-.53.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1-.37-1.91-1.18-.71-.63-1.18-1.41-1.32-1.65-.14-.24-.01-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.29-.73-1.76-.19-.46-.39-.4-.53-.41h-.45c-.16 0-.42.06-.64.3-.22.24-.83.81-.83 1.98s.85 2.3.97 2.46c.12.16 1.68 2.56 4.06 3.59.57.24 1.01.39 1.35.5.57.18 1.09.15 1.5.09.46-.07 1.41-.58 1.61-1.13.2-.55.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28z"/>
              </svg>
              <div>
                <p className="text-xs text-stone-400 leading-none mb-0.5">WhatsApp 2</p>
                <p className="font-semibold text-stone-800">+{info.whatsapp2}</p>
              </div>
            </a>
          )}

          {/* Gmail chip */}
          <a
            href={`mailto:${info.email}`}
            className="flex items-center gap-3 bg-white border border-stone-200 hover:border-[#EA4335]/40 hover:shadow-md px-5 py-3 rounded-2xl text-sm text-stone-700 transition-all duration-200"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" className="w-8 h-8 shrink-0 object-contain" />
            <div>
              <p className="text-xs text-stone-400 leading-none mb-0.5">Correo Gmail</p>
              <p className="font-semibold text-stone-800">{info.email}</p>
            </div>
          </a>

          {/* Google Maps chip */}
          <div className="flex items-center gap-3 bg-white border border-stone-200 px-5 py-3 rounded-2xl text-sm text-stone-700">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" alt="Google Maps" className="w-8 h-8 shrink-0 object-contain" />
            <div>
              <p className="text-xs text-stone-400 leading-none mb-0.5">Dirección</p>
              <p className="font-semibold text-stone-800 max-w-[200px] truncate">{info.address}</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form - full width centered */}
        <div className="max-w-2xl mx-auto w-full">
          <motion.div
            className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/50 shadow-sm space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h3 className="text-2xl font-bold text-stone-900">Envíanos un Mensaje</h3>
              <p className="text-sm text-stone-500 mt-1">
                Completa el formulario y un asesor se pondrá en contacto contigo a la brevedad.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-bold text-stone-700 uppercase">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-800"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-bold text-stone-700 uppercase">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-xs font-bold text-stone-700 uppercase">
                    Teléfono Celular
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-800"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="subject" className="text-xs font-bold text-stone-700 uppercase">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-bold text-stone-700 uppercase">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-800 resize-none"
                />
              </div>

              {/* Status Alert Panels */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center space-x-2 text-sm"
                  >
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                    <span>¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.</span>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 flex items-center space-x-2 text-sm"
                  >
                    <AlertCircle className="text-red-500 shrink-0" size={18} />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex justify-center items-center space-x-2 bg-primary-brand hover:bg-primary-brand-light text-white font-bold py-3.5 px-6 rounded-2xl transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Enviando mensaje...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Enviar Formulario</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* CTA Banner */}
        <motion.div
          className="mt-20 w-full"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative w-full max-w-5xl mx-auto bg-gradient-to-bl from-primary-brand to-stone-950 rounded-2xl border border-primary-brand-light px-6 py-16 pb-18 flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-block bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6">
              <span className="text-stone-200 text-xs">Asociación de Productores APASAJEM</span>
            </div>

            <h2 className="text-3xl md:text-[40px] font-medium text-white mb-8 max-w-2xl leading-tight">
              Café y cacao de especialidad,<br className="hidden md:block" /> directo del productor al mundo.
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Primary button */}
              <a
                href={`https://wa.me/${info.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-stone-900 rounded-full px-6 py-3.5 text-sm flex items-center gap-2 hover:bg-stone-100 transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer font-medium"
              >
                Contáctanos ahora
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>

              {/* Secondary avatar button */}
              <a
                href="/nosotros"
                className="bg-white rounded-full p-1.5 pr-8 flex items-center gap-3 hover:bg-stone-100 transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
              >
                <img
                  src="/images/hero_background.png"
                  alt="APASAJEM campo"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="text-left flex flex-col justify-center gap-0.5">
                  <span className="text-xs text-stone-900 leading-tight">Conoce nuestra historia</span>
                  <span className="text-xs text-stone-900 font-medium leading-tight flex items-center gap-1">
                    Nosotros <span className="w-1.5 h-1.5 bg-secondary-brand rounded-full inline-block"></span>
                  </span>
                </div>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
