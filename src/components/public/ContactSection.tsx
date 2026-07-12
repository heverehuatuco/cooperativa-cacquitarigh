"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2, AlertCircle, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  instagram: string;
  youtube: string;
  locationImage?: string;
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
  instagram: "https://www.instagram.com",
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
      if (!formData.name || !formData.email || !formData.message) {
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
    <section id="contacto" className="relative pt-12 pb-12 lg:pt-20 lg:pb-20 bg-stone-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column - Form & Title */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center"
          >
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl sm:text-5xl lg:text-[48px] font-black text-stone-900 mb-4 leading-[1.1] tracking-tight">
                ¿Necesitas ayuda? <br className="hidden lg:block" />
                <span className="bg-gradient-to-r from-primary-brand to-secondary-brand bg-clip-text text-transparent">Contáctanos</span>
              </h2>
              <p className="text-stone-500 text-[15px] leading-relaxed max-w-md mx-auto lg:mx-0">
                Nos encantaría escuchar tus ideas, consultas o pedidos. Déjanos un mensaje y te responderemos lo más pronto posible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100">
              {/* Name */}
              <div className="space-y-2 relative">
                <label htmlFor="name" className="text-[13px] font-bold text-stone-700 block">
                  Nombre Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Ej. Carlos Huatuco"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 pr-12 rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-secondary-brand focus:ring-4 focus:ring-secondary-brand/10 text-[15px] text-stone-800 transition-all placeholder:text-stone-400"
                  />
                  <User className="w-5 h-5 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2 relative">
                <label htmlFor="email" className="text-[13px] font-bold text-stone-700 block">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="tu@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 pr-12 rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-secondary-brand focus:ring-4 focus:ring-secondary-brand/10 text-[15px] text-stone-800 transition-all placeholder:text-stone-400"
                  />
                  <Mail className="w-5 h-5 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2 relative">
                <label htmlFor="message" className="text-[13px] font-bold text-stone-700 block">
                  Mensaje
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="¿En qué te podemos ayudar?"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 pr-12 rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-secondary-brand focus:ring-4 focus:ring-secondary-brand/10 text-[15px] text-stone-800 resize-none transition-all placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Status Alert Panels */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-start space-x-2 text-[13px]"
                  >
                    <CheckCircle2 className="shrink-0 mt-0.5" size={16} />
                    <span>¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.</span>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start space-x-2 text-[13px]"
                  >
                    <AlertCircle className="shrink-0 mt-0.5" size={16} />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rainbow relative z-0 bg-gray-800 overflow-hidden p-[2px] flex items-center justify-center rounded-full hover:scale-[1.02] transition duration-300 active:scale-100 mt-2 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
              >
                <div className="w-full flex items-center justify-center space-x-2 text-white font-bold py-3.5 px-6 rounded-full bg-gray-900">
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <span className="text-[16px] tracking-wide">Enviar Mensaje</span>
                  )}
                </div>
              </button>

              <p className="text-[12px] text-stone-400 leading-relaxed mt-4 text-center">
                Entiendo que mis datos serán guardados de forma segura.
              </p>
            </form>
          </motion.div>

          {/* Right Column - Image & Info Container */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 order-1 lg:order-2 w-full h-full min-h-[450px] lg:min-h-[680px] relative rounded-[2.5rem] overflow-hidden shadow-2xl group"
          >
            {info.locationImage ? (
              <Image 
                src={info.locationImage} 
                alt="Nuestro Local" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000" 
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300"></div>
            )}
            
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>

            {/* Content inside Image */}
            <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-end">
              
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-2xl">
                
                {/* Location */}
                <a href={info.address2 || "#"} target="_blank" rel="noopener noreferrer" className="flex items-start gap-5 group/item">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary-brand group-hover/item:border-primary-brand transition-colors duration-300">
                    <MapPin className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Visítanos</h4>
                    <p className="text-white font-medium text-[15px] leading-relaxed group-hover/item:text-primary-brand-light transition-colors">
                      {info.address}
                    </p>
                  </div>
                </a>

                {/* Phone */}
                <a href={`https://wa.me/${info.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-5 group/item">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary-brand group-hover/item:border-primary-brand transition-colors duration-300">
                    <Phone className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Llámanos</h4>
                    <p className="text-white font-medium text-[15px] group-hover/item:text-primary-brand-light transition-colors">
                      +{info.whatsapp}
                      {info.whatsapp2 && <span className="block text-white/70 text-sm mt-0.5">Soporte: +{info.whatsapp2}</span>}
                    </p>
                  </div>
                </a>

                {/* Email */}
                <a href={`mailto:${info.email}`} className="flex items-start gap-5 group/item">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary-brand group-hover/item:border-primary-brand transition-colors duration-300">
                    <Mail className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Escríbenos</h4>
                    <p className="text-white font-medium text-[15px] group-hover/item:text-primary-brand-light transition-colors">
                      {info.email}
                    </p>
                  </div>
                </a>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
