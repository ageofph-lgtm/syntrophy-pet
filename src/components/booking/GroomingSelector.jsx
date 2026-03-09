import React from "react";
import { base44 } from "@/api/base44Client";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Dog Silhouette SVGs ───────────────────────────────────────────── */

const DogBodySmooth = () => (
  <svg viewBox="0 0 64 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <rect x="14" y="16" width="26" height="16" rx="8" />
    <circle cx="50" cy="20" r="8" />
    <path d="M43 13 Q38 7 44 17" strokeWidth="2" />
    <circle cx="52" cy="19" r="1.3" fill="currentColor" />
    <path d="M56 23 Q58 22 57 24" />
    <line x1="20" y1="32" x2="19" y2="42" strokeWidth="2" />
    <line x1="26" y1="32" x2="25" y2="42" strokeWidth="2" />
    <line x1="32" y1="32" x2="33" y2="42" strokeWidth="2" />
    <line x1="36" y1="32" x2="37" y2="42" strokeWidth="2" />
    <path d="M14 22 Q8 17 7 11 Q7 7 11 9" />
  </svg>
);

const DogBodyFluffy = () => (
  <svg viewBox="0 0 64 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <rect x="14" y="16" width="26" height="16" rx="8" />
    <path d="M16 16 Q17 9 20 14" strokeWidth="1.2" />
    <path d="M22 15 Q23 8 26 13" strokeWidth="1.2" />
    <path d="M28 14 Q29 7 32 12" strokeWidth="1.2" />
    <path d="M34 15 Q35 9 38 13" strokeWidth="1.2" />
    <circle cx="50" cy="20" r="8" />
    <path d="M44 13 Q39 7 47 12" strokeWidth="1.2" />
    <path d="M43 13 Q38 7 44 17" strokeWidth="2" />
    <circle cx="52" cy="19" r="1.3" fill="currentColor" />
    <path d="M56 23 Q58 22 57 24" />
    <line x1="20" y1="32" x2="19" y2="42" strokeWidth="2" />
    <line x1="26" y1="32" x2="25" y2="42" strokeWidth="2" />
    <line x1="32" y1="32" x2="33" y2="42" strokeWidth="2" />
    <line x1="36" y1="32" x2="37" y2="42" strokeWidth="2" />
    <path d="M14 22 Q8 17 7 11 Q7 7 11 9" />
    <path d="M10 16 Q7 13 9 9" strokeWidth="1.2" />
  </svg>
);

const DogBodyScissors = () => (
  <svg viewBox="0 0 64 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <rect x="14" y="16" width="26" height="16" rx="8" />
    <line x1="22" y1="16" x2="22" y2="32" strokeDasharray="2 2" strokeWidth="1" />
    <line x1="30" y1="16" x2="30" y2="32" strokeDasharray="2 2" strokeWidth="1" />
    <circle cx="50" cy="20" r="8" />
    <path d="M43 13 Q38 7 44 17" strokeWidth="2" />
    <circle cx="52" cy="19" r="1.3" fill="currentColor" />
    <path d="M56 23 Q58 22 57 24" />
    <line x1="20" y1="32" x2="19" y2="42" strokeWidth="2" />
    <line x1="26" y1="32" x2="25" y2="42" strokeWidth="2" />
    <line x1="32" y1="32" x2="33" y2="42" strokeWidth="2" />
    <line x1="36" y1="32" x2="37" y2="42" strokeWidth="2" />
    <path d="M14 22 Q8 17 7 11 Q7 7 11 9" />
    {/* scissors */}
    <circle cx="5" cy="5" r="2" />
    <circle cx="10" cy="5" r="2" />
    <line x1="5" y1="7" x2="12" y2="13" />
    <line x1="10" y1="7" x2="3" y2="13" />
  </svg>
);

const DogHeadRound = () => (
  <svg viewBox="0 0 44 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <circle cx="22" cy="28" r="14" />
    <circle cx="10" cy="15" r="6" />
    <circle cx="34" cy="15" r="6" />
    <circle cx="17" cy="26" r="2" fill="currentColor" />
    <circle cx="27" cy="26" r="2" fill="currentColor" />
    <ellipse cx="22" cy="32" rx="3" ry="2" />
    <path d="M19 36 Q22 39 25 36" />
  </svg>
);

const DogHeadStraight = () => (
  <svg viewBox="0 0 44 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <rect x="8" y="14" width="28" height="28" rx="6" />
    <line x1="8" y1="16" x2="36" y2="16" strokeWidth="2.5" />
    <path d="M8 20 L3 8 L15 16" />
    <path d="M36 20 L41 8 L29 16" />
    <circle cx="17" cy="26" r="2" fill="currentColor" />
    <circle cx="27" cy="26" r="2" fill="currentColor" />
    <ellipse cx="22" cy="33" rx="3" ry="2" />
    <path d="M19 37 Q22 40 25 37" />
  </svg>
);

const DogHeadNatural = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <ellipse cx="24" cy="24" rx="13" ry="16" />
    <path d="M11 19 Q4 28 6 38 Q8 44 13 42" strokeWidth="2.5" />
    <path d="M37 19 Q44 28 42 38 Q40 44 35 42" strokeWidth="2.5" />
    <circle cx="19" cy="20" r="2" fill="currentColor" />
    <circle cx="29" cy="20" r="2" fill="currentColor" />
    <ellipse cx="24" cy="28" rx="3" ry="2" />
    <path d="M21 33 Q24 36 27 33" />
  </svg>
);

const DogTailFlag = () => (
  <svg viewBox="0 0 32 52" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M26 48 Q22 44 20 38" strokeWidth="2.5" />
    <path d="M20 38 Q16 28 18 18 Q20 8 16 4" strokeWidth="2.5" />
    <path d="M18 32 Q12 30 14 22" strokeWidth="1.2" />
    <path d="M18 22 Q12 20 16 12" strokeWidth="1.2" />
    <path d="M17 13 Q11 11 15 5" strokeWidth="1.2" />
  </svg>
);

const DogTailPompom = () => (
  <svg viewBox="0 0 32 52" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M26 48 Q22 44 20 40" strokeWidth="2.5" />
    <path d="M20 40 Q18 34 18 28" strokeWidth="2.5" />
    <circle cx="18" cy="21" r="7" />
  </svg>
);

const DogTailNatural = () => (
  <svg viewBox="0 0 32 52" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M26 48 Q22 44 20 38" strokeWidth="2.5" />
    <path d="M20 38 Q18 30 20 22 Q22 14 20 8" strokeWidth="2.5" />
  </svg>
);

/* ── Option Data ─────────────────────────────────────────────────── */

const BODY_OPTIONS = [
  { id: "maquina_alta", label: "Máquina Alta", desc: "Pelo comprido", icon: <DogBodyFluffy /> },
  { id: "maquina_baixa", label: "Máquina Baixa", desc: "Pelo curto e uniforme", icon: <DogBodySmooth /> },
  { id: "tesoura", label: "Tesoura", desc: "Acabamento artesanal", icon: <DogBodyScissors /> },
];

const HEAD_OPTIONS = [
  { id: "arredondada", label: "Arredondada", desc: "Tipo ursinho", icon: <DogHeadRound /> },
  { id: "reta", label: "Reta", desc: "Corte clássico", icon: <DogHeadStraight /> },
  { id: "natural", label: "Natural", desc: "Manutenção mínima", icon: <DogHeadNatural /> },
];

const TAIL_OPTIONS = [
  { id: "bandeira", label: "Bandeira", desc: "Longa e fluida", icon: <DogTailFlag /> },
  { id: "pompom", label: "Pompom", desc: "Bola fofa na ponta", icon: <DogTailPompom /> },
  { id: "natural", label: "Natural", desc: "Sem alteração", icon: <DogTailNatural /> },
];

const ACCESSORY_OPTIONS = ["Laço", "Gravata", "Bandana", "Sem adereços"];
const PERFUME_OPTIONS = ["Cítrico", "Doce", "Sem Perfume"];

/* ── Visual Option Card ──────────────────────────────────────────── */

function VisualOptionGroup({ title, options, selected, onSelect }) {
  return (
    <div className="mb-6">
      <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">{title}</h4>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`
              relative flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all duration-200 active:scale-95
              ${selected === opt.id
                ? "border-orange-400 bg-orange-50 shadow-sm"
                : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
              }
            `}
          >
            {selected === opt.id && (
              <span className="absolute top-1.5 right-2 text-[9px] text-orange-500 font-serif italic">φ</span>
            )}
            <div className={`w-14 h-10 transition-colors ${selected === opt.id ? "text-orange-500" : "text-stone-400"}`}>
              {opt.icon}
            </div>
            <div>
              <p className={`text-[11px] font-semibold leading-tight ${selected === opt.id ? "text-orange-600" : "text-stone-700"}`}>
                {opt.label}
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5 leading-tight">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SimpleOptionGroup({ title, options, selected, onSelect, disabled }) {
  return (
    <div className="mb-6">
      <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => !disabled && onSelect(opt)}
            disabled={disabled}
            className={`
              px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-200 active:scale-95
              ${disabled ? "opacity-40 cursor-not-allowed border-stone-200 bg-stone-50 text-stone-400" : ""}
              ${!disabled && selected === opt
                ? "border-orange-400 bg-orange-50 text-orange-600"
                : !disabled ? "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50" : ""
              }
            `}
          >
            {opt}
          </button>
        ))}
      </div>
      {disabled && (
        <p className="text-[10px] text-amber-500 mt-2">⚠ Perfume bloqueado — pet com alergias registadas</p>
      )}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────── */

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
          <h3 className="text-lg font-bold tracking-tight text-stone-900">A Alfaiataria do Pelo</h3>
          <p className="text-xs text-stone-400 mt-0.5">Personalize o corte do seu pet</p>
        </div>
        {lastPreferences && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(lastPreferences)}
            className="border-orange-200 text-orange-500 hover:bg-orange-50 text-xs"
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
        <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Foto de Referência</h4>
        {preferences.reference_photo_url ? (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-stone-200">
            <img src={preferences.reference_photo_url} className="w-full h-full object-cover" alt="Referência" />
            <button onClick={() => update("reference_photo_url", "")} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">×</button>
          </div>
        ) : (
          <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-stone-300 bg-stone-50 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors">
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            {uploading ? <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-5 h-5 text-stone-400" />}
            <span className="text-xs text-stone-500">Carregar foto de referência</span>
          </label>
        )}
      </div>
    </div>
  );
}