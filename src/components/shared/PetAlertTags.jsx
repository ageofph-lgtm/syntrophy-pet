import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export default function PetAlertTags({ behavior, allergies }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {behavior === "agressivo" && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 text-[10px] font-semibold uppercase tracking-wide border border-red-500/30">
          <ShieldAlert className="w-3 h-3" />
          Agressivo
        </span>
      )}
      {behavior === "agitado" && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-semibold uppercase tracking-wide border border-amber-500/30">
          <AlertTriangle className="w-3 h-3" />
          Agitado
        </span>
      )}
      {allergies && allergies.trim() && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 text-[10px] font-semibold uppercase tracking-wide border border-orange-500/30">
          <AlertTriangle className="w-3 h-3" />
          Alérgico
        </span>
      )}
    </div>
  );
}