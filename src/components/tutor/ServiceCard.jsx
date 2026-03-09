import React from "react";
import { Droplets, Scissors, Sparkles, Plus, Check } from "lucide-react";

const CATEGORY_ICONS = {
  banho: Droplets,
  tosquia: Scissors,
  spa: Sparkles,
  adicional: Plus,
};

const CATEGORY_COLORS = {
  banho:    "text-blue-500 bg-blue-50 border-blue-100",
  tosquia:  "text-violet-500 bg-violet-50 border-violet-100",
  spa:      "text-pink-500 bg-pink-50 border-pink-100",
  adicional:"text-emerald-500 bg-emerald-50 border-emerald-100",
};

export default function ServiceCard({ service, selected, onToggle }) {
  const Icon = CATEGORY_ICONS[service.category] || Plus;
  const colorClass = CATEGORY_COLORS[service.category] || "text-stone-500 bg-stone-50 border-stone-200";

  return (
    <button
      onClick={() => onToggle(service)}
      className={`
        relative w-full text-left bg-white border rounded-2xl p-4 transition-all duration-200 shadow-sm
        ${selected ? "border-orange-400 ring-2 ring-orange-100 bg-orange-50/30" : "border-stone-200 hover:border-stone-300 hover:shadow-md"}
      `}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-sm">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-semibold text-sm mb-1 text-stone-900">{service.name}</h3>
      <p className="text-[11px] text-stone-400 mb-3 line-clamp-2">{service.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-orange-500 font-bold text-sm">{service.base_price}€</span>
        <span className="text-[10px] text-stone-400">{service.base_duration_minutes} min</span>
      </div>
    </button>
  );
}