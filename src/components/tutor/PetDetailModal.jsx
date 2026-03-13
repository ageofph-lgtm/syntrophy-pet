import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  PawPrint, Pencil, Check, X, Upload, HeartPulse,
  Weight, Syringe, Bug, CalendarDays, Phone, Cpu,
  AlertTriangle, Gift, ShieldCheck, FileText, Droplets
} from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { pt } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const BANHOS_PER_REWARD = 10;

function InlineField({ label, value, onSave, type = "text", options }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  const save = async () => {
    await onSave(draft);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-[10px] text-stone-400 uppercase tracking-wide">{label}</Label>
        <div className="flex items-center gap-1">
          {options ? (
            <Select value={draft} onValueChange={setDraft}>
              <SelectTrigger className="h-8 text-xs bg-stone-50 border-stone-200 flex-1"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-white border-stone-200">
                {options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          ) : type === "textarea" ? (
            <Textarea value={draft} onChange={e => setDraft(e.target.value)} rows={2} className="text-xs bg-stone-50 border-stone-200 flex-1" />
          ) : (
            <Input type={type} value={draft} onChange={e => setDraft(e.target.value)} className="h-8 text-xs bg-stone-50 border-stone-200 flex-1" />
          )}
          <button onClick={save} className="p-1 rounded-lg bg-violet-500 text-white hover:bg-violet-600"><Check className="w-3.5 h-3.5" /></button>
          <button onClick={() => { setDraft(value ?? ""); setEditing(false); }} className="p-1 rounded-lg bg-stone-100 text-stone-500 hover:bg-stone-200"><X className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col gap-0.5">
      <Label className="text-[10px] text-stone-400 uppercase tracking-wide">{label}</Label>
      <div className="flex items-center gap-1">
        <span className="text-sm text-stone-800 flex-1">{value || <span className="text-stone-300 italic text-xs">—</span>}</span>
        <button onClick={() => { setDraft(value ?? ""); setEditing(true); }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-stone-100 text-stone-400 transition-opacity">
          <Pencil className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default function PetDetailModal({ pet, open, onClose, onPetUpdated }) {
  const queryClient = useQueryClient();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const { data: healthRecords = [] } = useQuery({
    queryKey: ["health", pet?.id],
    queryFn: () => base44.entities.PetHealthRecords.filter({ pet_id: pet.id }, "-date", 50),
    enabled: !!pet?.id && open,
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["pet-apts", pet?.id],
    queryFn: () => base44.entities.Appointments.filter({ pet_id: pet.id, status: "concluido" }, "-scheduled_date", 50),
    enabled: !!pet?.id && open,
  });

  if (!pet) return null;

  const updateField = async (field, value) => {
    await base44.entities.Pets.update(pet.id, { [field]: value });
    queryClient.invalidateQueries({ queryKey: ["pets"] });
    onPetUpdated?.();
  };

  const uploadPhoto = async (file) => {
    setUploadingPhoto(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await updateField("photo_url", file_url);
    setUploadingPhoto(false);
  };

  // Vaccine status
  const vaccineExpiry = pet.rabies_vaccine_expiry ? parseISO(pet.rabies_vaccine_expiry) : null;
  const vaccineStatus = vaccineExpiry
    ? differenceInDays(vaccineExpiry, new Date())
    : null;

  // Last deworming
  const lastDeworming = healthRecords.filter(r => r.type === "desparasitacao").sort((a, b) => b.date.localeCompare(a.date))[0];
  const dewormingDaysAgo = lastDeworming ? differenceInDays(new Date(), parseISO(lastDeworming.date)) : null;

  // Last bath
  const lastBath = appointments.find(a => a.service_names?.toLowerCase().includes("banho"));
  const bathCount = appointments.filter(a => a.service_names?.toLowerCase().includes("banho")).length;
  const loyaltyProgress = bathCount % BANHOS_PER_REWARD;
  const loyaltyReady = loyaltyProgress === 0 && bathCount > 0;

  // Weight history
  const weightRecords = healthRecords.filter(r => r.type === "peso").sort((a, b) => b.date.localeCompare(a.date));
  const lastWeight = weightRecords[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white border-stone-200 text-stone-900 max-w-lg max-h-[92vh] overflow-y-auto p-0">
        {/* Header / Hero */}
        <div className="relative bg-gradient-to-br from-violet-50 to-stone-50 px-6 pt-6 pb-4 border-b border-stone-100">
          <div className="flex items-start gap-4">
            <label className="relative cursor-pointer flex-shrink-0">
              <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadPhoto(e.target.files[0])} />
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-stone-200 overflow-hidden flex items-center justify-center shadow-sm hover:border-violet-300 transition-colors">
                {uploadingPhoto ? (
                  <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                ) : pet.photo_url ? (
                  <img src={pet.photo_url} className="w-full h-full object-cover" alt={pet.name} />
                ) : (
                  <PawPrint className="w-8 h-8 text-violet-300" />
                )}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 rounded-2xl transition-colors flex items-end justify-end p-1">
                  <Upload className="w-3 h-3 text-white opacity-0 hover:opacity-100" />
                </div>
              </div>
            </label>

            <div className="flex-1 min-w-0 pt-1">
              <InlineField label="Nome" value={pet.name} onSave={v => updateField("name", v)} />
              <div className="flex gap-3 mt-2">
                <InlineField label="Raça" value={pet.breed} onSave={v => updateField("breed", v)} />
                <InlineField
                  label="Espécie"
                  value={pet.species}
                  onSave={v => updateField("species", v)}
                  options={[{ value: "cão", label: "Cão" }, { value: "gato", label: "Gato" }]}
                />
              </div>
            </div>

            <Link to={createPageUrl(`PetHealth?petId=${pet.id}`)} onClick={onClose}
              className="p-2 rounded-xl bg-white border border-stone-200 text-violet-500 hover:bg-violet-50 hover:border-violet-200 transition-colors shadow-sm flex-shrink-0">
              <HeartPulse className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="px-6 py-4 space-y-5">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className={`rounded-xl p-3 border text-center ${vaccineStatus !== null && vaccineStatus < 30 ? "bg-red-50 border-red-200" : "bg-stone-50 border-stone-200"}`}>
              <Syringe className={`w-4 h-4 mx-auto mb-1 ${vaccineStatus !== null && vaccineStatus < 30 ? "text-red-500" : "text-violet-500"}`} />
              <p className="text-[10px] text-stone-500 uppercase tracking-wide">Vacina Raiva</p>
              <p className={`text-xs font-semibold mt-0.5 ${vaccineStatus !== null && vaccineStatus < 30 ? "text-red-600" : "text-stone-800"}`}>
                {vaccineExpiry ? format(vaccineExpiry, "dd/MM/yy") : "—"}
                {vaccineStatus !== null && vaccineStatus < 30 && <span className="block text-[9px] text-red-500">{vaccineStatus < 0 ? "Expirada!" : `${vaccineStatus}d`}</span>}
              </p>
            </div>
            <div className={`rounded-xl p-3 border text-center ${dewormingDaysAgo !== null && dewormingDaysAgo > 90 ? "bg-amber-50 border-amber-200" : "bg-stone-50 border-stone-200"}`}>
              <Bug className={`w-4 h-4 mx-auto mb-1 ${dewormingDaysAgo !== null && dewormingDaysAgo > 90 ? "text-amber-500" : "text-emerald-500"}`} />
              <p className="text-[10px] text-stone-500 uppercase tracking-wide">Desparasit.</p>
              <p className={`text-xs font-semibold mt-0.5 ${dewormingDaysAgo !== null && dewormingDaysAgo > 90 ? "text-amber-600" : "text-stone-800"}`}>
                {lastDeworming ? format(parseISO(lastDeworming.date), "dd/MM/yy") : "—"}
                {dewormingDaysAgo !== null && dewormingDaysAgo > 90 && <span className="block text-[9px] text-amber-500">{dewormingDaysAgo}d atrás</span>}
              </p>
            </div>
            <div className="rounded-xl p-3 border bg-stone-50 border-stone-200 text-center">
              <Droplets className="w-4 h-4 mx-auto mb-1 text-blue-500" />
              <p className="text-[10px] text-stone-500 uppercase tracking-wide">Último Banho</p>
              <p className="text-xs font-semibold text-stone-800 mt-0.5">
                {lastBath ? format(parseISO(lastBath.scheduled_date), "dd/MM/yy") : "—"}
              </p>
            </div>
          </div>

          {/* Loyalty */}
          {bathCount > 0 && (
            <div className={`rounded-xl p-3 border ${loyaltyReady ? "bg-amber-50 border-amber-200" : "bg-stone-50 border-stone-100"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Gift className={`w-4 h-4 ${loyaltyReady ? "text-amber-500" : "text-violet-400"}`} />
                  <span className="text-xs font-semibold text-stone-700">Fidelização</span>
                </div>
                <span className="text-xs text-stone-400">{bathCount} banho{bathCount !== 1 ? "s" : ""} total</span>
              </div>
              {loyaltyReady ? (
                <p className="text-xs font-semibold text-amber-600 text-center">🎁 Benefício disponível no próximo banho!</p>
              ) : (
                <>
                  <div className="flex gap-0.5">
                    {Array.from({ length: BANHOS_PER_REWARD }).map((_, i) => (
                      <div key={i} className={`flex-1 h-1.5 rounded-full ${i < loyaltyProgress ? "bg-violet-500" : "bg-stone-200"}`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1 text-center">{loyaltyProgress}/{BANHOS_PER_REWARD} para o próximo prémio</p>
                </>
              )}
            </div>
          )}

          {/* Physical Info */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Weight className="w-3.5 h-3.5" /> Informação Física</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <InlineField label="Peso (kg)" value={pet.weight_kg ? String(pet.weight_kg) : ""} onSave={v => updateField("weight_kg", Number(v))} type="number" />
              <InlineField
                label="Comportamento"
                value={pet.behavior}
                onSave={v => updateField("behavior", v)}
                options={[
                  { value: "calmo", label: "Calmo" },
                  { value: "agitado", label: "Agitado" },
                  { value: "agressivo", label: "Agressivo" },
                ]}
              />
              {lastWeight && (
                <div className="col-span-2 flex items-center gap-1.5 text-xs text-stone-500 bg-stone-50 rounded-lg px-3 py-2 border border-stone-100">
                  <HeartPulse className="w-3.5 h-3.5 text-violet-400" />
                  Último peso registado: <strong>{lastWeight.value_kg}kg</strong> em {format(parseISO(lastWeight.date), "dd/MM/yy")}
                </div>
              )}
            </div>
          </div>

          {/* Health */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Saúde & Veterinário</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <InlineField label="Validade Vacina Raiva" value={pet.rabies_vaccine_expiry} onSave={v => updateField("rabies_vaccine_expiry", v)} type="date" />
              <InlineField label="Microchip" value={pet.microchip_number} onSave={v => updateField("microchip_number", v)} />
              <div className="col-span-2">
                <InlineField label="Contacto do Veterinário" value={pet.vet_contact} onSave={v => updateField("vet_contact", v)} />
              </div>
              <div className="col-span-2">
                <InlineField label="Alergias / Info Médica" value={pet.allergies_medical_info} onSave={v => updateField("allergies_medical_info", v)} type="textarea" />
              </div>
            </div>
          </div>

          {/* Appointment History */}
          {appointments.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Histórico de Serviços</p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {appointments.slice(0, 10).map(a => (
                  <div key={a.id} className="flex items-center justify-between px-3 py-2 bg-stone-50 border border-stone-100 rounded-xl text-xs">
                    <div>
                      <p className="font-medium text-stone-800">{a.service_names}</p>
                      <p className="text-stone-400">{a.professional_name || "—"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-stone-600">{format(parseISO(a.scheduled_date), "dd MMM yy", { locale: pt })}</p>
                      <p className="text-stone-400">{a.total_price ? `${a.total_price}€` : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boletim Vacinas */}
          {pet.vaccine_booklet_url && (
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Boletim de Vacinas</p>
              <a href={pet.vaccine_booklet_url} target="_blank" rel="noreferrer" className="block">
                <img src={pet.vaccine_booklet_url} className="w-full max-h-40 object-cover rounded-xl border border-stone-200" alt="boletim" />
              </a>
            </div>
          )}

          {/* Health records notes */}
          {healthRecords.filter(r => r.type === "nota" && r.notes).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Notas de Saúde</p>
              <div className="space-y-1.5">
                {healthRecords.filter(r => r.type === "nota").slice(0, 5).map(r => (
                  <div key={r.id} className="px-3 py-2 bg-stone-50 rounded-xl border border-stone-100">
                    <p className="text-[10px] text-stone-400">{format(parseISO(r.date), "dd/MM/yy")}</p>
                    <p className="text-xs text-stone-700">{r.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}