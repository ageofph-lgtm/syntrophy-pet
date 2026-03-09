import React from "react";
import { PawPrint, Weight, AlertTriangle, Pencil } from "lucide-react";
import PetAlertTags from "../shared/PetAlertTags";

export default function PetCard({ pet, onEdit, onSelect, selected }) {
  const hasVaccineWarning = pet.rabies_vaccine_expiry && 
    new Date(pet.rabies_vaccine_expiry) < new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

  return (
    <div
      onClick={() => onSelect?.(pet)}
      className={`
        relative bg-[#1A1A1A] border rounded-2xl p-4 transition-all duration-200
        ${onSelect ? "cursor-pointer" : ""}
        ${selected ? "border-orange-500 ring-1 ring-orange-500/20" : "border-[#2A2A2A] hover:border-[#3A3A3A]"}
      `}
    >
      {hasVaccineWarning && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
          <AlertTriangle className="w-3 h-3 text-white" />
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-xl bg-[#222222] border border-[#2A2A2A] flex items-center justify-center overflow-hidden flex-shrink-0">
          {pet.photo_url ? (
            <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
          ) : (
            <PawPrint className="w-6 h-6 text-orange-500/40" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{pet.name}</h3>
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(pet); }}
                className="p-1 rounded-lg hover:bg-[#222222] text-[#6B6B6B] hover:text-[#A0A0A0] transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-xs text-[#6B6B6B] mt-0.5">{pet.breed} · {pet.species}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] text-[#A0A0A0]">
              <Weight className="w-3 h-3" />
              {pet.weight_kg}kg
            </span>
          </div>
          <div className="mt-2">
            <PetAlertTags behavior={pet.behavior} allergies={pet.allergies_medical_info} />
          </div>
        </div>
      </div>

      {hasVaccineWarning && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-[10px] text-red-400 font-medium">
            ⚠ Vacina da raiva a vencer em breve
          </p>
        </div>
      )}
    </div>
  );
}