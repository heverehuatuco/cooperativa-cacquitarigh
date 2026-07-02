"use client";

import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { ShoppingBag, Trash2, Edit, Plus, Loader2, Upload, AlertCircle, X, CheckSquare, Square } from "lucide-react";
import NextImage from "next/image";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  storagePath: string;
  available: boolean;
}

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("cafe");
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Upload/Submit states
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetched: Product[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(fetched);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddForm = () => {
    setEditingProduct(null);
    setName("");
    setCategory("cafe");
    setDescription("");
    setAvailable(true);
    setImageFile(null);
    setError("");
    setIsFormOpen(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategory(prod.category);
    setDescription(prod.description);
    setAvailable(prod.available);
    setImageFile(null);
    setError("");
    setIsFormOpen(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError("Por favor completa los campos obligatorios.");
      return;
    }

    if (!editingProduct && !imageFile) {
      setError("Por favor selecciona una imagen para el producto.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      let downloadUrl = editingProduct ? editingProduct.imageUrl : "";
      let storagePath = editingProduct ? editingProduct.storagePath : "";

      // 1. Si hay una nueva imagen cargada, procesarla en Storage
      if (imageFile) {
        if (editingProduct && editingProduct.storagePath) {
          const oldRef = ref(storage, editingProduct.storagePath);
          await deleteObject(oldRef).catch((err) =>
            console.warn("No se pudo borrar la imagen anterior:", err)
          );
        }

        storagePath = `products/${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(Math.round(prog));
            },
            (err) => reject(err),
            async () => {
              downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              setProgress(null);
              resolve();
            }
          );
        });
      }

      if (editingProduct) {
        // 2a. Actualizar en Firestore
        const docRef = doc(db, "products", editingProduct.id);
        await updateDoc(docRef, {
          name: name.trim(),
          category: category,
          description: description.trim(),
          available: available,
          imageUrl: downloadUrl,
          storagePath: storagePath,
          updatedAt: new Date(),
        });

        // Actualizar estado local
        setProducts(
          products.map((p) =>
            p.id === editingProduct.id
              ? {
                ...p,
                name: name.trim(),
                category: category,
                description: description.trim(),
                available: available,
                imageUrl: downloadUrl,
                storagePath,
              }
              : p
          )
        );
      } else {
        // 2b. Crear en Firestore
        const docRef = await addDoc(collection(db, "products"), {
          name: name.trim(),
          category: category,
          description: description.trim(),
          available: available,
          imageUrl: downloadUrl,
          storagePath,
          createdAt: new Date(),
        });

        const newProd: Product = {
          id: docRef.id,
          name: name.trim(),
          category: category,
          description: description.trim(),
          available: available,
          imageUrl: downloadUrl,
          storagePath,
        };

        setProducts([newProd, ...products]);
      }

      setIsFormOpen(false);
    } catch (err: any) {
      console.error("Error al procesar producto:", err);
      setError(err.message || "Error al registrar el producto.");
    } finally {
      setSubmitting(false);
      setProgress(null);
    }
  };

  const handleDelete = async (prod: Product) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el producto "${prod.name}"?`)) return;
    setActionLoading(prod.id);
    try {
      // 1. Eliminar imagen de Storage
      if (prod.storagePath) {
        const storageRef = ref(storage, prod.storagePath);
        await deleteObject(storageRef).catch((err) =>
          console.warn("No se encontró la imagen en Storage:", err)
        );
      }

      // 2. Eliminar de Firestore
      await deleteDoc(doc(db, "products", prod.id));

      // 3. Actualizar estado local
      setProducts(products.filter((p) => p.id !== prod.id));
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleAvailability = async (prod: Product) => {
    setActionLoading(prod.id);
    const newStatus = !prod.available;
    try {
      const docRef = doc(db, "products", prod.id);
      await updateDoc(docRef, { available: newStatus });
      setProducts(products.map((p) => (p.id === prod.id ? { ...p, available: newStatus } : p)));
    } catch (err) {
      console.error("Error al actualizar disponibilidad:", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white rounded-3xl border border-stone-200">
        <Loader2 className="animate-spin text-primary-brand mr-2" size={24} />
        <span className="text-stone-500 text-sm">Cargando catálogo de productos...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <ShoppingBag className="text-primary-brand" size={22} />
          <h2 className="text-xl font-bold text-stone-850">Gestión de Productos</h2>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center space-x-1.5 bg-primary-brand hover:bg-primary-brand-light text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 shadow-sm cursor-pointer"
        >
          <Plus size={14} />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Catalog items list */}
      {products.length === 0 ? (
        <div className="text-center py-16 text-stone-400 space-y-2 border-2 border-dashed border-stone-200 rounded-3xl">
          <ShoppingBag size={40} className="mx-auto text-stone-300" />
          <p className="text-sm font-medium">El catálogo está vacío.</p>
          <p className="text-xs text-stone-400">Los productos creados se mostrarán en la web pública.</p>
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center space-x-4 max-w-3xl">
                <div className="h-16 w-16 bg-stone-100 rounded-xl overflow-hidden shrink-0 border border-stone-200/40 relative">
                  <NextImage src={prod.imageUrl} alt={prod.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-none">{prod.name}</h3>
                    <span className="text-[9px] font-bold tracking-widest uppercase bg-stone-100 text-stone-650 px-2 py-0.5 rounded">
                      {prod.category === "cafe" ? "Café" : "Cacao"}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{prod.description}</p>
                </div>
              </div>

              {/* Actions & Availability */}
              <div className="flex items-center space-x-4 shrink-0 self-end sm:self-auto">
                {/* Availability Toggle */}
                <button
                  onClick={() => toggleAvailability(prod)}
                  disabled={actionLoading === prod.id}
                  className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-70 ${prod.available
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                      : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                    }`}
                >
                  {prod.available ? <CheckSquare size={14} /> : <Square size={14} />}
                  <span>{prod.available ? "Disponible" : "Agotado"}</span>
                </button>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => openEditForm(prod)}
                    disabled={actionLoading === prod.id}
                    className="p-2 border border-stone-200 hover:border-stone-400 text-stone-600 hover:text-stone-950 rounded-lg transition-colors cursor-pointer"
                    title="Editar producto"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(prod)}
                    disabled={actionLoading === prod.id}
                    className="p-2 border border-red-200/30 hover:border-red-400 text-red-650 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar producto"
                  >
                    {actionLoading === prod.id ? (
                      <Loader2 className="animate-spin text-red-600" size={14} />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col border border-stone-200 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-lg flex items-center space-x-2">
                <span>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</span>
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 uppercase">Nombre del Producto *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}

                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-850"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 uppercase">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-850"
                  >
                    <option value="cafe">Café</option>
                    <option value="cacao">Cacao</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 uppercase">Descripción</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-850 resize-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="prod-available"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className="h-4 w-4 text-primary-brand focus:ring-primary-brand/20 border-stone-300 rounded"
                />
                <label htmlFor="prod-available" className="text-sm font-bold text-stone-750 cursor-pointer">
                  Producto disponible para cotizar
                </label>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-stone-700 uppercase block">
                  Imagen del Producto {editingProduct ? "(Opcional)" : "*"}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="product-image-upload"
                  />
                  <label
                    htmlFor="product-image-upload"
                    className="inline-flex items-center space-x-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-750 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    <Upload size={14} />
                    <span>Seleccionar Archivo</span>
                  </label>
                  <span className="text-xs text-stone-500 truncate max-w-xs">
                    {imageFile ? imageFile.name : editingProduct ? "Mantener actual" : "Ningún archivo"}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              {progress !== null && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold text-stone-600">
                    <span>Subiendo imagen del producto...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex justify-center items-center space-x-2 bg-primary-brand hover:bg-primary-brand-light text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-xs"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Producto</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
