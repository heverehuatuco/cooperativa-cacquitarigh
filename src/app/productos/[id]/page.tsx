"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { ArrowLeft, Loader2, MessageCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  available: boolean;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Default WhatsApp config
  const defaultPhone = "51915233460"; // fallback

  useEffect(() => {
    if (!id) return;
    
    if (id === "mock-1" || id === "mock-2") {
      const mockProd: Product = id === "mock-1" 
        ? { id: "mock-1", name: "Café Tostado Premium", category: "Café", description: "Delicioso café tostado de alta calidad con notas frutales y achocolatadas, cultivado a más de 1200 metros de altura en Satipo. Perfecto para comenzar tus mañanas con energía y disfrutar de su intenso aroma. Este es un producto de demostración para que veas el nuevo diseño.", imageUrl: "", available: true }
        : { id: "mock-2", name: "Pasta de Cacao 100%", category: "Cacao", description: "Nuestra pasta de cacao orgánico es ideal para repostería y consumo directo. Con un sabor puro y amargo, conserva todas las propiedades antioxidantes del cacao nativo de nuestra región. Este es un producto de demostración para que veas el nuevo diseño.", imageUrl: "", available: true };
      
      setProduct(mockProd);
      setRelatedProducts([
        { id: "mock-rel-1", name: "Chocolate Bitter 70%", category: "Cacao", description: "...", imageUrl: "", available: true },
        { id: "mock-rel-2", name: "Mermelada de Café", category: "Derivados", description: "...", imageUrl: "", available: true }
      ]);
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        // Fetch specific product
        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const prodData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(prodData);
          
          // Fetch related products (same category, not the current one)
          const q = query(
            collection(db, "products"),
            where("category", "==", prodData.category),
            where("available", "==", true),
            limit(5)
          );
          
          const relatedSnap = await getDocs(q);
          const related: Product[] = [];
          relatedSnap.forEach((d) => {
            if (d.id !== id) {
              related.push({ id: d.id, ...d.data() } as Product);
            }
          });
          
          setRelatedProducts(related.slice(0, 4)); // Get up to 4
        } else {
          // Product not found
          console.error("Producto no encontrado");
        }
      } catch (err) {
        console.error("Error cargando producto:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleWhatsAppClick = () => {
    if (!product) return;
    const message = `Hola, estoy interesado en el producto: ${product.name}. ¿Me podrían brindar más información?`;
    window.open(`https://wa.me/${defaultPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-stone-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-24">
          <Loader2 className="animate-spin text-[#1a826e]" size={48} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-stone-50">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center pt-24 space-y-4">
          <h2 className="text-2xl font-bold text-stone-800">Producto no encontrado</h2>
          <button onClick={() => router.push("/productos")} className="text-[#1a826e] underline">Volver a Productos</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      
      <main className="flex-grow bg-[#faf9f6] relative pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Back button */}
          <div className="mb-8">
            <Link href="/productos" className="inline-flex items-center text-stone-500 hover:text-[#1a826e] transition-colors text-sm font-medium">
              <ArrowLeft size={16} className="mr-2" />
              Volver a Productos
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Sidebar (Categorías) */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100/50 sticky top-28">
                <h3 className="font-bold text-lg text-stone-900 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#1a826e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Categorías
                </h3>
                
                <div className="space-y-6">
                  <div className="group">
                    <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100/50 flex items-center justify-center p-1.5">
                        <Image src="/cafeilustracion.webp" alt="Café" width={32} height={32} className="object-contain drop-shadow-sm" />
                      </div>
                      Café
                    </h4>
                    <Link href="/productos#galeria-productos" className="text-sm text-stone-500 hover:text-[#1a826e] flex items-center gap-1 transition-colors pl-[52px]">
                      <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#1a826e]">→</span>
                      Ver todos los cafés
                    </Link>
                  </div>
                  <div className="w-full h-px bg-stone-100"></div>
                  
                  <div className="group">
                    <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100/50 flex items-center justify-center p-1.5">
                        <Image src="/cacaoilustracion.webp" alt="Cacao" width={32} height={32} className="object-contain drop-shadow-sm" />
                      </div>
                      Cacao
                    </h4>
                    <Link href="/productos#galeria-productos" className="text-sm text-stone-500 hover:text-[#1a826e] flex items-center gap-1 transition-colors pl-[52px]">
                      <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#1a826e]">→</span>
                      Ver todos los cacaos
                    </Link>
                  </div>
                  <div className="w-full h-px bg-stone-100"></div>
                  
                  <div className="group">
                    <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100/50 flex items-center justify-center p-1.5">
                        <Image src="/productosilustracion.webp" alt="Derivados" width={32} height={32} className="object-contain drop-shadow-sm" />
                      </div>
                      Derivados
                    </h4>
                    <Link href="/productos#galeria-productos" className="text-sm text-stone-500 hover:text-[#1a826e] flex items-center gap-1 transition-colors pl-[52px]">
                      <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#1a826e]">→</span>
                      Ver derivados
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
                
                {/* Product Image */}
                <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-stone-100/50 aspect-[4/5] relative flex items-center justify-center overflow-hidden group">
                  {/* Decorative background blur */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-stone-50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-8 drop-shadow-xl transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-100 flex items-center justify-center rounded-xl text-stone-400">
                      Sin imagen
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col pt-4">
                  <h1 className="text-4xl md:text-5xl font-black text-[#5a3628] font-rubik tracking-tight mb-6 leading-tight">
                    {product.name}
                  </h1>
                  
                  <div className="text-[15px] leading-relaxed text-stone-600 mb-8">
                    <p>{product.description}</p>
                  </div>
                  
                  <button
                    onClick={handleWhatsAppClick}
                    className="inline-flex items-center justify-center gap-2 bg-[#ffcc00] hover:bg-[#e6b800] text-stone-900 font-bold py-3.5 px-8 rounded-full shadow-sm hover:shadow-md transition-all duration-300 w-full sm:w-auto self-start"
                  >
                    <MessageCircle size={20} />
                    Solicitar
                  </button>
                  
                  <hr className="my-10 border-stone-100" />
                  
                  <div className="space-y-4 text-[13px] uppercase tracking-wide">
                    <div className="flex items-start">
                      <span className="font-bold text-stone-900 w-28">Categoría:</span>
                      <span className="text-stone-500">{product.category}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-bold text-stone-900 w-28">Tag:</span>
                      <span className="text-stone-500">Cacao, Venta Nacional, Chocolates</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Related Products Section */}
              {relatedProducts.length > 0 && (
                <div className="mt-24">
                  <h3 className="text-[28px] font-black text-stone-900 font-rubik mb-8 tracking-tight">
                    Productos Relacionados
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {relatedProducts.map(rel => (
                      <Link href={`/productos/${rel.id}`} key={rel.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl hover:shadow-[#1a826e]/10 hover:border-[#1a826e]/30 transition-all duration-300">
                        <div className="aspect-[4/5] bg-[#f9f8f5] relative p-4 flex justify-center items-center">
                          {rel.imageUrl ? (
                            <Image
                              src={rel.imageUrl}
                              alt={rel.name}
                              fill
                              className="object-contain p-6 drop-shadow-md transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-stone-200 rounded animate-pulse"></div>
                          )}
                        </div>
                        <div className="p-4 bg-[#136152] group-hover:bg-[#1a826e] transition-colors mt-auto">
                          <h4 className="font-bold text-white text-center text-sm truncate">
                            {rel.name}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
