import React from "react";
import { Droplets, Scissors, Sparkles, Plus, Check } from "lucide-react";

const CATEGORY_ICONS = {
  banho: Droplets,
  tosquia: Scissors,
  spa: Sparkles,
  adicional: Plus,
};

const CATEGORY_COLORS = {
  banho: "text-blue-400 bg-blue-500/10",
  tosquia: "text-purple-400 bg-purple-500/10",
  spa: "text-pink-400 bg-pink-500/10",
  adicional: "text-green-400 bg-green-500/10",
};

export default function ServiceCard({ service, selected, onToggle }) {
  const Icon = CATEGORY_ICONS[service.category] || Plus;
  const colorClass = CATEGORY_COLORS[service.category] || "text-[#A0A0A0] bg-[#222222]";

  return (
    <button
      onClick={() => onToggle(service)}
      className={`
        relative w-full text-left bg-[#1A1A1A] border rounded-2xl p-4 transition-all duration-200
        ${selected ? "border-orange-500 ring-1 ring-orange-500/20" : "border-[#2A2A2A] hover:border-[#3A3A3A]"}
      `}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-semibold text-sm mb-1">{service.name}</h3>
      <p className="text-[11px] text-[#6B6B6B] mb-3 line-clamp-2">{service.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-orange-500 font-bold text-sm">{service.base_price}€</span>
        <span className="text-[10px] text-[#6B6B6B]">{service.base_duration_minutes} min</span>
      </div>
    </button>
  );
}