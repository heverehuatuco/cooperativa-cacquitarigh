"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { Loader2, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

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
    if (!password) {
      setErrorMessage("Por favor ingresa tu contraseña.");
      return;
    }

    if (password !== "huatuco123") {
      setErrorMessage("Contraseña incorrecta.");
      return;
    }

    setAuthLoading(true);
    setErrorMessage("");
    try {
      // Intentamos iniciar sesión
      await signInWithEmailAndPassword(auth, "heverehuatuco@gmail.com", password);
    } catch (error: any) {
      console.error("Error en login:", error);
      // Si el usuario no existe en Firebase, lo creamos automáticamente
      if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
        try {
          await createUserWithEmailAndPassword(auth, "heverehuatuco@gmail.com", password);
        } catch (createError: any) {
          if (createError.code === "auth/email-already-in-use") {
            setErrorMessage("La contraseña en Firebase es distinta a huatuco123. Por favor actualízala en Firebase.");
          } else {
            setErrorMessage("Error al crear la cuenta en Firebase.");
          }
        }
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("Contraseña incorrecta en Firebase.");
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
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-emerald-950/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-950/20 blur-3xl" />

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center space-x-2 text-stone-400 hover:text-white transition-colors duration-200 text-sm"
      >
        <ArrowLeft size={16} />
        <span>Volver a la Web</span>
      </Link>

      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-8">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
            CACQUITARI
          </span>

        </div>

        {/* Error Message banner */}
        {errorMessage && (
          <div className="p-4 bg-red-950/50 border border-red-900/50 text-red-300 rounded-xl text-xs leading-relaxed text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-500">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={authLoading}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-800 bg-stone-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm disabled:opacity-75"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full inline-flex justify-center items-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-md shadow-emerald-600/10 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            {authLoading ? (
              <Loader2 className="animate-spin text-white mr-2" size={18} />
            ) : null}
            <span>Iniciar Sesión</span>
          </button>
        </form>
      </div>
    </div>
  );
}
