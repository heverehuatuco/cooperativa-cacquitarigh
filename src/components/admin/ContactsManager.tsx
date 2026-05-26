"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Mail, Trash2, CheckCircle2, MessageSquare, Loader2, Calendar } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "unread" | "read";
  createdAt: any;
}

export default function ContactsManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetched: ContactMessage[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as ContactMessage);
      });
      setMessages(fetched);
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    setActionLoading(id);
    try {
      const docRef = doc(db, "contacts", id);
      await updateDoc(docRef, { status: "read" });
      setMessages(messages.map((m) => (m.id === id ? { ...m, status: "read" } : m)));
    } catch (error) {
      console.error("Error al marcar como leído:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este mensaje?")) return;
    setActionLoading(id);
    try {
      await deleteDoc(doc(db, "contacts", id));
      setMessages(messages.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error al eliminar mensaje:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Sin fecha";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white rounded-3xl border border-stone-200">
        <Loader2 className="animate-spin text-primary-brand mr-2" size={24} />
        <span className="text-stone-500 text-sm">Cargando bandeja de entrada...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <MessageSquare className="text-primary-brand" size={22} />
          <h2 className="text-xl font-bold text-stone-850">Mensajes de Contacto</h2>
        </div>
        <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full">
          {messages.filter((m) => m.status === "unread").length} Nuevos
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 text-stone-400 space-y-2">
          <Mail size={40} className="mx-auto text-stone-300" />
          <p className="text-sm font-medium">Bandeja de entrada vacía.</p>
          <p className="text-xs text-stone-400">Los mensajes enviados desde el formulario público aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                msg.status === "unread"
                  ? "bg-stone-50 border-emerald-200/60 shadow-xs"
                  : "bg-white border-stone-150"
              }`}
            >
              {/* Header card info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-stone-100 pb-3 mb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-stone-900 text-base">{msg.name}</h3>
                    {msg.status === "unread" && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <p className="text-xs text-stone-500">
                    <span className="font-semibold">Email:</span> {msg.email} 
                    {msg.phone && ` | Cel: ${msg.phone}`}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 text-stone-400 text-xs shrink-0">
                  <Calendar size={12} />
                  <span>{formatDate(msg.createdAt)}</span>
                </div>
              </div>

              {/* Message subject and content */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-800 text-sm">
                  Asunto: <span className="font-semibold text-stone-700">{msg.subject}</span>
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap bg-stone-100/50 p-4 rounded-xl">
                  {msg.message}
                </p>
              </div>

              {/* Actions toolbar */}
              <div className="flex justify-end items-center space-x-2 mt-4 pt-3 border-t border-stone-100">
                {msg.status === "unread" && (
                  <button
                    onClick={() => handleMarkAsRead(msg.id)}
                    disabled={actionLoading === msg.id}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 border border-emerald-200/50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {actionLoading === msg.id ? (
                      <Loader2 className="animate-spin" size={12} />
                    ) : (
                      <CheckCircle2 size={12} />
                    )}
                    <span>Marcar Leído</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg.id)}
                  disabled={actionLoading === msg.id}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-red-650 hover:bg-red-50 border border-red-200/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  {actionLoading === msg.id ? (
                    <Loader2 className="animate-spin" size={12} />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
