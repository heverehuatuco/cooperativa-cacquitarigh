"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { Loader2, Lock, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirigir al panel si ya está logueado
  useEffect(() => {
    if (!loading && user && role) {
      router.push("/admin");
    }
  }, [user, role, loading, router]);

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setErrorMessage("");
    try {
      const provider = new GoogleAuthProvider();
      // Forzar selección de cuenta
      provider.setCustomParameters({ prompt: "select_account" });
      
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email?.toLowerCase().trim();

      // Validar si es el correo del SuperAdmin principal
      if (userEmail !== "heverehuatuco@gmail.com") {
        await signOut(auth);
        setErrorMessage(
          "Acceso denegado: El correo de Google ingresado no corresponde al SuperAdministrador."
        );
      } else {
        router.push("/admin");
      }
    } catch (error: any) {
      console.error("Error en login Google:", error);
      if (error.code !== "auth/popup-closed-by-user") {
        setErrorMessage("Error al iniciar sesión con Google. Inténtalo de nuevo.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Por favor ingresa tu correo y contraseña.");
      return;
    }

    setAuthLoading(true);
    setErrorMessage("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // El AuthContext detectará el cambio de estado y validará si tiene rol 'staff' en Firestore.
      // Si el rol no existe, el contexto deslogueará automáticamente al usuario.
    } catch (error: any) {
      console.error("Error en login email/password:", error);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        setErrorMessage("Correo o contraseña incorrectos.");
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
            APASAJEM
          </span>
          <h1 className="text-lg font-bold text-white uppercase tracking-wider">
            Acceso Administrativo
          </h1>
          <p className="text-xs text-stone-400">
            Ingresa para gestionar contenidos, galería y noticias.
          </p>
        </div>

        {/* Error Message banner */}
        {errorMessage && (
          <div className="p-4 bg-red-950/50 border border-red-900/50 text-red-300 rounded-xl text-xs leading-relaxed text-center">
            {errorMessage}
          </div>
        )}

        {/* SuperAdmin Google Sign-in */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={authLoading}
            className="w-full inline-flex justify-center items-center space-x-3 bg-white hover:bg-stone-100 text-stone-900 font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-md disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {authLoading ? (
              <Loader2 className="animate-spin text-stone-900" size={18} />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.422 1.214 15.65.222 12.24.222c-6.49 0-11.75 5.26-11.75 11.75s5.26 11.75 11.75 11.75c6.777 0 11.277-4.747 11.277-11.472 0-.773-.082-1.36-.182-1.965h-11.09z"
                />
              </svg>
            )}
            <span>Acceso SuperAdmin (Google)</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-stone-800"></div>
            <span className="flex-shrink mx-4 text-stone-500 text-[10px] font-bold uppercase tracking-wider">
              O Acceso Personal
            </span>
            <div className="flex-grow border-t border-stone-800"></div>
          </div>
        </div>

        {/* Staff Email/Password login */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={authLoading}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-800 bg-stone-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm disabled:opacity-75"
                placeholder="nombre@apasajem.org"
              />
            </div>
          </div>

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
