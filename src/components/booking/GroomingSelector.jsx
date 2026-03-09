import React from "react";
import { base44 } from "@/api/base44Client";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const BODY_OPTIONS = [
  { id: "maquina_alta", label: "Máquina Alta", desc: "Pelo mais comprido" },
  { id: "maquina_baixa", label: "Máquina Baixa", desc: "Pelo curto e uniforme" },
  { id: "tesoura", label: "Tesoura", desc: "Acabamento artesanal" },
];

const HEAD_OPTIONS = [
  { id: "arredondada", label: "Arredondada", desc: "Tipo ursinho" },
  { id: "reta", label: "Reta", desc: "Corte clássico" },
  { id: "natural", label: "Natural", desc: "Manutenção mínima" },
];

const TAIL_OPTIONS = [
  { id: "bandeira", label: "Bandeira", desc: "Longa e fluida" },
  { id: "pompom", label: "Pompom", desc: "Bola fofa na ponta" },
  { id: "natural", label: "Natural", desc: "Sem alteração" },
];

const ACCESSORY_OPTIONS = ["Laço", "Gravata", "Bandana", "Sem adereços"];
const PERFUME_OPTIONS = ["Cítrico", "Doce", "Sem Perfume"];

function OptionGroup({ title, options, selected, onSelect }) {
  return (
    <div className="mb-6">
      <h4 className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-3">{title}</h4>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`
              p-3 rounded-xl border text-left transition-all duration-200
              ${selected === opt.id
                ? "border-orange-500 bg-orange-500/10"
                : "border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#3A3A3A]"
              }
            `}
          >
            <p className={`text-xs font-medium ${selected === opt.id ? "text-orange-400" : "text-[#F5F5F5]"}`}>
              {opt.label}
            </p>
            <p className="text-[10px] text-[#6B6B6B] mt-0.5">{opt.desc}</p>
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
              px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-200
              ${disabled ? "opacity-40 cursor-not-allowed border-[#2A2A2A] bg-[#1A1A1A] text-[#6B6B6B]" : ""}
              ${!disabled && selected === opt
                ? "border-orange-500 bg-orange-500/10 text-orange-400"
                : !disabled ? "border-[#2A2A2A] bg-[#1A1A1A] text-[#A0A0A0] hover:border-[#3A3A3A]" : ""
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

  const update = (field, value) => {
    onChange({ ...preferences, [field]: value });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    update("reference_photo_url", file_url);
    setUploading(false);
  };

  const applyLast = () => {
    if (lastPreferences) onChange(lastPreferences);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">A Alfaiataria do Pelo</h3>
        {lastPreferences && (
          <Button
            variant="outline"
            size="sm"
            onClick={applyLast}
            className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 text-xs"
          >
            Repetir último corte
          </Button>
        )}
      </div>

      <OptionGroup
        title="Corpo"
        options={BODY_OPTIONS}
        selected={preferences.corpo}
        onSelect={(v) => update("corpo", v)}
      />
      <OptionGroup
        title="Cabeça"
        options={HEAD_OPTIONS}
        selected={preferences.cabeca}
        onSelect={(v) => update("cabeca", v)}
      />
      <OptionGroup
        title="Rabo"
        options={TAIL_OPTIONS}
        selected={preferences.rabo}
        onSelect={(v) => update("rabo", v)}
      />

      <SimpleOptionGroup
        title="Acessórios"
        options={ACCESSORY_OPTIONS}
        selected={preferences.accessories}
        onSelect={(v) => update("accessories", v)}
      />

      <SimpleOptionGroup
        title="Perfume"
        options={PERFUME_OPTIONS}
        selected={preferences.perfume}
        onSelect={(v) => update("perfume", v)}
        disabled={hasAllergies}
      />

      {/* Reference Photo */}
      <div>
        <h4 className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-3">
          Foto de Referência
        </h4>
        {preferences.reference_photo_url ? (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[#2A2A2A]">
            <img src={preferences.reference_photo_url} className="w-full h-full object-cover" alt="Referência" />
            <button
              onClick={() => update("reference_photo_url", "")}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
            >
              ×
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-[#2A2A2A] bg-[#1A1A1A] cursor-pointer hover:border-orange-500/50 transition-colors">
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            {uploading ? (
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-[#6B6B6B]" />
            )}
            <span className="text-xs text-[#6B6B6B]">Carregar foto de referência</span>
          </label>
        )}
      </div>
    </div>
  );
}