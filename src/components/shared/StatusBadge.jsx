import React from "react";
import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  pendente: { label: "Pendente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  confirmado: { label: "Confirmado", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  em_andamento: { label: "Em Andamento", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  pronto: { label: "Pronto", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  concluido: { label: "Concluído", color: "bg-[#2A2A2A] text-[#A0A0A0] border-[#2A2A2A]" },
  cancelado: { label: "Cancelado", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pendente;
  return (
    <Badge className={`${config.color} border text-[10px] font-medium px-2 py-0.5`}>
      {config.label}
    </Badge>
  );
}