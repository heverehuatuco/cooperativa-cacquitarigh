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
  youtube: string;
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
    <section id="contacto" className="relative pt-12 pb-6 lg:pt-16 lg:pb-8 bg-transparent font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">

          {/* Left Column - Text & Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:pr-10"
          >


            {/* Title */}
            <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-stone-900 mb-8 lg:mb-12 leading-[1.15] tracking-tight">
              ¿Necesitas ayuda? <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary-brand to-secondary-brand bg-clip-text text-transparent">¡Contáctanos!</span>
            </h2>

            {/* Vertical Contact Info Blocks */}
            <div className="space-y-6 lg:space-y-10">

              {/* Location Block */}
              {info.address2 ? (
                <a
                  href={info.address2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 p-5 rounded-3xl bg-blue-50/60 border border-blue-100/80 hover:bg-blue-100/50 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center relative group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <Image src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" alt="Google Maps" width={32} height={32} className="object-contain drop-shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-base lg:text-lg mb-1 group-hover:text-blue-600 transition-colors">¿Listo para visitarnos?</h4>
                    <p className="text-[15px] text-stone-600 leading-relaxed">
                      {info.address}
                    </p>
                  </div>
                </a>
              ) : (
                <div className="group flex items-center gap-5 p-5 rounded-3xl bg-blue-50/60 border border-blue-100/80 hover:bg-blue-100/50 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center relative group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <Image src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" alt="Google Maps" width={32} height={32} className="object-contain drop-shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-base lg:text-lg mb-1 group-hover:text-blue-600 transition-colors">¿Listo para visitarnos?</h4>
                    <p className="text-[15px] text-stone-600 leading-relaxed">
                      {info.address}
                    </p>
                  </div>
                </div>
              )}

              {/* Phone Block */}
              <a
                href={`https://wa.me/${info.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 p-5 rounded-3xl bg-green-50/60 border border-green-100/80 hover:bg-green-100/50 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center relative group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width={36} height={36} className="object-contain drop-shadow-sm" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base lg:text-lg mb-1 group-hover:text-green-600 transition-colors">¡No dudes en comunicarte!</h4>
                  <p className="text-[15px] text-stone-600 leading-relaxed">
                    WhatsApp: <span className="font-semibold text-stone-800">+{info.whatsapp}</span><br />
                    {info.whatsapp2 && <span>Soporte: <span className="font-semibold text-stone-800">+{info.whatsapp2}</span></span>}
                  </p>
                </div>
              </a>

              {/* Email Block */}
              <a
                href={`mailto:${info.email}`}
                className="group flex items-center gap-5 p-5 rounded-3xl bg-red-50/60 border border-red-100/80 hover:bg-red-100/50 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center relative group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" width={32} height={32} className="object-contain drop-shadow-sm" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base lg:text-lg mb-1 group-hover:text-red-600 transition-colors">¿Cómo podemos asistirte?</h4>
                  <p className="text-[15px] font-medium text-stone-700 leading-relaxed">
                    {info.email}
                  </p>
                </div>
              </a>

            </div>
          </motion.div>

          {/* Right Column - Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:max-w-[500px] lg:ml-auto"
          >
            <div className="relative bg-gradient-to-br from-white to-stone-50/50 p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white overflow-hidden">
              {/* Decorative blobs */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary-brand/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary-brand/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="mb-8 relative z-10">
                <h3 className="text-3xl font-black bg-gradient-to-r from-primary-brand to-secondary-brand bg-clip-text text-transparent mb-2">¡Escríbenos!</h3>
                <p className="text-stone-500 text-sm">Nos encantaría escuchar tus ideas o consultas.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name */}
                <div className="space-y-2 relative">
                  <label htmlFor="name" className="text-[13px] font-medium text-stone-600 block">
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
                      className="w-full px-4 py-3.5 pr-12 rounded-xl border-0 bg-stone-100/80 focus:bg-white focus:ring-2 focus:ring-secondary-brand/60 text-[15px] text-stone-800 transition-all shadow-inner placeholder:text-stone-400"
                    />
                    <User className="w-5 h-5 text-secondary-brand/60 absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2 relative">
                  <label htmlFor="email" className="text-[13px] font-medium text-stone-600 block">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="huatuco2001@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 pr-12 rounded-xl border-0 bg-stone-100/80 focus:bg-white focus:ring-2 focus:ring-secondary-brand/60 text-[15px] text-stone-800 transition-all shadow-inner placeholder:text-stone-400"
                    />
                    <Mail className="w-5 h-5 text-secondary-brand/60 absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2 relative">
                  <label htmlFor="message" className="text-[13px] font-medium text-stone-600 block">
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
                      className="w-full px-4 py-3.5 pr-12 rounded-xl border-0 bg-stone-100/80 focus:bg-white focus:ring-2 focus:ring-secondary-brand/60 text-[15px] text-stone-800 resize-none transition-all shadow-inner placeholder:text-stone-400"
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
                      className="p-4 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 flex items-start space-x-2 text-[13px]"
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
                      className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start space-x-2 text-[13px]"
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
                  className="w-full inline-flex justify-center items-center space-x-2 bg-gradient-to-r from-primary-brand to-secondary-brand hover:from-primary-brand hover:to-primary-brand text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-primary-brand/30 hover:shadow-primary-brand/50 hover:-translate-y-1 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none cursor-pointer mt-4"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <span className="text-[16px] tracking-wide">Enviar Mensaje</span>
                  )}
                </button>

                {/* Privacy Policy text */}
                <p className="text-[12px] text-stone-500 leading-relaxed mt-5">
                  Entiendo que mis datos serán guardados de forma segura.
                </p>

              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
