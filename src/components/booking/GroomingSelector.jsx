import React from "react";
import { base44 } from "@/api/base44Client";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

// SVG Icons for each grooming option
const ICONS = {
  // Body
  maquina_alta: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9 Q10 6 16 6 Q22 6 26 9" />
      <path d="M5 13 Q10 9 16 9 Q22 9 27 13" />
      <path d="M6 17 Q10 13 16 13 Q22 13 26 17" />
      <path d="M9 23 Q12 20 16 20 Q20 20 23 23 L24 26 L8 26 Z" />
    </svg>
  ),
  maquina_baixa: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 11 Q16 7 24 11 L24 22 Q16 26 8 22 Z" />
      <path d="M8 11 Q16 14 24 11" />
      <path d="M13 22 L13 26 M19 22 L19 26" />
    </svg>
  ),
  tesoura: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="9" cy="9" r="3" />
      <circle cx="9" cy="23" r="3" />
      <line x1="12" y1="11" x2="27" y2="26" />
      <line x1="12" y1="21" x2="27" y2="6" />
    </svg>
  ),
  // Head
  arredondada: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="16" cy="14" r="9" />
      <circle cx="12" cy="13" r="1.2" fill="currentColor" />
      <circle cx="20" cy="13" r="1.2" fill="currentColor" />
      <path d="M13 18 Q16 20 19 18" />
      <path d="M10 23 Q16 27 22 23" />
    </svg>
  ),
  reta: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="6" width="18" height="16" rx="3" />
      <circle cx="12" cy="13" r="1.2" fill="currentColor" />
      <circle cx="20" cy="13" r="1.2" fill="currentColor" />
      <path d="M13 17 Q16 19 19 17" />
      <path d="M10 22 L10 26 M22 22 L22 26" />
    </svg>
  ),
  natural_head: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <ellipse cx="16" cy="14" rx="8" ry="9" />
      <circle cx="12.5" cy="13" r="1.2" fill="currentColor" />
      <circle cx="19.5" cy="13" r="1.2" fill="currentColor" />
      <path d="M13 18 Q16 20 19 18" />
      <path d="M8 18 Q6 22 7 25" />
      <path d="M24 18 Q26 22 25 25" />
    </svg>
  ),
  // Tail
  bandeira: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 26 Q12 20 16 16 Q20 12 24 8" />
      <path d="M16 16 Q22 14 24 8 Q18 10 14 14" />
    </svg>
  ),
  pompom: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M16 26 L16 14" />
      <circle cx="16" cy="10" r="4" />
    </svg>
  ),
  natural_tail: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 26 Q14 22 16 18 Q18 14 22 12 Q24 11 26 12" />
    </svg>
  ),
};

const BODY_OPTIONS = [
  { id: "maquina_alta", label: "Máquina Alta", desc: "Pelo mais comprido", icon: "maquina_alta" },
  { id: "maquina_baixa", label: "Máquina Baixa", desc: "Pelo curto e uniforme", icon: "maquina_baixa" },
  { id: "tesoura", label: "Tesoura", desc: "Acabamento artesanal", icon: "tesoura" },
];

const HEAD_OPTIONS = [
  { id: "arredondada", label: "Arredondada", desc: "Tipo ursinho", icon: "arredondada" },
  { id: "reta", label: "Reta", desc: "Corte clássico", icon: "reta" },
  { id: "natural", label: "Natural", desc: "Manutenção mínima", icon: "natural_head" },
];

const TAIL_OPTIONS = [
  { id: "bandeira", label: "Bandeira", desc: "Longa e fluida", icon: "bandeira" },
  { id: "pompom", label: "Pompom", desc: "Bola fofa na ponta", icon: "pompom" },
  { id: "natural", label: "Natural", desc: "Sem alteração", icon: "natural_tail" },
];

const ACCESSORY_OPTIONS = ["Laço", "Gravata", "Bandana", "Sem adereços"];
const PERFUME_OPTIONS = ["Cítrico", "Doce", "Sem Perfume"];

function VisualOptionGroup({ title, options, selected, onSelect }) {
  return (
    <div className="mb-6">
      <h4 className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-3">{title}</h4>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`
              relative p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden
              active:scale-95
              ${selected === opt.id
                ? "border-orange-500 bg-orange-500/10 shadow-[inset_0_0_15px_rgba(249,115,22,0.08)]"
                : "border-[#2A2A2A] bg-[#161616] hover:border-[#3A3A3A] hover:bg-[#1A1A1A]"
              }
            `}
          >
            {selected === opt.id && (
              <span className="absolute top-2 right-2 text-[9px] text-orange-500 font-serif italic leading-none">φ</span>
            )}
            <div className={`w-10 h-10 mb-2 mx-auto ${selected === opt.id ? "text-orange-500" : "text-[#6B6B6B]"} transition-colors`}>
              {ICONS[opt.icon]}
            </div>
            <p className={`text-xs font-semibold text-center ${selected === opt.id ? "text-orange-400" : "text-[#F5F5F5]"}`}>
              {opt.label}
            </p>
            <p className="text-[10px] text-[#6B6B6B] text-center mt-0.5 leading-tight">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function SimpleOptionGroup({ title, options, selected, onSelect, disabled }) {
  return (
    <div className="mb-6">
      <h4 className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => !disabled && onSelect(opt)}
            disabled={disabled}
            className={`
              px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-200 active:scale-95
              ${disabled ? "opacity-40 cursor-not-allowed border-[#2A2A2A] bg-[#1A1A1A] text-[#6B6B6B]" : ""}
              ${!disabled && selected === opt
                ? "border-orange-500 bg-orange-500/10 text-orange-400"
                : !disabled ? "border-[#2A2A2A] bg-[#161616] text-[#A0A0A0] hover:border-[#3A3A3A]" : ""
              }
            `}
          >
            {opt}
          </button>
        ))}
      </div>
      {disabled && (
        <p className="text-[10px] text-amber-400 mt-2">
          ⚠ Perfume bloqueado — pet com alergias registadas
        </p>
      )}
    </div>
  );
}

export default function GroomingSelector({ preferences, onChange, hasAllergies, lastPreferences }) {
  const [uploading, setUploading] = React.useState(false);

  const update = (field, value) => onChange({ ...preferences, [field]: value });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    update("reference_photo_url", file_url);
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight">A Alfaiataria do Pelo</h3>
          <p className="text-xs text-[#6B6B6B] mt-0.5">Personalize o corte do seu pet</p>
        </div>
        {lastPreferences && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(lastPreferences)}
            className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 text-xs"
          >
            Repetir último corte
          </Button>
        )}
      </div>

      <VisualOptionGroup title="Corpo" options={BODY_OPTIONS} selected={preferences.corpo} onSelect={(v) => update("corpo", v)} />
      <VisualOptionGroup title="Cabeça" options={HEAD_OPTIONS} selected={preferences.cabeca} onSelect={(v) => update("cabeca", v)} />
      <VisualOptionGroup title="Rabo" options={TAIL_OPTIONS} selected={preferences.rabo} onSelect={(v) => update("rabo", v)} />
      <SimpleOptionGroup title="Acessórios" options={ACCESSORY_OPTIONS} selected={preferences.accessories} onSelect={(v) => update("accessories", v)} />
      <SimpleOptionGroup title="Perfume" options={PERFUME_OPTIONS} selected={preferences.perfume} onSelect={(v) => update("perfume", v)} disabled={hasAllergies} />

      {/* Reference Photo */}
      <div>
        <h4 className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-3">Foto de Referência</h4>
        {preferences.reference_photo_url ? (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[#2A2A2A]">
            <img src={preferences.reference_photo_url} className="w-full h-full object-cover" alt="Referência" />
            <button onClick={() => update("reference_photo_url", "")} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">×</button>
          </div>
        ) : (
          <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-[#2A2A2A] bg-[#161616] cursor-pointer hover:border-orange-500/50 transition-colors">
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            {uploading ? <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-5 h-5 text-[#6B6B6B]" />}
            <span className="text-xs text-[#6B6B6B]">Carregar foto de referência</span>
          </label>
        )}
      </div>
    </div>
  );
}