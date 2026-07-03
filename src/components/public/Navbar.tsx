"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Menu, X, Search, ArrowRight, ChevronDown } from "lucide-react";
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
      Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 90 + 5}%`,
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 5,
        size: 30 + Math.random() * 50,
        isCoffee: Math.random() > 0.5,
        rotation: Math.random() * 360,
      }))
    );
  }, []);

  const navLinks = [
    { name: "Nosotros", href: "/nosotros", hasDropdown: true },
    { name: "Productos", href: "/productos" },
    { name: "Contacto", href: "/contacto" },
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
        
        {/* Logo Section */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
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

        {/* Desktop Links */}
        <div className="hidden md:flex relative z-10 items-center gap-6 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1 text-[13px] lg:text-sm font-bold tracking-wide uppercase transition-colors ${
                  isActive ? "text-[#1a826e]" : "text-gray-800 hover:text-[#1a826e]"
                }`}
              >
                {link.name}
                {link.hasDropdown && <ChevronDown className="w-4 h-4 ml-0.5 text-gray-500" />}
              </Link>
            );
          })}
        </div>

        {/* Right Section: Search & CTA */}
        <div className="hidden md:flex relative z-10 items-center gap-4 lg:gap-6">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-100/80 hover:bg-gray-100 focus-within:bg-white border border-transparent focus-within:border-[#1a826e]/30 focus-within:ring-2 focus-within:ring-[#1a826e]/10 rounded-full px-3 py-1.5 transition-all">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="bg-transparent border-none outline-none text-sm w-28 lg:w-40 xl:w-48 text-gray-800 placeholder-gray-400"
            />
            <button type="submit" className="text-gray-400 hover:text-[#1a826e] ml-1" aria-label="Buscar">
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
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex justify-between items-center font-bold text-lg p-2 rounded-lg ${
                  isActive ? "text-[#1a826e] bg-[#f2faf8]" : "text-gray-800 hover:bg-gray-50"
                }`}
              >
                {link.name}
                {link.hasDropdown && <ChevronDown className="w-5 h-5" />}
              </Link>
            );
          })}
          <hr className="border-gray-100 my-2" />
          <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="bg-transparent border-none outline-none w-full text-gray-800 placeholder-gray-400 font-medium"
            />
            <button type="submit" className="text-gray-500 hover:text-[#1a826e]">
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
