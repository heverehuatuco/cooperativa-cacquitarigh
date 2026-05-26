"use client";

import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { FileText, Trash2, Edit, Plus, Loader2, Upload, AlertCircle, X } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  storagePath: string;
  date: string;
}

export default function NewsManager() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Upload/Submit states
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetched: NewsArticle[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as NewsArticle);
      });
      setArticles(fetched);
    } catch (err) {
      console.error("Error al cargar noticias:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openAddForm = () => {
    setEditingArticle(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setImageFile(null);
    setError("");
    setIsFormOpen(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openEditForm = (art: NewsArticle) => {
    setEditingArticle(art);
    setTitle(art.title);
    setExcerpt(art.excerpt);
    setContent(art.content);
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
    if (!title || !excerpt || !content) {
      setError("Por favor completa los campos obligatorios.");
      return;
    }

    if (!editingArticle && !imageFile) {
      setError("Por favor selecciona una imagen de portada para la noticia.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      let downloadUrl = editingArticle ? editingArticle.imageUrl : "";
      let storagePath = editingArticle ? editingArticle.storagePath : "";

      // 1. Si hay un archivo seleccionado, subirlo a Storage
      if (imageFile) {
        // Si estamos editando y ya había una imagen, borrarla primero
        if (editingArticle && editingArticle.storagePath) {
          const oldRef = ref(storage, editingArticle.storagePath);
          await deleteObject(oldRef).catch((err) =>
            console.warn("No se pudo borrar la imagen anterior:", err)
          );
        }

        storagePath = `news/${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        // Esperar a que se complete la subida
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

      // Fecha legible formateada localmente
      const dateStr = new Date().toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      if (editingArticle) {
        // 2a. Actualizar en Firestore
        const docRef = doc(db, "news", editingArticle.id);
        await updateDoc(docRef, {
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          imageUrl: downloadUrl,
          storagePath: storagePath,
          updatedAt: new Date(),
        });

        // Actualizar estado local
        setArticles(
          articles.map((art) =>
            art.id === editingArticle.id
              ? {
                  ...art,
                  title: title.trim(),
                  excerpt: excerpt.trim(),
                  content: content.trim(),
                  imageUrl: downloadUrl,
                  storagePath,
                }
              : art
          )
        );
      } else {
        // 2b. Crear en Firestore
        const docRef = await addDoc(collection(db, "news"), {
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          imageUrl: downloadUrl,
          storagePath,
          date: dateStr,
          createdAt: new Date(),
        });

        const newArt: NewsArticle = {
          id: docRef.id,
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          imageUrl: downloadUrl,
          storagePath,
          date: dateStr,
        };

        setArticles([newArt, ...articles]);
      }

      setIsFormOpen(false);
    } catch (err: any) {
      console.error("Error al procesar noticia:", err);
      setError(err.message || "Error al registrar la noticia.");
    } finally {
      setSubmitting(false);
      setProgress(null);
    }
  };

  const handleDelete = async (art: NewsArticle) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la noticia "${art.title}"?`)) return;
    setActionLoading(art.id);
    try {
      // 1. Eliminar portada de Storage
      if (art.storagePath) {
        const storageRef = ref(storage, art.storagePath);
        await deleteObject(storageRef).catch((err) =>
          console.warn("No se encontró la imagen en Storage:", err)
        );
      }

      // 2. Eliminar de Firestore
      await deleteDoc(doc(db, "news", art.id));

      // 3. Actualizar estado local
      setArticles(articles.filter((a) => a.id !== art.id));
    } catch (err) {
      console.error("Error al eliminar noticia:", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white rounded-3xl border border-stone-200">
        <Loader2 className="animate-spin text-primary-brand mr-2" size={24} />
        <span className="text-stone-500 text-sm">Cargando noticias y publicaciones...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <FileText className="text-primary-brand" size={22} />
          <h2 className="text-xl font-bold text-stone-850">Gestión de Noticias y Blog</h2>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center space-x-1.5 bg-primary-brand hover:bg-primary-brand-light text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 shadow-sm cursor-pointer"
        >
          <Plus size={14} />
          <span>Nueva Publicación</span>
        </button>
      </div>

      {/* Articles list layout */}
      {articles.length === 0 ? (
        <div className="text-center py-16 text-stone-400 space-y-2 border-2 border-dashed border-stone-200 rounded-3xl">
          <FileText size={40} className="mx-auto text-stone-300" />
          <p className="text-sm font-medium">No hay noticias publicadas.</p>
          <p className="text-xs text-stone-400">Las noticias creadas se mostrarán en la web pública.</p>
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          {articles.map((art) => (
            <div
              key={art.id}
              className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center space-x-4 max-w-3xl">
                <div className="h-16 w-24 bg-stone-100 rounded-xl overflow-hidden shrink-0 border border-stone-200/40">
                  <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base line-clamp-1">{art.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{art.excerpt}</p>
                  <span className="text-[10px] text-tertiary-brand font-semibold block">{art.date}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => openEditForm(art)}
                  disabled={actionLoading === art.id}
                  className="p-2 border border-stone-200 hover:border-stone-400 text-stone-600 hover:text-stone-950 rounded-lg transition-colors cursor-pointer"
                  title="Editar noticia"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(art)}
                  disabled={actionLoading === art.id}
                  className="p-2 border border-red-200/30 hover:border-red-400 text-red-650 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Eliminar noticia"
                >
                  {actionLoading === art.id ? (
                    <Loader2 className="animate-spin text-red-600" size={14} />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal (Add/Edit Form) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-stone-200 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-lg flex items-center space-x-2">
                <span>{editingArticle ? "Editar Noticia" : "Nueva Noticia"}</span>
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

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 uppercase">Título de la Noticia *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Culminó con éxito el acopio de cacao especial"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-850"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 uppercase">Resumen / Extracto *</label>
                <input
                  type="text"
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Breve descripción que se muestra en la vista previa (max 2 líneas)"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-850"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 uppercase">Contenido Detallado *</label>
                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe el cuerpo completo del artículo..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-850 resize-none"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-stone-700 uppercase block">
                  Imagen de Portada {editingArticle ? "(Opcional)" : "*"}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="news-cover-upload"
                  />
                  <label
                    htmlFor="news-cover-upload"
                    className="inline-flex items-center space-x-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-750 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    <Upload size={14} />
                    <span>Seleccionar Archivo</span>
                  </label>
                  <span className="text-xs text-stone-500 truncate max-w-xs">
                    {imageFile ? imageFile.name : editingArticle ? "Mapeada de la actual" : "Ningún archivo"}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              {progress !== null && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold text-stone-600">
                    <span>Subiendo imagen de portada...</span>
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
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-750 hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
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
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <span>Guardar Publicación</span>
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
