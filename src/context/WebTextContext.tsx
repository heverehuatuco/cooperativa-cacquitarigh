"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface WebTextContextType {
  texts: Record<string, string>;
  loading: boolean;
  updateText: (key: string, newText: string) => Promise<void>;
}

const WebTextContext = createContext<WebTextContextType>({
  texts: {},
  loading: true,
  updateText: async () => {},
});

export const WebTextProvider = ({ children }: { children: React.ReactNode }) => {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const docRef = doc(db, "settings", "web_texts");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTexts(docSnap.data() as Record<string, string>);
        }
      } catch (error) {
        console.error("Error fetching web texts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTexts();
  }, []);

  const updateText = async (key: string, newText: string) => {
    try {
      const docRef = doc(db, "settings", "web_texts");
      // Update local state optimistically
      setTexts((prev) => ({ ...prev, [key]: newText }));
      
      // We use merge: true to avoid overwriting other keys that might have been updated
      await setDoc(docRef, { [key]: newText }, { merge: true });
    } catch (error) {
      console.error("Error updating web text:", error);
      // Opcional: Revert local state if save fails
    }
  };

  return (
    <WebTextContext.Provider value={{ texts, loading, updateText }}>
      {children}
    </WebTextContext.Provider>
  );
};

export const useWebText = () => useContext(WebTextContext);
