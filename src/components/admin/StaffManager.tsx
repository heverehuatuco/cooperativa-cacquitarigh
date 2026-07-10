"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { Users, UserPlus, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface StaffUser {
  uid: string;
  name: string;
  email: string;
  role: string;
  createdAt: any;
}

export default function StaffManager() {
  const { role } = useAuth();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newRole, setNewRole] = useState("staff");

  // UI state feedback
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetched: StaffUser[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push(doc.data() as StaffUser);
      });
      setUsers(fetched);
    } catch (err) {
      console.error("Error al cargar personal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // 1. Obtener el Token de ID del usuario actual para autorizar la petición
      const token = await auth.currentUser?.getIdToken(true);
      if (!token) {
        throw new Error("No se pudo obtener el token de autorización. Vuelve a iniciar sesión.");
      }

      // 2. Llamar al API Route del servidor
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
          role: newRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error al crear la cuenta.");
      }

      setSuccess(`Cuenta creada con éxito para ${username}.`);
      setUsername("");
      setPassword("");

      // Recargar lista de usuarios
      fetchUsers();
    } catch (err: any) {
      console.error("Error al crear usuario de personal:", err);
      setError(err.message || "Error al registrar personal.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userToDelete: StaffUser) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas revocar el acceso a "${userToDelete.name}"? El usuario no podrá volver a iniciar sesión.`
      )
    ) {
      return;
    }

    setActionLoading(userToDelete.uid);
    try {
      // Eliminar el documento de Firestore.
      // Dado que AuthContext valida que el usuario exista en la colección "users" para autorizar el acceso,
      // al eliminar el documento de Firestore le quitamos el acceso de forma inmediata.
      await deleteDoc(doc(db, "users", userToDelete.uid));

      // Actualizar estado local
      setUsers(users.filter((u) => u.uid !== userToDelete.uid));
    } catch (err) {
      console.error("Error al revocar acceso:", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (role !== "admin") {
    return (
      <div className="p-6 bg-red-50 text-red-800 rounded-3xl border border-red-200 text-sm flex items-center space-x-2">
        <AlertCircle className="text-red-500 shrink-0" size={18} />
        <span>Acceso Denegado: Solo el Administrador tiene permisos para gestionar personal.</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Create User Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
            <UserPlus className="text-primary-brand" size={20} />
            <h3 className="font-bold text-stone-850 text-base">Registrar Nuevo Personal</h3>
          </div>

          <form onSubmit={handleCreateUser} className="space-y-4">
            {success && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-250 text-xs flex items-center space-x-2">
                <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 text-red-850 rounded-xl border border-red-200 text-xs flex items-center space-x-2">
                <AlertCircle className="text-red-500 shrink-0" size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 uppercase tracking-wider block">
                Usuario *
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej: carlitos"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 uppercase tracking-wider block">
                Contraseña *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 uppercase tracking-wider block">
                Rol *
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-brand/20 focus:border-primary-brand text-sm text-stone-800"
              >
                <option value="staff">Personal (Staff)</option>
                <option value="admin">Administrador (Admin)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex justify-center items-center space-x-2 bg-primary-brand hover:bg-primary-brand-light text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <span>Crear Cuenta Personal</span>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Staff List (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
            <Users className="text-primary-brand" size={20} />
            <h3 className="font-bold text-stone-850 text-base">Personal Registrado</h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-primary-brand mr-2" size={20} />
              <span className="text-stone-500 text-xs">Cargando lista de personal...</span>
            </div>
          ) : users.length === 0 ? (
            <p className="text-center py-10 text-stone-400 text-xs">
              No hay personal registrado. Crea la primera cuenta en el formulario de la izquierda.
            </p>
          ) : (
            <div className="divide-y divide-stone-100">
              {users.map((u) => (
                <div key={u.uid} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-stone-900 text-sm leading-tight">{(u as any).username || u.name}</h4>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-stone-100 text-stone-500 px-2 py-0.5 rounded">
                      Rol: {u.role}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(u)}
                    disabled={actionLoading === u.uid}
                    className="p-2 border border-red-100 hover:border-red-400 text-red-650 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Revocar acceso"
                  >
                    {actionLoading === u.uid ? (
                      <Loader2 className="animate-spin text-red-600" size={14} />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
