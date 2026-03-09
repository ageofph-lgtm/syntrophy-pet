import React from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { PawPrint, Clock, Calendar, User, Scissors, Euro } from "lucide-react";

export default function BookingSummary({ pet, services, professional, date, time, endTime, duration, totalPrice, groomingPrefs }) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-orange-50 to-transparent p-5 border-b border-stone-100">
        <h3 className="text-lg font-bold text-stone-900 mb-1">Resumo da Marcação</h3>
        <p className="text-xs text-stone-400">Confirme os detalhes antes de agendar</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Pet */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900">{pet?.name}</p>
            <p className="text-[11px] text-stone-400">{pet?.breed} · {pet?.weight_kg}kg</p>
          </div>
        </div>

        {/* Services */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
            <Scissors className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900">Serviços</p>
            {services?.map((s) => (
              <p key={s.id} className="text-[11px] text-stone-400">{s.name} — {s.base_price}€</p>
            ))}
          </div>
        </div>

        {/* Grooming Details */}
        {groomingPrefs?.corpo && (
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">Tosquia</p>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div><span className="text-stone-400">Corpo:</span> <span className="text-stone-800 font-medium">{groomingPrefs.corpo}</span></div>
              <div><span className="text-stone-400">Cabeça:</span> <span className="text-stone-800 font-medium">{groomingPrefs.cabeca}</span></div>
              <div><span className="text-stone-400">Rabo:</span> <span className="text-stone-800 font-medium">{groomingPrefs.rabo}</span></div>
            </div>
            {groomingPrefs.perfume && <p className="text-[11px] mt-1"><span className="text-stone-400">Perfume:</span> <span className="text-stone-700">{groomingPrefs.perfume}</span></p>}
            {groomingPrefs.accessories && <p className="text-[11px] mt-1"><span className="text-stone-400">Acessório:</span> <span className="text-stone-700">{groomingPrefs.accessories}</span></p>}
          </div>
        )}

        {/* Schedule */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900">
              {date ? format(date, "d 'de' MMMM, yyyy", { locale: pt }) : "—"}
            </p>
            <p className="text-[11px] text-stone-400">{time} — {endTime}</p>
          </div>
        </div>

        {/* Professional */}
        {professional && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900">{professional}</p>
              <p className="text-[11px] text-stone-400">Profissional</p>
            </div>
          </div>
        )}

        {/* Duration & Price */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div className="flex items-center gap-2 text-stone-500">
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