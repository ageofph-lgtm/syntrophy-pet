import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── SVG Illustrations ─────────────────────────────────────────── */

// CORPO
const BodyShort = () => (
  <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
    <ellipse cx="28" cy="22" rx="18" ry="11" fill="#E5E7EB" stroke="#374151" strokeWidth="1.5"/>
    <circle cx="44" cy="15" r="9" fill="#E5E7EB" stroke="#374151" strokeWidth="1.5"/>
    <path d="M43 8 Q40 3 46 7" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="46" cy="14" r="1.2" fill="#374151"/>
    <path d="M50 18 Q53 17 52 20" stroke="#374151" strokeWidth="1" strokeLinecap="round"/>
    <line x1="16" y1="33" x2="15" y2="40" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    <line x1="22" y1="33" x2="21" y2="40" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    <line x1="30" y1="33" x2="31" y2="40" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    <line x1="36" y1="33" x2="37" y2="40" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 20 Q3 15 3 9 Q3 5 7 7" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BodyMedium = () => (
  <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
    <ellipse cx="28" cy="22" rx="18" ry="11" fill="#E5E7EB" stroke="#374151" strokeWidth="1.5"/>
    <path d="M12 18 Q10 13 12 13" stroke="#374151" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M18 14 Q17 9 19 9" stroke="#374151" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M25 12 Q24 7 26 8" stroke="#374151" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M32 13 Q31 8 33 9" stroke="#374151" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M38 15 Q37 10 39 11" stroke="#374151" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="44" cy="15" r="9" fill="#E5E7EB" stroke="#374151" strokeWidth="1.5"/>
    <path d="M43 8 Q40 3 46 7" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="46" cy="14" r="1.2" fill="#374151"/>
    <path d="M50 18 Q53 17 52 20" stroke="#374151" strokeWidth="1" strokeLinecap="round"/>
    <line x1="16" y1="33" x2="15" y2="40" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    <line x1="22" y1="33" x2="21" y2="40" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    <line x1="30" y1="33" x2="31" y2="40" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    <line x1="36" y1="33" x2="37" y2="40" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 20 Q3 15 3 9 Q3 5 7 7" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BodyFull = () => (
  <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
    <ellipse cx="28" cy="22" rx="20" ry="13" fill="#E5E7EB" stroke="#374151" strokeWidth="1.5"/>
    {[12,17,22,27,32,37,42].map((x,i) => (
      <path key={i} d={`M${x} ${14+i%2} Q${x-2} ${6+i%2} ${x+1} ${9+i%2}`} stroke="#374151" strokeWidth="1.2" strokeLinecap="round"/>
    ))}
    <circle cx="44" cy="15" r="10" fill="#E5E7EB" stroke="#374151" strokeWidth="1.5"/>
    <path d="M43 7 Q40 2 47 6" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="46" cy="13" r="1.2" fill="#374151"/>
    <path d="M50 18 Q53 17 52 20" stroke="#374151" strokeWidth="1" strokeLinecap="round"/>
    <line x1="16" y1="35" x2="14" y2="40" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="22" y1="35" x2="20" y2="40" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="30" y1="35" x2="31" y2="40" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="36" y1="35" x2="38" y2="40" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M8 21 Q1 16 1 9 Q1 4 6 6" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 14 Q2 11 4 7" stroke="#374151" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const BodySummer = () => (
  <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
    <ellipse cx="28" cy="22" rx="17" ry="10" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5"/>
    <line x1="12" y1="13" x2="43" y2="13" stroke="#D97706" strokeWidth="1" strokeDasharray="2 2"/>
    <line x1="11" y1="31" x2="43" y2="31" stroke="#D97706" strokeWidth="1" strokeDasharray="2 2"/>
    <circle cx="44" cy="15" r="9" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5"/>
    <path d="M43 8 Q40 3 46 7" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="46" cy="14" r="1.2" fill="#D97706"/>
    <path d="M50 18 Q53 17 52 20" stroke="#D97706" strokeWidth="1" strokeLinecap="round"/>
    <line x1="16" y1="32" x2="15" y2="40" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
    <line x1="22" y1="32" x2="21" y2="40" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
    <line x1="30" y1="32" x2="31" y2="40" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
    <line x1="36" y1="32" x2="37" y2="40" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 20 Q3 15 3 9 Q3 5 7 7" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
    <text x="14" y="26" fontSize="7" fill="#D97706" fontWeight="bold">VERÃO</text>
  </svg>
);

const BodyScissors = () => (
  <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
    <ellipse cx="28" cy="22" rx="18" ry="11" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.5"/>
    <line x1="11" y1="17" x2="43" y2="17" stroke="#7C3AED" strokeWidth="0.8" strokeDasharray="3 2"/>
    <line x1="11" y1="27" x2="43" y2="27" stroke="#7C3AED" strokeWidth="0.8" strokeDasharray="3 2"/>
    <circle cx="44" cy="15" r="9" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.5"/>
    <path d="M43 8 Q40 3 46 7" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="46" cy="14" r="1.2" fill="#7C3AED"/>
    <path d="M50 18 Q53 17 52 20" stroke="#7C3AED" strokeWidth="1" strokeLinecap="round"/>
    <line x1="16" y1="33" x2="15" y2="40" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
    <line x1="22" y1="33" x2="21" y2="40" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
    <line x1="30" y1="33" x2="31" y2="40" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
    <line x1="36" y1="33" x2="37" y2="40" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 20 Q3 15 3 9 Q3 5 7 7" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/>
    {/* scissors icon */}
    <circle cx="5" cy="34" r="2" stroke="#7C3AED" strokeWidth="1"/>
    <circle cx="10" cy="34" r="2" stroke="#7C3AED" strokeWidth="1"/>
    <line x1="5" y1="36" x2="13" y2="40" stroke="#7C3AED" strokeWidth="1"/>
    <line x1="10" y1="36" x2="2" y2="40" stroke="#7C3AED" strokeWidth="1"/>
  </svg>
);

// HEAD
const HeadRound = () => (
  <svg viewBox="0 0 44 52" fill="none" className="w-full h-full">
    <circle cx="22" cy="30" r="16" fill="#E5E7EB" stroke="#374151" strokeWidth="1.5"/>
    <circle cx="10" cy="16" r="7" fill="#E5E7EB" stroke="#374151" strokeWidth="1.5"/>
    <circle cx="34" cy="16" r="7" fill="#E5E7EB" stroke="#374151" strokeWidth="1.5"/>
    <circle cx="17" cy="28" r="2.2" fill="#374151"/>
    <circle cx="27" cy="28" r="2.2" fill="#374151"/>
    <ellipse cx="22" cy="34" rx="3.5" ry="2.5" fill="#9CA3AF" stroke="#374151" strokeWidth="1"/>
    <path d="M18 39 Q22 42 26 39" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const HeadStraight = () => (
  <svg viewBox="0 0 44 52" fill="none" className="w-full h-full">
    <rect x="7" y="14" width="30" height="30" rx="5" fill="#E5E7EB" stroke="#374151" strokeWidth="1.5"/>
    <rect x="7" y="14" width="30" height="8" rx="5" fill="#9CA3AF" stroke="#374151" strokeWidth="1"/>
    <path d="M7 20 L2 8 Q2 4 7 7 L7 20" fill="#E5E7EB" stroke="#374151" strokeWidth="1.5"/>
    <path d="M37 20 L42 8 Q42 4 37 7 L37 20" fill="#E5E7EB" stroke="#374151" strokeWidth="1.5"/>
    <circle cx="17" cy="28" r="2.2" fill="#374151"/>
    <circle cx="27" cy="28" r="2.2" fill="#374151"/>
    <ellipse cx="22" cy="35" rx="3.5" ry="2.5" fill="#9CA3AF" stroke="#374151" strokeWidth="1"/>
    <path d="M18 40 Q22 43 26 40" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const HeadNatural = () => (
  <svg viewBox="0 0 44 52" fill="none" className="w-full h-full">
    <ellipse cx="22" cy="26" rx="14" ry="18" fill="#E5E7EB" stroke="#374151" strokeWidth="1.5"/>
    <path d="M8 21 Q1 30 3 40 Q5 46 10 44" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M36 21 Q43 30 41 40 Q39 46 34 44" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="17" cy="21" r="2.2" fill="#374151"/>
    <circle cx="27" cy="21" r="2.2" fill="#374151"/>
    <ellipse cx="22" cy="28" rx="3" ry="2" fill="#9CA3AF" stroke="#374151" strokeWidth="1"/>
    <path d="M19 33 Q22 36 25 33" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const HeadFancy = () => (
  <svg viewBox="0 0 44 52" fill="none" className="w-full h-full">
    <circle cx="22" cy="30" r="14" fill="#FDF4FF" stroke="#7C3AED" strokeWidth="1.5"/>
    {/* fancy bow on head */}
    <path d="M14 17 Q17 12 20 17 Q17 14 14 17Z" fill="#F0ABFC" stroke="#7C3AED" strokeWidth="1"/>
    <path d="M30 17 Q27 12 24 17 Q27 14 30 17Z" fill="#F0ABFC" stroke="#7C3AED" strokeWidth="1"/>
    <circle cx="22" cy="17" r="2" fill="#7C3AED"/>
    <circle cx="10" cy="16" r="7" fill="#FDF4FF" stroke="#7C3AED" strokeWidth="1.5"/>
    <circle cx="34" cy="16" r="7" fill="#FDF4FF" stroke="#7C3AED" strokeWidth="1.5"/>
    <circle cx="17" cy="28" r="2.2" fill="#7C3AED"/>
    <circle cx="27" cy="28" r="2.2" fill="#7C3AED"/>
    <ellipse cx="22" cy="34" rx="3.5" ry="2.5" fill="#D8B4FE" stroke="#7C3AED" strokeWidth="1"/>
    <path d="M18 39 Q22 42 26 39" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const HeadLion = () => (
  <svg viewBox="0 0 52 52" fill="none" className="w-full h-full">
    {/* mane */}
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const mx = 26 + Math.cos(rad) * 22;
      const my = 28 + Math.sin(rad) * 22;
      return <line key={i} x1="26" y1="28" x2={mx} y2={my} stroke="#D97706" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>;
    })}
    <circle cx="26" cy="28" r="14" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5"/>
    <circle cx="20" cy="26" r="2.2" fill="#374151"/>
    <circle cx="32" cy="26" r="2.2" fill="#374151"/>
    <ellipse cx="26" cy="32" rx="3.5" ry="2.5" fill="#FCA5A5" stroke="#D97706" strokeWidth="1"/>
    <path d="M22 37 Q26 40 30 37" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// TAIL
const TailFlag = () => (
  <svg viewBox="0 0 30 54" fill="none" className="w-full h-full">
    <path d="M22 50 Q18 44 16 36" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M16 36 Q12 24 15 12 Q17 4 13 2" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M15 30 Q9 28 11 18" stroke="#374151" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M15 20 Q9 18 13 8" stroke="#374151" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const TailPompom = () => (
  <svg viewBox="0 0 30 54" fill="none" className="w-full h-full">
    <path d="M22 50 Q18 44 17 38" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M17 38 Q16 32 16 27" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="16" cy="20" r="8" fill="#E5E7EB" stroke="#374151" strokeWidth="1.5"/>
    <path d="M10 17 Q14 14 18 17" stroke="#374151" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M9 22 Q14 25 19 22" stroke="#374151" strokeWidth="0.8" strokeLinecap="round"/>
  </svg>
);

const TailNatural = () => (
  <svg viewBox="0 0 30 54" fill="none" className="w-full h-full">
    <path d="M22 50 Q18 44 17 36" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M17 36 Q17 26 20 16 Q22 8 18 4" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const TailCurl = () => (
  <svg viewBox="0 0 32 54" fill="none" className="w-full h-full">
    <path d="M22 50 Q18 44 17 38" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M17 38 Q10 32 14 22 Q18 12 24 14 Q30 16 26 24 Q22 30 16 26" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
);

const TailFluffy = () => (
  <svg viewBox="0 0 34 54" fill="none" className="w-full h-full">
    <path d="M24 50 Q20 44 18 38" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M18 38 Q15 32 15 27" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"/>
    <ellipse cx="16" cy="18" rx="10" ry="13" fill="#E5E7EB" stroke="#374151" strokeWidth="1.5"/>
    {[6,10,14,18,22].map((x,i) => (
      <path key={i} d={`M${x} ${12-i%2} Q${x-1} ${7-i%2} ${x+2} ${9-i%2}`} stroke="#374151" strokeWidth="0.8" strokeLinecap="round"/>
    ))}
  </svg>
);

/* ── Data ────────────────────────────────────────────────────────── */

const BODY_OPTIONS = [
  { id: "maquina_baixa",  label: "Máquina Baixa",   desc: "Pelo muito curto e uniforme", icon: <BodyShort /> },
  { id: "maquina_media",  label: "Máquina Média",   desc: "Comprimento moderado", icon: <BodyMedium /> },
  { id: "maquina_alta",   label: "Máquina Alta",    desc: "Pelo comprido, natural", icon: <BodyFull /> },
  { id: "tesoura",        label: "Tesoura",         desc: "Acabamento artesanal preciso", icon: <BodyScissors /> },
  { id: "corte_verao",    label: "Corte Verão",     desc: "Curto para dias quentes", icon: <BodySummer /> },
];

const HEAD_OPTIONS = [
  { id: "arredondada",    label: "Arredondada",    desc: "Tipo ursinho fofo", icon: <HeadRound /> },
  { id: "reta",           label: "Reta / Clássica",desc: "Corte limpo e elegante", icon: <HeadStraight /> },
  { id: "natural",        label: "Natural",        desc: "Queda natural do pelo", icon: <HeadNatural /> },
  { id: "fancy",          label: "Fancy",          desc: "Com laço ou adereço", icon: <HeadFancy /> },
  { id: "leao",           label: "Leão",           desc: "Juba cheia ao redor", icon: <HeadLion /> },
];

const TAIL_OPTIONS = [
  { id: "bandeira",       label: "Bandeira",       desc: "Comprida e fluida", icon: <TailFlag /> },
  { id: "pompom",         label: "Pompom",         desc: "Bola fofa na ponta", icon: <TailPompom /> },
  { id: "natural",        label: "Natural",        desc: "Sem alteração", icon: <TailNatural /> },
  { id: "enrolado",       label: "Enrolado",       desc: "Cauda curva sobre o dorso", icon: <TailCurl /> },
  { id: "pluma",          label: "Pluma",          desc: "Volumosa e esfumaçada", icon: <TailFluffy /> },
];

const ACCESSORY_OPTIONS = ["Sem adereços", "Laço rosa", "Laço azul", "Gravata preta", "Gravata borboleta", "Bandana", "Perola"];
const PERFUME_OPTIONS   = ["Sem Perfume", "Cítrico fresco", "Floral suave", "Talco clássico", "Baunilha"];

/* ── Visual Card ─────────────────────────────────────────────────── */

function VisualOptionGroup({ title, options, selected, onSelect, cols = 5 }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">{title}</h4>
        {selected && <span className="text-[10px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">{options.find(o => o.id === selected)?.label}</span>}
      </div>
      <div className={`grid gap-2 grid-cols-3 sm:grid-cols-${cols}`}>
        {options.map((opt) => (
          <button key={opt.id} onClick={() => onSelect(opt.id)}
            className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-200 active:scale-95
              ${selected === opt.id
                ? "border-stone-950 bg-stone-950 shadow-md"
                : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"}`}>
            <div className={`w-16 h-12 transition-all ${selected === opt.id ? "opacity-100" : "opacity-75"}`}>
              {opt.icon}
            </div>
            <p className={`text-[11px] font-semibold leading-tight ${selected === opt.id ? "text-white" : "text-stone-700"}`}>
              {opt.label}
            </p>
            <p className={`text-[10px] leading-tight ${selected === opt.id ? "text-stone-300" : "text-stone-400"}`}>
              {opt.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChipGroup({ title, options, selected, onSelect, disabled }) {
  return (
    <div className="mb-6">
      <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button key={opt} onClick={() => !disabled && onSelect(opt)} disabled={disabled}
            className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-200 active:scale-95
              ${disabled ? "opacity-40 cursor-not-allowed border-stone-200 bg-stone-50 text-stone-400" : ""}
              ${!disabled && selected === opt ? "border-stone-950 bg-stone-950 text-white" : !disabled ? "border-stone-200 bg-white text-stone-600 hover:border-stone-300" : ""}`}>
            {opt}
          </button>
        ))}
      </div>
      {disabled && <p className="text-[10px] text-amber-600 mt-2">⚠ Bloqueado — pet com alergias registadas</p>}
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────────────── */

export default function GroomingSelector({ preferences, onChange, hasAllergies, lastPreferences }) {
  const [uploading, setUploading] = useState(false);
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone-900">Alfaiataria do Pelo</h3>
          <p className="text-sm text-stone-400 mt-0.5">Personalize o estilo do seu pet</p>
        </div>
        {lastPreferences && (
          <Button variant="outline" size="sm" onClick={() => onChange(lastPreferences)}
            className="border-stone-200 text-stone-600 hover:bg-stone-50 text-xs gap-1.5">
            <RotateCcw className="w-3 h-3" /> Último corte
          </Button>
        )}
      </div>

      <VisualOptionGroup title="Corpo" options={BODY_OPTIONS} selected={preferences.corpo} onSelect={(v) => update("corpo", v)} cols={5} />
      <VisualOptionGroup title="Cabeça" options={HEAD_OPTIONS} selected={preferences.cabeca} onSelect={(v) => update("cabeca", v)} cols={5} />
      <VisualOptionGroup title="Rabo" options={TAIL_OPTIONS} selected={preferences.rabo} onSelect={(v) => update("rabo", v)} cols={5} />
      <ChipGroup title="Acessórios" options={ACCESSORY_OPTIONS} selected={preferences.accessories} onSelect={(v) => update("accessories", v)} />
      <ChipGroup title="Perfume" options={PERFUME_OPTIONS} selected={preferences.perfume} onSelect={(v) => update("perfume", v)} disabled={hasAllergies} />

      {/* Reference Photo */}
      <div>
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">Foto de Referência</h4>
        {preferences.reference_photo_url ? (
          <div className="relative w-36 h-36 rounded-xl overflow-hidden border border-stone-200">
            <img src={preferences.reference_photo_url} className="w-full h-full object-cover" alt="Referência" />
            <button onClick={() => update("reference_photo_url", "")} className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs shadow">×</button>
          </div>
        ) : (
          <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-stone-300 bg-white cursor-pointer hover:border-violet-400 hover:bg-violet-50/50 transition-colors w-fit">
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            {uploading ? <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-5 h-5 text-stone-400" />}
            <span className="text-xs text-stone-500">Carregar foto de referência</span>
          </label>
        )}
      </div>
    </div>
  );
}