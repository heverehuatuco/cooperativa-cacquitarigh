"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWebText } from "@/context/WebTextContext";
import { useAuth } from "@/context/AuthContext";
import { Edit2, Check, X } from "lucide-react";

interface EditableTextProps {
  textKey: string;
  defaultText: string;
  as?: React.ElementType;
  className?: string;
  multiline?: boolean;
}

export default function EditableText({
  textKey,
  defaultText,
  as: Component = "span",
  className = "",
  multiline = false,
}: EditableTextProps) {
  const { texts, updateText } = useWebText();
  const { role } = useAuth();
  const isAdmin = role === "admin";
  
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(defaultText);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const displayText = texts[textKey] || defaultText;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    await updateText(textKey, value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(displayText);
    setIsEditing(false);
  };

  if (!isAdmin) {
    return <Component className={className} dangerouslySetInnerHTML={{ __html: displayText }} />;
  }

  if (isEditing) {
    return (
      <span className="relative inline-block w-full z-50 font-sans">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`w-full p-2 border-2 border-[#75a331] rounded-md bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#75a331]/50 ${className}`}
            rows={4}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`w-full p-2 border-2 border-[#75a331] rounded-md bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#75a331]/50 ${className}`}
          />
        )}
        <span className="absolute -bottom-10 right-0 flex gap-2 bg-white p-1 rounded-md shadow-lg border border-stone-200">
          <button
            onClick={handleSave}
            className="p-1.5 bg-[#75a331] text-white rounded hover:bg-[#5c8227] transition-colors"
            title="Guardar"
          >
            <Check size={16} />
          </button>
          <button
            onClick={handleCancel}
            className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            title="Cancelar"
          >
            <X size={16} />
          </button>
        </span>
      </span>
    );
  }

  return (
    <span className="group relative inline-block">
      <Component className={className} dangerouslySetInnerHTML={{ __html: displayText }} />
      <button
        onClick={() => {
          setValue(displayText);
          setIsEditing(true);
        }}
        className="absolute -top-3 -right-6 p-1.5 bg-white border border-stone-200 text-[#75a331] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-stone-50 z-40"
        title="Editar texto"
      >
        <Edit2 size={14} />
      </button>
    </span>
  );
}
