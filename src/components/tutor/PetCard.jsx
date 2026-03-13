import React, { useState } from "react";
import { PawPrint, Weight, AlertTriangle, Pencil, HeartPulse, Syringe, Bug, Droplets, Gift } from "lucide-react";
import PetAlertTags from "../shared/PetAlertTags";
import PetDetailModal from "./PetDetailModal";
import { differenceInDays, parseISO, format } from "date-fns";

export default function PetCard({ pet, onEdit, onSelect, selected }) {
  const [showDetail, setShowDetail] = useState(false);

  const hasVaccineWarning = pet.rabies_vaccine_expiry &&
    differenceInDays(parseISO(pet.rabies_vaccine_expiry), new Date()) < 30;
  const vaccineExpired = pet.rabies_vaccine_expiry &&
    differenceInDays(parseISO(pet.rabies_vaccine_expiry), new Date()) < 0;

  const handleClick = () => {
    if (onSelect) {
      onSelect(pet);
    } else {
      setShowDetail(true);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`relative bg-white border rounded-2xl overflow-hidden transition-all duration-200 shadow-sm cursor-pointer
          ${selected ? "border-violet-400 ring-2 ring-violet-100 bg-violet-50/30" : "border-stone-200 hover:border-violet-200 hover:shadow-md"}`}
      >
        {/* Vaccine urgent badge */}
        {hasVaccineWarning && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold shadow">
            <AlertTriangle className="w-2.5 h-2.5" />
            {vaccineExpired ? "Vacina expirada" : "Vacina a vencer"}
          </div>
        )}

        {/* Top: photo + name + breed */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {pet.photo_url ? (
              <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
            ) : (
              <PawPrint className="w-6 h-6 text-violet-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900">{pet.name}</h3>
              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowDetail(true)}
                  className="p-1.5 rounded-lg hover:bg-violet-50 text-stone-300 hover:text-violet-500 transition-colors">
                  <HeartPulse className="w-3.5 h-3.5" />
                </button>
                {onEdit && (
                  <button onClick={(e) => { e.stopPropagation(); onEdit(pet); }}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-300 hover:text-stone-600 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-stone-400 truncate">{pet.breed} · {pet.species}</p>
            <div className="mt-1.5"><PetAlertTags behavior={pet.behavior} allergies={pet.allergies_medical_info} /></div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-stone-100" />

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-stone-100 px-0 py-2">
          {/* Weight */}
          <div className="flex flex-col items-center py-1 px-2">
            <Weight className="w-3.5 h-3.5 text-stone-400 mb-0.5" />
            <p className="text-xs font-semibold text-stone-800">{pet.weight_kg ? `${pet.weight_kg}kg` : "—"}</p>
            <p className="text-[9px] text-stone-400">Peso</p>
          </div>

          {/* Vaccine */}
          <div className="flex flex-col items-center py-1 px-2">
            <Syringe className={`w-3.5 h-3.5 mb-0.5 ${hasVaccineWarning ? "text-red-400" : "text-emerald-500"}`} />
            <p className={`text-xs font-semibold ${hasVaccineWarning ? "text-red-600" : "text-stone-800"}`}>
              {pet.rabies_vaccine_expiry ? format(parseISO(pet.rabies_vaccine_expiry), "MM/yy") : "—"}
            </p>
            <p className="text-[9px] text-stone-400">Vacina</p>
          </div>

          {/* Microchip */}
          <div className="flex flex-col items-center py-1 px-2">
            <Droplets className="w-3.5 h-3.5 text-blue-400 mb-0.5" />
            <p className="text-xs font-semibold text-stone-800 text-center leading-tight">
              {pet.microchip_number ? (
                <span className="font-mono text-[9px]">{pet.microchip_number.slice(-6)}</span>
              ) : "—"}
            </p>
            <p className="text-[9px] text-stone-400">Microchip</p>
          </div>
        </div>

        {/* Allergies / notes preview */}
        {pet.allergies_medical_info && (
          <>
            <div className="mx-4 border-t border-stone-100" />
            <div className="px-4 py-2">
              <p className="text-[10px] text-stone-400 uppercase tracking-wide font-medium mb-0.5">Obs. médicas</p>
              <p className="text-xs text-stone-600 line-clamp-2">{pet.allergies_medical_info}</p>
            </div>
          </>
        )}

        {/* Vet contact */}
        {pet.vet_contact && (
          <>
            <div className="mx-4 border-t border-stone-100" />
            <div className="px-4 py-2 flex items-center gap-1.5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wide font-medium">Vet:</span>
              <span className="text-xs text-stone-600">{pet.vet_contact}</span>
            </div>
          </>
        )}

        {/* Tap hint */}
        {!onSelect && (
          <div className="px-4 pb-3 pt-1">
            <p className="text-[9px] text-stone-300 text-center">Toque para ver ficha completa</p>
          </div>
        )}

        {selected && (
          <div className="absolute top-2 left-2 w-5 h-5 bg-stone-950 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      <PetDetailModal
        pet={pet}
        open={showDetail}
        onClose={() => setShowDetail(false)}
        onPetUpdated={() => {}}
      />
    </>
  );
}