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
    <header className="fixed top-0 left-0 w-full z-50 bg-[#1a826e] shadow-md pointer-events-auto font-inter">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[120px] flex items-center justify-between">
        
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

        {/* Desktop Links (Center) */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[15px] font-semibold transition-all ${
                  isActive 
                    ? "text-white border-b-2 border-white pb-1" 
                    : "text-white/80 hover:text-white pb-1 border-b-2 border-transparent hover:border-white/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Section: Search & CTA */}
        <div className="hidden md:flex items-center justify-end gap-6">
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full px-4 py-2 w-56 xl:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400 font-medium"
            />
          </form>
          
          <Link
            href={user ? "/admin" : "/login"}
            className="flex items-center gap-2 border border-white/50 text-white text-[14px] font-semibold px-5 py-2 rounded-full hover:bg-white hover:text-[#1a826e] transition-all"
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

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-[120px] left-0 w-full bg-[#115e4f] shadow-xl p-6 flex flex-col gap-5 md:hidden border-t border-white/10 z-40">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`font-semibold text-lg p-3 rounded-lg text-center transition-colors ${
                  isActive ? "text-[#115e4f] bg-white" : "text-white hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <hr className="border-white/20 my-2" />
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full px-4 py-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="bg-transparent border-none outline-none w-full text-gray-800 placeholder-gray-400 font-medium"
            />
            <button type="submit" className="text-[#1a826e] ml-2">
              <Search className="w-5 h-5" />
            </button>
          </form>
          <Link
            href={user ? "/admin" : "/login"}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center bg-white text-[#1a826e] font-bold px-5 py-3 rounded-full mt-2 hover:bg-gray-100 transition-all"
          >
            {user ? "Panel Admin" : "Acceso Admin"}
          </Link>
        </div>
      )}
    </header>
  );
}
