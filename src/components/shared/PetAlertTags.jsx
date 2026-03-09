import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export default function PetAlertTags({ behavior, allergies }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {behavior === "agressivo" && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-semibold uppercase tracking-wide border border-red-200">
          <ShieldAlert className="w-3 h-3" />
          Agressivo
        </span>
      )}
      {behavior === "agitado" && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-semibold uppercase tracking-wide border border-amber-200">
          <AlertTriangle className="w-3 h-3" />
          Agitado
        </span>
      )}
      {allergies && allergies.trim() && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-semibold uppercase tracking-wide border border-orange-200">
          <AlertTriangle className="w-3 h-3" />
          Alérgico
        </span>
      )}
    </div>
  );
}