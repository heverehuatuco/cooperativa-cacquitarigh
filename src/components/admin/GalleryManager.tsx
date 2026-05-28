"use client";

import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, doc, addDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Image, Trash2, Plus, Loader2, Upload, AlertCircle } from "lucide-react";
import NextImage from "next/image";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  storagePath: string;
}

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("cafe");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Upload progress states
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetched: GalleryItem[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as GalleryItem);
      });
      setItems(fetched);
    } catch (error) {
      console.error("Error al cargar galería:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageFile) {
      setUploadError("Por favor ingresa un título y selecciona una imagen.");
      return;
    }

    setSubmitting(true);
    setUploadError("");
    setUploadProgress(0);

    const storagePath = `gallery/${Date.now()}_${imageFile.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        console.error("Error al subir archivo:", error);
        setUploadError("Error al cargar el archivo en el servidor. Inténtalo de nuevo.");
        setSubmitting(false);
        setUploadProgress(null);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // Crear registro en Firestore
          const docRef = await addDoc(collection(db, "gallery"), {
            title: title.trim(),
            description: description.trim(),
            category,
            imageUrl: downloadUrl,
            storagePath,
            createdAt: new Date(),
          });

          // Agregar al estado local
          const newItem: GalleryItem = {
            id: docRef.id,
            title: title.trim(),
            description: description.trim(),
            category,
            imageUrl: downloadUrl,
            storagePath,
          };

          setItems([newItem, ...items]);

          // Resetear formulario
          setTitle("");
          setDescription("");
          setCategory("cafe");
          setImageFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          setIsAdding(false);
        } catch (err: any) {
          console.error("Error al guardar en base de datos:", err);
          setUploadError("Error al registrar los metadatos de la imagen.");
        } finally {
          setSubmitting(false);
          setUploadProgress(null);
        }
      }
    );
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la imagen "${item.title}"?`)) return;
    setActionLoading(item.id);
    try {
      // 1. Eliminar de Storage
      if (item.storagePath) {
        const storageRef = ref(storage, item.storagePath);
        await deleteObject(storageRef).catch((err) => {
          // Si ya no existe en Storage, ignoramos el error para poder limpiar la base de datos
          console.warn("El archivo no se encontró en Storage:", err);
        });
      }

      // 2. Eliminar de Firestore
      await deleteDoc(doc(db, "gallery", item.id));

      // 3. Actualizar estado local
      setItems(items.filter((i) => i.id !== item.id));
    } catch (error) {
      console.error("Error al eliminar item de galería:", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white rounded-3xl border border-stone-200">
        <Loader2 className="animate-spin text-primary-brand mr-2" size={24} />
        <span className="text-stone-500 text-sm">Cargando fotos de la galería...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <Image className="text-primary-brand" size={22} />
          <h2 className="text-xl font-bold text-stone-850">Galería de Fotos</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center space-x-1.5 bg-primary-brand hover:bg-primary-brand-light text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 shadow-sm cursor-pointer"
        >
          {isAdding ? "Cancelar" : "Agregar Foto"}
        </button>
      </div>

      {/* Add Photo Form Panel */}
      {isAdding && (
        <form
          onSubmit={handleAddImage}
          className="p-6 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-4 max-w-2xl"
        >
          <h3 className="font-bold text-stone-900 text-lg flex items-center space-x-2">
              <span>Nueva Imagen</span>
            </h3>

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase">Título de la Foto *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Secando granos de café"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-800"
              >
                <option value="cafe">Café</option>
                <option value="cacao">Cacao</option>
                <option value="instalaciones">Instalaciones / Campo</option>
                <option value="otros">Otros</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase">Descripción corta</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Grano pergamino expuesto al sol natural en camas africanas."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 uppercase block">Seleccionar Imagen *</label>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                id="gallery-file-upload"
              />
              <label
                htmlFor="gallery-file-upload"
                className="inline-flex items-center space-x-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Upload size={14} />
                <span>Examinar</span>
              </label>
              <span className="text-xs text-stone-500 truncate max-w-xs">
                {imageFile ? imageFile.name : "Ningún archivo seleccionado"}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          {uploadProgress !== null && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-bold text-stone-600">
                <span>Subiendo archivo...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex justify-center items-center space-x-2 bg-primary-brand hover:bg-primary-brand-light text-white font-bold py-3 px-5 rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-xs"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                <span>Guardando...</span>
              </>
            ) : (
              <span>Subir y Guardar</span>
            )}
          </button>
        </form>
      )}

      {/* Images Grid */}
      {items.length === 0 ? (
        <div className="text-center py-16 text-stone-400 space-y-2 border-2 border-dashed border-stone-200 rounded-3xl">
          <Image size={40} className="mx-auto text-stone-300" />
          <p className="text-sm font-medium">No hay fotos en la galería.</p>
          <p className="text-xs text-stone-400">Las fotos subidas se mostrarán en la web pública.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative bg-stone-50 rounded-2xl overflow-hidden border border-stone-200/50 flex flex-col justify-between"
            >
              {/* Photo */}
              <div className="aspect-4/3 relative bg-stone-200">
                <NextImage src={item.imageUrl} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                <span className="absolute top-3 left-3 text-[9px] font-bold tracking-widest uppercase bg-stone-900/80 text-tertiary-brand px-2.5 py-1 rounded-full backdrop-blur-xs z-10">
                  {item.category === "cafe"
                    ? "Café"
                    : item.category === "cacao"
                    ? "Cacao"
                    : item.category === "instalaciones"
                    ? "Campo"
                    : "Otros"}
                </span>
                
                {/* Delete button float */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={actionLoading === item.id}
                    className="p-3 bg-red-650 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg cursor-pointer disabled:opacity-75"
                    title="Eliminar de galería"
                  >
                    {actionLoading === item.id ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Text info */}
              <div className="p-4 space-y-1">
                <h4 className="font-bold text-stone-900 text-sm line-clamp-1">{item.title}</h4>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {item.description || "Sin descripción."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
