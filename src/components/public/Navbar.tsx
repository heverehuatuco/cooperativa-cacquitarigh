"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Nosotros", href: "/nosotros" },
    { name: "Productos", href: "/productos" },
    { name: "Contacto", href: "/contacto" },
  ];

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().logoUrl) {
          setLogoUrl(docSnap.data().logoUrl);
        }
      } catch (err) {
        console.error("Error al cargar logo:", err);
      }
    };
    fetchLogo();
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  // In this design, Navbar is transparent over the purple hero if on home, 
  // but if we are on other pages we might need a background. 
  // We'll apply a solid purple background if not on home, or just keep it transparent 
  // and assume all pages have the purple top. Let's make it fixed with backdrop blur on scroll.
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const navBgClass = isScrolled || !isHome 
    ? "bg-primary-brand/95 backdrop-blur-md shadow-sm" 
    : "bg-transparent";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBgClass}`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        {logoUrl ? (
          <div className="inline-block">
            <img
              src={logoUrl}
              alt="Cacquitari Logo"
              className="h-12 md:h-16 w-auto object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
              <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xl font-bold text-white tracking-wide">
              Cacquitari
            </span>
          </div>
        )}
      </Link>

      {/* Desktop Nav Items */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-sm font-semibold text-white/90 hover:text-white transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Desktop CTA Button */}
      <Link
        href={user ? "/admin" : "/login"}
        className="hidden md:flex items-center justify-center bg-white text-primary-brand text-sm font-bold px-6 py-2.5 rounded-full hover:bg-stone-50 transition-all shadow-sm"
      >
        {user ? "Panel" : "Acceso"}
      </Link>

      {/* Mobile Hamburger */}
      <button 
        onClick={toggleMenu} 
        className="md:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-0 p-1"
        aria-label="Abrir menú"
      >
        <span className={`block w-6 h-0.5 bg-white transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'flex' : 'hidden'} absolute top-full left-0 w-full bg-primary-brand border-t border-white/10 flex-col p-5 gap-4 md:hidden z-50`}>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="block text-center text-white font-medium text-lg"
          >
            {link.name}
          </Link>
        ))}
        <Link 
          href={user ? "/admin" : "/login"}
          onClick={() => setIsOpen(false)}
          className="bg-white text-primary-brand text-center font-bold px-6 py-3 rounded-full mt-4"
        >
          {user ? "Panel Admin" : "Acceso Admin"}
        </Link>
      </div>
      </div>
    </nav>
  );
}
