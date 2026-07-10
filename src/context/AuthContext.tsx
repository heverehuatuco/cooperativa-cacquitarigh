"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  role: "admin" | "staff" | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "staff" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const email = firebaseUser.email?.toLowerCase().trim();
        
        // El correo del administrador principal (SuperAdmin)
        if (email === "heverehuatuco@gmail.com") {
          setUser(firebaseUser);
          setRole("admin");
          setLoading(false);
        } else {
          try {
            // Verificar si el usuario está registrado en la colección "users"
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const userRole = userDoc.data()?.role;
              if (userRole === "staff" || userRole === "admin") {
                setUser(firebaseUser);
                setRole(userRole);
              } else {
                await signOut(auth);
                setUser(null);
                setRole(null);
              }
            } else {
              // No autorizado - forzar el cierre de sesión
              await signOut(auth);
              setUser(null);
              setRole(null);
            }
          } catch (error) {
            console.error("Error al verificar el rol del usuario:", error);
            await signOut(auth);
            setUser(null);
            setRole(null);
          } finally {
            setLoading(false);
          }
        }
      } else {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setRole(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
