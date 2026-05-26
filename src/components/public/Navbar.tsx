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
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const navLinks = [
    { name: "Nosotros", href: "/nosotros", id: "nosotros" },
    { name: "Productos", href: "/productos", id: "productos" },
    { name: "Galería", href: "/#galeria", id: "galeria" },
    { name: "Contacto", href: "/contacto", id: "contacto" },
  ];

  useEffect(() => {
    // Set initial active section based on pathname
    if (pathname === "/nosotros") {
      setActiveSection("nosotros");
    } else if (pathname === "/productos") {
      setActiveSection("productos");
    } else if (pathname === "/contacto") {
      setActiveSection("contacto");
    }

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (pathname === "/") {
        const sections = ["galeria"];
        let current = "";
        
        // Find which section is currently in view
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Offset by 150px to trigger slightly before it reaches the very top
            if (rect.top <= 150 && rect.bottom >= 150) {
              current = section;
              break;
            }
          }
        }
        
        // If we are at the very top, we might not have any section active
        if (window.scrollY < 100) {
          current = "";
        }
        
        setActiveSection(current);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    // Call once to set initial state on load
    handleScroll();

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

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 max-w-5xl rounded-full w-[90%] md:w-full transition-all duration-300 bg-white/90 backdrop-blur-md border border-stone-200/50 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2 shrink-0">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="APASAJEM Logo"
            className="h-8 sm:h-10 w-auto object-contain transition-all duration-300"
          />
        ) : (
          <span
            className="text-xl font-bold bg-gradient-to-r from-primary-brand to-tertiary-brand bg-clip-text text-transparent"
          >
            APASAJEM
          </span>
        )}
      </Link>

      {/* Menu / Navigation Links */}
      <nav
        className={`max-md:fixed max-md:top-0 max-md:left-0 max-md:overflow-hidden items-center justify-center max-md:h-screen transition-[width] duration-300 max-md:bg-white/95 max-md:backdrop-blur flex-col md:flex-row flex gap-8 text-sm font-medium z-50 md:text-stone-700 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        {navLinks.map((link) => {
          const isActive = activeSection === link.id;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`transition-all duration-200 block max-md:text-stone-850 max-md:text-lg max-md:font-bold md:hover:text-primary-brand relative ${
                isActive ? "text-primary-brand" : ""
              }`}
            >
              {link.name}
              {/* Active Indicator Underline */}
              <span 
                className={`absolute -bottom-1.5 left-0 h-0.5 bg-primary-brand transition-all duration-300 rounded-full ${
                  isActive ? "w-full opacity-100" : "w-0 opacity-0"
                }`}
              />
            </Link>
          );
        })}

        {/* Action Button inside Mobile Menu */}
        <div className="md:hidden pt-4 border-t border-stone-200/40 w-4/5 flex flex-col items-center">
          {user ? (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-primary-brand text-white text-sm font-semibold py-3 rounded-full shadow-sm cursor-pointer"
            >
              Panel Admin
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-primary-brand text-white text-sm font-semibold py-3 rounded-full shadow-sm cursor-pointer"
            >
              Acceso Admin
            </Link>
          )}
        </div>

        {/* Mobile menu close button */}
        <button
          id="closeMenu"
          onClick={() => setIsOpen(false)}
          className="md:hidden text-stone-650 hover:text-stone-900 absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 cursor-pointer"
          aria-label="Cerrar menú"
        >
          <X size={24} />
        </button>
      </nav>

      {/* Right Actions Container */}
      <div className="flex items-center space-x-4 shrink-0">
        {/* Theme/Sun Icon (Adapted for Admin Shortcut) */}
        <button
          className="w-8 h-8 flex items-center justify-center hover:bg-stone-100 hover:text-stone-900 transition border rounded-md cursor-pointer border-stone-300 text-stone-650"
          aria-label="Acceso Administrativo"
          title={user ? "Ir a Administración" : "Acceso Administrativo"}
          onClick={() => {
            window.location.href = user ? "/admin" : "/login";
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 10.39a2.889 2.889 0 1 0 0-5.779 2.889 2.889 0 0 0 0 5.778M7.5 1v.722m0 11.556V14M1 7.5h.722m11.556 0h.723m-1.904-4.596-.511.51m-8.172 8.171-.51.511m-.001-9.192.51.51m8.173 8.171.51.511"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* CTA Admin Button (Sign Up replacement) */}
        {user ? (
          <Link
            href="/admin"
            className="hidden md:flex bg-primary-brand hover:bg-primary-brand-light text-white px-5 py-2 rounded-full text-xs font-semibold hover:shadow-md transition duration-300 cursor-pointer"
          >
            Panel Admin
          </Link>
        ) : (
          <Link
            href="/login"
            className="hidden md:flex bg-primary-brand hover:bg-primary-brand-light text-white px-5 py-2 rounded-full text-xs font-semibold hover:shadow-md transition duration-300 cursor-pointer"
          >
            Acceso Admin
          </Link>
        )}

        {/* Mobile menu open button */}
        <button
          id="openMenu"
          onClick={() => setIsOpen(true)}
          className="md:hidden p-1.5 rounded-lg transition-colors cursor-pointer text-stone-600 hover:bg-stone-100"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}
