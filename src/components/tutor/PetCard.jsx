import React from "react";
import { PawPrint, Weight, AlertTriangle, Pencil } from "lucide-react";
import PetAlertTags from "../shared/PetAlertTags";

export default function PetCard({ pet, onEdit, onSelect, selected }) {
  const hasVaccineWarning = pet.rabies_vaccine_expiry &&
    new Date(pet.rabies_vaccine_expiry) < new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

  return (
    <div
      onClick={() => onSelect?.(pet)}
      className={`relative bg-white border rounded-2xl p-4 transition-all duration-200 shadow-sm
        ${onSelect ? "cursor-pointer" : ""}
        ${selected ? "border-violet-400 ring-2 ring-violet-100 bg-violet-50/30" : "border-stone-200 hover:border-stone-300 hover:shadow-md"}`}
    >
      {hasVaccineWarning && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
          <AlertTriangle className="w-3 h-3 text-white" />
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden flex-shrink-0">
          {pet.photo_url ? (
            <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
          ) : (
            <PawPrint className="w-6 h-6 text-violet-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-stone-900">{pet.name}</h3>
            {onEdit && (
              <button onClick={(e) => { e.stopPropagation(); onEdit(pet); }}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-0.5">{pet.breed} · {pet.species}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] text-stone-500">
              <Weight className="w-3 h-3" />{pet.weight_kg}kg
            </span>
          </div>
          <div className="mt-2"><PetAlertTags behavior={pet.behavior} allergies={pet.allergies_medical_info} /></div>
        </div>
      </div>
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-stone-950 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      {hasVaccineWarning && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
          <p className="text-[10px] text-red-600 font-medium">⚠ Vacina da raiva a vencer em breve</p>
        </div>
      )}
    </div>
  );
}