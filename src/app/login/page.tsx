"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Loader2, Lock, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirigir al panel si ya está logueado
  useEffect(() => {
    if (!loading && user && role) {
      router.push("/admin");
    }
  }, [user, role, loading, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage("Por favor ingresa tu usuario y contraseña.");
      return;
    }

    setAuthLoading(true);
    setErrorMessage("");
    try {
      let emailToLogin = username.trim();
      const cleanUsername = username.trim().toLowerCase();

      if (cleanUsername === "heverehuatuco" || cleanUsername === "admin" || cleanUsername === "huatuco") {
        emailToLogin = "heverehuatuco@gmail.com";
      } else if (!emailToLogin.includes("@")) {
        emailToLogin = `${cleanUsername.replace(/\s+/g, '')}@cacquitari.org`;
      }

      await signInWithEmailAndPassword(auth, emailToLogin, password);
    } catch (error: any) {
      console.error("Error en login:", error);
      if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        setErrorMessage("Usuario o contraseña incorrectos.");
      } else {
        setErrorMessage("Error al iniciar sesión. Verifica tu conexión.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading || (user && role)) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col justify-center items-center text-white">
        <Loader2 className="animate-spin text-tertiary-brand mb-3" size={40} />
        <p className="text-stone-400 text-sm">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center items-center px-4 relative overflow-hidden z-0">
      {/* Background Top Section with Primary Brand */}
      <div className="absolute top-0 left-0 w-full h-[45%] bg-primary-brand -z-20 overflow-hidden">
        {/* Glowing orbs for a modern corporate look */}
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-primary-brand-light rounded-full blur-[80px] opacity-50 mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 bg-secondary-brand rounded-full blur-[80px] opacity-30 mix-blend-screen" />
      </div>
      
      {/* Background SVG Wave separating top and bottom */}
      <div className="absolute top-[45%] left-0 w-full -z-10 text-primary-brand">
        <svg viewBox="0 0 1440 120" className="w-full h-auto" fill="currentColor" preserveAspectRatio="none" style={{ height: '8vw', minHeight: '60px' }}>
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
        </svg>
      </div>

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 text-sm z-10 font-medium"
      >
        <ArrowLeft size={16} />
        <span>Volver a la Web</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col border border-stone-100/50">
        {/* Card Header (Green) */}
        <div className="bg-primary-brand pt-10 pb-8 px-8 flex flex-col items-center justify-center text-center relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl opacity-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl opacity-10" />
          </div>
          <div className="relative w-24 h-24 mb-3 hover:scale-105 transition-transform duration-300">
            <Image src="/logocacquitari.webp" alt="Cacquitari Logo" fill className="object-contain" priority />
          </div>
          <h2 className="text-white font-extrabold text-xl tracking-wide uppercase mt-1 relative z-10">Cacquitari</h2>
          <p className="text-primary-brand-light text-xs font-medium mt-1 relative z-10 tracking-widest uppercase">Sistema de Gestión</p>
        </div>

        {/* Card Body (White) */}
        <div className="p-8 sm:p-10 space-y-6 bg-white">
          {/* Error Message banner */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block ml-1">
                Usuario
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-stone-400 group-focus-within:text-primary-brand transition-colors z-10">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={authLoading}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-4 focus:ring-primary-brand/10 focus:border-primary-brand focus:bg-white text-sm disabled:opacity-75 transition-all shadow-xs"
                  placeholder="Ingresa tu usuario"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block ml-1">
                Contraseña
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-stone-400 group-focus-within:text-primary-brand transition-colors z-10">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={authLoading}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-4 focus:ring-primary-brand/10 focus:border-primary-brand focus:bg-white text-sm disabled:opacity-75 transition-all shadow-xs"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full inline-flex justify-center items-center bg-primary-brand hover:bg-primary-brand-light text-white font-bold py-4 px-4 rounded-2xl transition-all duration-300 shadow-lg shadow-primary-brand/30 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer text-sm mt-4 hover:-translate-y-0.5"
            >
              {authLoading ? (
                <Loader2 className="animate-spin text-white mr-2" size={18} />
              ) : null}
              <span>Ingresar al Sistema</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
