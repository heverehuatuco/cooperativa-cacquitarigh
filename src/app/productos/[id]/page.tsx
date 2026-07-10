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
  const [whatsapp, setWhatsapp] = useState("51915233460");

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const docRef = doc(db, "settings", "company_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().whatsapp) {
          setWhatsapp(docSnap.data().whatsapp.replace(/\D/g, ""));
        }
      } catch (err) {
        console.error("Error loading company info:", err);
      }
    };
    fetchCompanyInfo();
  }, []);

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
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
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
                  
                  <div className="rainbow relative z-0 bg-[#25D366] overflow-hidden p-[3px] flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100 self-start w-full sm:w-auto cursor-pointer" onClick={handleWhatsAppClick}>
                    <button className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 px-8 rounded-full shadow-sm w-full h-full">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                      </svg>
                      Solicitar
                    </button>
                  </div>
                  
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
