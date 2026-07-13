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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const isHomePage = pathname === "/";
  const needsSolidBg = !isHomePage || isScrolled;

  return (
    <header className={`fixed top-0 left-0 w-full z-50 pointer-events-auto font-inter transition-all duration-500 ${
      needsSolidBg ? "bg-[linear-gradient(90deg,#102721,#1e3b23)] shadow-[0_4px_20px_rgba(42,84,32,0.4)]" : "bg-transparent py-2"
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[90px] flex items-center justify-between">
        
        {/* Logo Section (Left) */}
        <Link href="/" className="flex items-center gap-3">
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
          <span className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
            CAC QUITARI
          </span>
        </Link>

        {/* Desktop Links (Center Pill) */}
        <div className="hidden md:flex flex-1 items-center justify-start ml-12">
          <div className="flex items-center gap-8 border border-white/60 rounded-full px-8 py-2.5 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[15px] font-medium transition-all ${
                    isActive 
                      ? "text-white font-semibold" 
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Section: CTA */}
        <div className="hidden md:flex items-center justify-end gap-4">
          <Link
            href={user ? "/admin" : "/login"}
            className="text-white text-[15px] font-medium transition-all hover:text-white/70"
          >
            {user ? "Panel" : "Acceso"}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center p-2 text-white"
          aria-label="Abrir menú"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </nav>

      {/* Floating Search Bar (Bottom Left) */}
      <div className="hidden md:block fixed bottom-12 left-6 lg:left-12 z-50">
        <form onSubmit={handleSearch} className="flex items-center bg-[#102721]/90 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 w-64 transition-colors focus-within:border-[#75a331] shadow-[0_8px_30px_rgba(42,84,32,0.4)] group">
          <Search className="w-4 h-4 text-white/70 mr-3 group-focus-within:text-[#75a331] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="www.cacquitari.com"
            className="bg-transparent border-none outline-none text-[13px] w-full text-white placeholder-white/50 font-medium"
          />
        </form>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-[120px] left-0 w-full bg-[#102721] shadow-xl p-6 flex flex-col gap-5 md:hidden border-t border-white/10 z-40">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-[17px] font-bold px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "text-[#2a5420] bg-white" : "text-white hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <hr className="border-white/20 my-2" />
          <form onSubmit={handleSearch} className="flex items-center bg-white/10 rounded-full px-4 py-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-transparent text-white placeholder-white/50 outline-none px-2"
            />
            <button type="submit" className="text-[#2a5420] ml-2">
              <Search className="w-5 h-5 text-white/70" />
            </button>
          </form>
          <Link
            href={user ? "/admin" : "/login"}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center bg-white text-[#2a5420] font-bold px-5 py-3 rounded-full mt-2 hover:bg-gray-100 transition-all"
          >
            {user ? "Panel Admin" : "Acceso Admin"}
          </Link>
        </div>
      )}
    </header>
  );
}
