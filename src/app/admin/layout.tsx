"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, LogOut, Shield, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !role)) {
      router.push("/login");
    }
  }, [user, role, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading || !user || !role) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col justify-center items-center text-white">
        <Loader2 className="animate-spin text-tertiary-brand mb-3" size={40} />
        <p className="text-stone-400 text-sm">Verificando autorización...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row">
      {/* Top Mobile Bar */}
      <div className="lg:hidden bg-stone-900 text-white px-4 py-3 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center space-x-2">
          <Shield className="text-tertiary-brand" size={20} />
          <span className="font-bold text-sm tracking-wider">APASAJEM ADMIN</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white"
          aria-label="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header for Desktop */}
        <header className="hidden lg:flex bg-white h-16 border-b border-stone-200 shadow-xs px-4 sm:px-6">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="text-stone-400" size={20} />
              <h1 className="font-bold text-stone-700">Panel de Control General</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-bold text-stone-800 leading-none">
                  {user.displayName || "Usuario Administrativo"}
                </p>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mt-1">
                  {role === "admin" ? "Super Administrador" : "Personal Autorizado"}
                </span>
              </div>
              <div className="h-8 w-px bg-stone-200" />
              <button
                onClick={handleLogout}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-grow p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
