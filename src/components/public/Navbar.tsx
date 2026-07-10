"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Menu, X, Search, ArrowRight, Leaf, Coffee, MessageSquare } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface FloatingItem {
  id: number;
  left: string;
  duration: number;
  delay: number;
  size: number;
  isCoffee: boolean;
  rotation: number;
}

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    setFloatingItems(
      Array.from({ length: 35 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 90 + 5}%`,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 10,
        size: 30 + Math.random() * 50,
        isCoffee: Math.random() > 0.5,
        rotation: Math.random() * 360,
      }))
    );
  }, []);

  const navLinks = [
    { name: "Nosotros", href: "/nosotros", icon: Leaf },
    { name: "Productos", href: "/productos", icon: Coffee },
    { name: "Contacto", href: "/contacto", icon: MessageSquare },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productos?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="fixed top-4 left-0 w-full z-50 px-4 md:px-8 flex justify-center pointer-events-none">
      <nav className="w-full max-w-7xl bg-white rounded-full px-4 py-2 md:py-2.5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.08)] pointer-events-auto border border-gray-100 relative overflow-hidden">
        
        {/* Floating Rain Effect */}
        {floatingItems.map((item) => (
          <motion.div
            key={item.id}
            className="absolute top-0 z-[1] opacity-30 pointer-events-none"
            initial={{ y: "-20vh", rotate: item.rotation }}
            animate={{ y: "50vh", rotate: item.rotation + 180 }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ left: item.left }}
          >
            <div style={{ width: item.size, height: item.size, position: 'relative' }}>
              <Image 
                src={item.isCoffee ? "/cafeilustracion.webp" : "/cacaoilustracion.webp"} 
                alt="" 
                fill 
                className="object-contain" 
              />
            </div>
          </motion.div>
        ))}
        
        {/* Desktop Links (Left) */}
        <div className="hidden md:flex flex-1 relative z-10 items-center justify-start gap-6 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`group flex items-center gap-2 text-[13px] lg:text-sm font-bold tracking-wide uppercase transition-colors ${
                  isActive ? "text-[#1a826e]" : "text-gray-800 hover:text-[#1a826e]"
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-[#1a826e]/15 text-[#1a826e]' : 'bg-gray-100 text-gray-500 group-hover:bg-[#1a826e]/10 group-hover:text-[#1a826e]'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Logo Section (Center) */}
        <Link href="/" className="relative z-10 flex items-center gap-3 md:absolute md:left-1/2 md:-translate-x-1/2">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative h-10 w-10 md:h-12 md:w-12 flex-shrink-0 bg-transparent rounded-full overflow-hidden flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src="/logocacquitari.webp"
                  alt="Cacquitari Logo"
                  fill
                  sizes="48px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight animate-shine-text">
              CAC QUITARI
            </span>
          </div>
        </Link>

        {/* Right Section: Search & CTA */}
        <div className="hidden md:flex flex-1 relative z-10 items-center justify-end gap-4 lg:gap-6">
          <form onSubmit={handleSearch} className="flex items-center bg-white border-2 border-gray-200 hover:border-[#1a826e]/50 focus-within:border-[#1a826e] focus-within:shadow-[0_0_0_4px_rgba(26,130,110,0.1)] rounded-full pl-4 pr-1.5 py-1.5 transition-all duration-300">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="bg-transparent border-none outline-none text-sm w-32 lg:w-48 xl:w-56 text-gray-800 placeholder-gray-400 font-medium"
            />
            <button type="submit" className="bg-[#1a826e] text-white p-1.5 rounded-full hover:bg-[#219d85] transition-colors ml-1 shadow-md" aria-label="Buscar">
              <Search className="w-4 h-4" />
            </button>
          </form>
          
          <Link
            href={user ? "/admin" : "/login"}
            className="flex items-center gap-3 bg-[#1a826e] text-white text-[13px] lg:text-sm font-bold pl-5 pr-1.5 py-1.5 rounded-full hover:bg-[#219d85] transition-all shadow-sm group"
          >
            {user ? "Panel" : "Acceso"}
            <div className="bg-white text-[#1a826e] rounded-full p-1.5 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="relative z-10 md:hidden flex items-center justify-center p-2 text-gray-800"
          aria-label="Abrir menú"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-4 md:hidden border border-gray-100 pointer-events-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-3 font-bold text-lg p-2 rounded-lg ${
                  isActive ? "text-[#1a826e] bg-[#f2faf8]" : "text-gray-800 hover:bg-gray-50"
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-[#1a826e]/15 text-[#1a826e]' : 'bg-white shadow-sm border border-gray-100 text-gray-500 group-hover:text-[#1a826e]'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {link.name}
              </Link>
            );
          })}
          <hr className="border-gray-100 my-2" />
          <form onSubmit={handleSearch} className="flex items-center bg-white border-2 border-gray-200 focus-within:border-[#1a826e] focus-within:shadow-[0_0_0_4px_rgba(26,130,110,0.1)] rounded-xl pl-4 pr-2 py-2 transition-all">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="bg-transparent border-none outline-none w-full text-gray-800 placeholder-gray-400 font-medium"
            />
            <button type="submit" className="bg-[#1a826e] text-white p-2 rounded-lg hover:bg-[#219d85] transition-colors ml-2 shadow-md">
              <Search className="w-5 h-5" />
            </button>
          </form>
          <Link
            href={user ? "/admin" : "/login"}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between bg-[#1a826e] text-white font-bold px-5 py-3 rounded-xl mt-2 hover:bg-[#219d85] transition-all group"
          >
            {user ? "Panel Admin" : "Acceso Admin"}
            <div className="bg-white/20 rounded-full p-1 group-hover:bg-white group-hover:text-[#1a826e] transition-colors">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
