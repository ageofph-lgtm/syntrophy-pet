import React from "react";
import { Clock, Scissors, CheckCircle2, Package } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const STEPS = [
  { key: "confirmado",   label: "Confirmado",   icon: Clock },
  { key: "em_andamento", label: "Em serviço",   icon: Scissors },
  { key: "pronto",       label: "Pronto! 🎀",   icon: Package },
  { key: "concluido",    label: "Concluído",     icon: CheckCircle2 },
];

export default function LiveTrackingCard({ appointment }) {
  const currentIndex = STEPS.findIndex((s) => s.key === appointment.status);
  const isActive = ["confirmado", "em_andamento", "pronto"].includes(appointment.status);

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 shadow-lg ${
      isActive
        ? "bg-gradient-to-br from-violet-600 to-violet-800"
        : "bg-gradient-to-br from-stone-700 to-stone-900"
    }`}>
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[10px] font-semibold uppercase tracking-widest ${isActive ? "text-violet-300" : "text-stone-400"}`}>
            Acompanhamento
          </span>
          {isActive ? (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-300 font-medium">Ao Vivo</span>
            </span>
          ) : (
            <span className="text-xs text-stone-400">
              {appointment.scheduled_date && format(new Date(appointment.scheduled_date + "T00:00:00"), "d MMM", { locale: pt })}
            </span>
          )}
        </div>
        <h3 className="text-white font-bold text-base mb-0.5">{appointment.pet_name}</h3>
        <p className={`text-xs mb-5 ${isActive ? "text-violet-300" : "text-stone-400"}`}>{appointment.service_names}</p>

        <div className="flex items-center">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isDone = i < currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
                    ${isCurrent ? "bg-white text-violet-600 shadow-lg scale-110" : isDone ? "bg-white/30 text-white" : "bg-white/10 text-white/30"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[8px] font-medium text-center leading-tight max-w-[50px]
                    ${isCurrent ? "text-white" : isDone ? "text-white/70" : "text-white/30"}`}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full mx-1 mb-4 transition-all duration-300
                    ${i < currentIndex ? "bg-white/40" : "bg-white/10"}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}