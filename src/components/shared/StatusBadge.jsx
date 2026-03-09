import React from "react";
import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  pendente:    { label: "Pendente",    color: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmado:  { label: "Confirmado",  color: "bg-blue-50 text-blue-700 border-blue-200" },
  em_andamento:{ label: "Em Andamento",color: "bg-violet-50 text-violet-700 border-violet-200" },
  pronto:      { label: "Pronto",      color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  concluido:   { label: "Concluído",   color: "bg-stone-100 text-stone-500 border-stone-200" },
  cancelado:   { label: "Cancelado",   color: "bg-red-50 text-red-600 border-red-200" },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pendente;
  return (
    <Badge className={`${config.color} border text-[10px] font-semibold px-2 py-0.5 rounded-full`}>
      {config.label}
    </Badge>
  );
}