"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ContactsManager from "@/components/admin/ContactsManager";
import GalleryManager from "@/components/admin/GalleryManager";
import NewsManager from "@/components/admin/NewsManager";
import ProductsManager from "@/components/admin/ProductsManager";
import SettingsManager from "@/components/admin/SettingsManager";
import StaffManager from "@/components/admin/StaffManager";
import { MessageSquare, Image, FileText, ShoppingBag, Settings, Users, Shield } from "lucide-react";

type TabId = "contacts" | "gallery" | "news" | "products" | "settings" | "staff";

export default function AdminPage() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("contacts");

  const menuItems = [
    { id: "contacts", label: "Mensajes de Contacto", icon: <MessageSquare size={18} /> },
    { id: "gallery", label: "Galería de Fotos", icon: <Image size={18} /> },
    { id: "news", label: "Gestión de Noticias", icon: <FileText size={18} /> },
    { id: "products", label: "Gestión de Productos", icon: <ShoppingBag size={18} /> },
    { id: "settings", label: "Información de Empresa", icon: <Settings size={18} /> },
  ];

  // Si es SuperAdmin, agregamos la gestión de personal
  if (role === "admin") {
    menuItems.push({ id: "staff", label: "Gestión de Personal", icon: <Users size={18} /> });
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar navigation on Desktop */}
      <aside className="w-full lg:w-64 bg-white rounded-3xl border border-stone-200/80 p-5 shrink-0 self-start shadow-xs">
        <div className="hidden lg:flex items-center space-x-2 pb-4 mb-4 border-b border-stone-100">
          <Shield className="text-primary-brand" size={20} />
          <span className="font-bold text-xs uppercase tracking-widest text-stone-600">Navegación</span>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-wrap lg:flex-col gap-1 sm:gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabId)}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-left text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === item.id
                  ? "bg-primary-brand text-white shadow-md shadow-primary-brand/10"
                  : "text-stone-650 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-grow">
        {activeTab === "contacts" && <ContactsManager />}
        {activeTab === "gallery" && <GalleryManager />}
        {activeTab === "news" && <NewsManager />}
        {activeTab === "products" && <ProductsManager />}
        {activeTab === "settings" && <SettingsManager />}
        {activeTab === "staff" && role === "admin" && <StaffManager />}
      </div>
    </div>
  );
}
