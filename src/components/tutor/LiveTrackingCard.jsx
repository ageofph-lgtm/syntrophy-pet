import React from "react";
import { Clock, Scissors, CheckCircle2 } from "lucide-react";

const STEPS = [
  { key: "confirmado",   label: "Confirmado",  icon: Clock },
  { key: "em_andamento", label: "Em Serviço",  icon: Scissors },
  { key: "pronto",       label: "Pronto! 🎀",  icon: CheckCircle2 },
];

export default function LiveTrackingCard({ appointment }) {
  const currentIndex = STEPS.findIndex((s) => s.key === appointment.status);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl p-5 shadow-lg">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-violet-300 font-semibold uppercase tracking-widest">Acompanhamento</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-300 font-medium">Ao Vivo</span>
          </span>
        </div>
        <h3 className="text-white font-bold text-base mb-0.5">{appointment.pet_name}</h3>
        <p className="text-violet-300 text-xs mb-5">{appointment.service_names}</p>

        <div className="flex items-center">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isDone = i < currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                    ${isCurrent ? "bg-white text-violet-600 shadow-lg scale-110" : isDone ? "bg-violet-400/60 text-white" : "bg-white/10 text-violet-400"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-medium text-center leading-tight max-w-[56px]
                    ${isCurrent ? "text-white" : isDone ? "text-violet-300" : "text-violet-500"}`}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full mx-1 mb-4 transition-all duration-300
                    ${i < currentIndex ? "bg-violet-300" : "bg-white/10"}`}
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