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
    <section id="contacto" className="relative pt-12 pb-6 lg:pt-16 lg:pb-8 bg-transparent font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-10 items-start">

          {/* Left Column - Text & Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:pr-10"
          >


            {/* Title */}
            <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-stone-900 mb-12 leading-[1.15]">
              ¿Necesitas ayuda? <br className="hidden sm:block" />¡Contáctanos!
            </h2>

            {/* Vertical Contact Info Blocks */}
            <div className="space-y-10">

              {/* Location Block */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-secondary-brand/10 flex items-center justify-center relative">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" alt="Google Maps" width={24} height={24} className="object-contain" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base mb-1">¿Listo para visitarnos?</h4>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {info.address}
                  </p>
                </div>
              </div>

              {/* Phone Block */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center relative">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width={28} height={28} className="object-contain" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base mb-1">¡No dudes en comunicarte!</h4>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    WhatsApp: +{info.whatsapp}<br />
                    {info.whatsapp2 && `Soporte: +${info.whatsapp2}`}
                  </p>
                </div>
              </div>

              {/* Email Block */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center relative">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" width={24} height={24} className="object-contain" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base mb-1">¿Cómo podemos asistirte?</h4>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {info.email}
                  </p>
                </div>
              </div>

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
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-stone-100">

              <div className="mb-8">
                <h3 className="text-3xl font-bold text-stone-900 mb-2">¡Dinos hola!</h3>
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
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 pr-12 rounded-lg border border-stone-200 focus:outline-none focus:border-secondary-brand focus:ring-1 focus:ring-secondary-brand text-[15px] text-stone-800 bg-white transition-all"
                    />
                    <User className="w-5 h-5 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
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
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 pr-12 rounded-lg border border-stone-200 focus:outline-none focus:border-secondary-brand focus:ring-1 focus:ring-secondary-brand text-[15px] text-stone-800 bg-white transition-all"
                    />
                    <Mail className="w-5 h-5 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
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
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 pr-12 rounded-lg border border-stone-200 focus:outline-none focus:border-secondary-brand focus:ring-1 focus:ring-secondary-brand text-[15px] text-stone-800 bg-white resize-none transition-all"
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
                  className="w-full inline-flex justify-center items-center space-x-2 bg-secondary-brand hover:bg-secondary-brand-light text-white font-medium py-3.5 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer mt-2"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <span className="text-[15px] tracking-wide">Enviar Mensaje</span>
                  )}
                </button>

                {/* Privacy Policy text */}
                <p className="text-[12px] text-stone-500 leading-relaxed mt-5">
                  Entiendo que mis datos serán guardados de forma segura de acuerdo con la <a href="#" className="text-stone-700 underline hover:text-secondary-brand transition-colors">política de privacidad</a>.
                </p>

              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
