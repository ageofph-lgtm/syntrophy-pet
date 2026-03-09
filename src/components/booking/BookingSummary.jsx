import React from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { PawPrint, Clock, Calendar, User, Scissors, Euro } from "lucide-react";

export default function BookingSummary({ pet, services, professional, date, time, endTime, duration, totalPrice, groomingPrefs }) {
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/10 to-transparent p-5 border-b border-[#2A2A2A]">
        <h3 className="text-lg font-bold mb-1">Resumo da Marcação</h3>
        <p className="text-xs text-[#6B6B6B]">Confirme os detalhes antes de agendar</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Pet */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#222222] flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-orange-500/60" />
          </div>
          <div>
            <p className="text-sm font-semibold">{pet?.name}</p>
            <p className="text-[11px] text-[#6B6B6B]">{pet?.breed} · {pet?.weight_kg}kg</p>
          </div>
        </div>

        {/* Services */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#222222] flex items-center justify-center">
            <Scissors className="w-5 h-5 text-purple-400/60" />
          </div>
          <div>
            <p className="text-sm font-semibold">Serviços</p>
            {services?.map((s) => (
              <p key={s.id} className="text-[11px] text-[#6B6B6B]">{s.name} — {s.base_price}€</p>
            ))}
          </div>
        </div>

        {/* Grooming Details */}
        {groomingPrefs?.corpo && (
          <div className="bg-[#161616] rounded-xl p-3 border border-[#2A2A2A]">
            <p className="text-[10px] font-semibold text-[#A0A0A0] uppercase tracking-wider mb-2">Tosquia</p>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div><span className="text-[#6B6B6B]">Corpo:</span> <span className="text-[#F5F5F5]">{groomingPrefs.corpo}</span></div>
              <div><span className="text-[#6B6B6B]">Cabeça:</span> <span className="text-[#F5F5F5]">{groomingPrefs.cabeca}</span></div>
              <div><span className="text-[#6B6B6B]">Rabo:</span> <span className="text-[#F5F5F5]">{groomingPrefs.rabo}</span></div>
            </div>
            {groomingPrefs.perfume && (
              <p className="text-[11px] mt-1"><span className="text-[#6B6B6B]">Perfume:</span> <span className="text-[#F5F5F5]">{groomingPrefs.perfume}</span></p>
            )}
            {groomingPrefs.accessories && (
              <p className="text-[11px] mt-1"><span className="text-[#6B6B6B]">Acessório:</span> <span className="text-[#F5F5F5]">{groomingPrefs.accessories}</span></p>
            )}
          </div>
        )}

        {/* Schedule */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#222222] flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-400/60" />
          </div>
          <div>
            <p className="text-sm font-semibold">
              {date ? format(date, "d 'de' MMMM, yyyy", { locale: pt }) : "—"}
            </p>
            <p className="text-[11px] text-[#6B6B6B]">{time} — {endTime}</p>
          </div>
        </div>

        {/* Professional */}
        {professional && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#222222] flex items-center justify-center">
              <User className="w-5 h-5 text-green-400/60" />
            </div>
            <div>
              <p className="text-sm font-semibold">{professional}</p>
              <p className="text-[11px] text-[#6B6B6B]">Profissional</p>
            </div>
          </div>
        )}

        {/* Duration & Price */}
        <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
          <div className="flex items-center gap-2 text-[#A0A0A0]">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{duration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Euro className="w-4 h-4 text-orange-500" />
            <span className="text-xl font-bold text-orange-500">{totalPrice?.toFixed(2)}€</span>
          </div>
        </div>
      </div>
    </div>
  );
}