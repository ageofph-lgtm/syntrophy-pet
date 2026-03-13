import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Weight, Bug, Syringe, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, addMonths, differenceInDays } from "date-fns";
import { pt } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const TYPE_CONFIG = {
  peso:           { label: "Pesagem",         icon: Weight,   color: "text-blue-500",  bg: "bg-blue-50",  border: "border-blue-200" },
  desparasitacao: { label: "Desparasitação",  icon: Bug,      color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  vacina:         { label: "Vacina",           icon: Syringe,  color: "text-violet-500",bg: "bg-violet-50",border: "border-violet-200" },
  nota:           { label: "Nota",             icon: FileText, color: "text-stone-500", bg: "bg-stone-50", border: "border-stone-200" },
};

const EMPTY_FORM = { type: "peso", date: format(new Date(), "yyyy-MM-dd"), value_kg: "", notes: "" };

export default function PetHealth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const petId = urlParams.get("petId");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const { data: pets = [] } = useQuery({
    queryKey: ["pets", user?.email],
    queryFn: () => base44.entities.Pets.filter({ owner_email: user.email }),
    enabled: !!user?.email,
  });
  const pet = pets.find((p) => p.id === petId);

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["health-records", petId],
    queryFn: () => base44.entities.PetHealthRecords.filter({ pet_id: petId }, "-date", 100),
    enabled: !!petId,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PetHealthRecords.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["health-records", petId] }); setShowForm(false); setForm(EMPTY_FORM); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PetHealthRecords.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["health-records", petId] }),
  });

  const handleSave = () => {
    if (!petId) return;
    createMutation.mutate({
      ...form,
      pet_id: petId,
      pet_name: pet?.name || "",
      owner_email: user?.email || "",
      value_kg: form.type === "peso" ? Number(form.value_kg) || null : null,
    });
  };

  // Weight chart data
  const weightRecords = records
    .filter((r) => r.type === "peso" && r.value_kg)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => ({ date: format(new Date(r.date + "T00:00:00"), "d MMM", { locale: pt }), peso: r.value_kg }));

  // Last deworm
  const lastDeworm = records.filter((r) => r.type === "desparasitacao").sort((a, b) => b.date.localeCompare(a.date))[0];
  const daysSinceDeworm = lastDeworm ? differenceInDays(new Date(), new Date(lastDeworm.date + "T00:00:00")) : null;
  const dewormDue = daysSinceDeworm !== null && daysSinceDeworm > 90;
  const nextDeworm = lastDeworm ? format(addMonths(new Date(lastDeworm.date + "T00:00:00"), 3), "d MMM yyyy", { locale: pt }) : null;

  if (!petId) return <div className="text-center py-20 text-stone-400">Pet não encontrado.</div>;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white border border-stone-200 hover:border-stone-300 shadow-sm">
          <ArrowLeft className="w-4 h-4 text-stone-500" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-stone-900">Caderneta de Saúde</h1>
          <p className="text-xs text-stone-400">{pet?.name || "..."} · {pet?.breed}</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
          <Plus className="w-3.5 h-3.5 mr-1" /> Registar
        </Button>
      </div>

      {/* Deworm Alert */}
      {dewormDue && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            <strong>Desparasitação em atraso</strong> — última há {daysSinceDeworm} dias. Recomendado de 3 em 3 meses.
          </p>
        </div>
      )}
      {!dewormDue && nextDeworm && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200 mb-4">
          <Bug className="w-4 h-4 text-green-600 flex-shrink-0" />
          <p className="text-xs text-green-700">Próxima desparasitação prevista: <strong>{nextDeworm}</strong></p>
        </div>
      )}
      {!lastDeworm && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 mb-4">
          <Bug className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <p className="text-xs text-stone-500">Sem registo de desparasitação. Registe abaixo.</p>
        </div>
      )}

      {/* Weight Chart */}
      {weightRecords.length >= 2 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Weight className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-semibold text-stone-900">Evolução do Peso</h2>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={weightRecords}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} unit="kg" width={40} />
              <Tooltip formatter={(v) => [`${v}kg`, "Peso"]} labelStyle={{ fontSize: 11 }} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 11 }} />
              <Line type="monotone" dataKey="peso" stroke="#7c3aed" strokeWidth={2} dot={{ fill: "#7c3aed", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Records List */}
      <div className="space-y-2">
        {isLoading ? (
          [...Array(3)].map((_, i) => <div key={i} className="bg-white border border-stone-200 rounded-xl p-4 animate-pulse h-16" />)
        ) : records.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center shadow-sm">
            <FileText className="w-8 h-8 text-stone-300 mx-auto mb-3" />
            <p className="text-sm text-stone-400">Nenhum registo de saúde ainda.</p>
            <p className="text-xs text-stone-300 mt-1">Clique em "Registar" para começar.</p>
          </div>
        ) : (
          records.map((rec) => {
            const cfg = TYPE_CONFIG[rec.type] || TYPE_CONFIG.nota;
            const Icon = cfg.icon;
            return (
              <div key={rec.id} className={`bg-white border rounded-xl p-4 flex items-center gap-3 shadow-sm ${cfg.border}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-700">{cfg.label}</span>
                    {rec.value_kg && <span className="text-xs font-bold text-blue-600">{rec.value_kg}kg</span>}
                  </div>
                  <p className="text-[11px] text-stone-400">
                    {rec.date && format(new Date(rec.date + "T00:00:00"), "d 'de' MMMM yyyy", { locale: pt })}
                  </p>
                  {rec.notes && <p className="text-xs text-stone-500 mt-0.5 truncate">{rec.notes}</p>}
                </div>
                <button onClick={() => deleteMutation.mutate(rec.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-stone-300 hover:text-red-400 transition-colors flex-shrink-0">
                  <span className="text-xs">✕</span>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Record Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-white border-stone-200 text-stone-900 max-w-sm">
          <DialogHeader><DialogTitle className="text-stone-900">Novo Registo de Saúde</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs text-stone-500">Tipo</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="bg-stone-50 border-stone-200 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-stone-200">
                  <SelectItem value="peso">⚖️ Pesagem</SelectItem>
                  <SelectItem value="desparasitacao">🐛 Desparasitação</SelectItem>
                  <SelectItem value="vacina">💉 Vacina</SelectItem>
                  <SelectItem value="nota">📝 Nota</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-stone-500">Data</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-stone-50 border-stone-200 mt-1 text-stone-900" />
            </div>
            {form.type === "peso" && (
              <div>
                <Label className="text-xs text-stone-500">Peso (kg)</Label>
                <Input type="number" step="0.1" value={form.value_kg} onChange={(e) => setForm({ ...form, value_kg: e.target.value })} className="bg-stone-50 border-stone-200 mt-1 text-stone-900" placeholder="ex: 8.5" />
              </div>
            )}
            <div>
              <Label className="text-xs text-stone-500">Notas</Label>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-stone-50 border-stone-200 mt-1 text-stone-900" placeholder="Observações opcionais" />
            </div>
            <Button onClick={handleSave} disabled={createMutation.isPending || !form.date} className="w-full bg-violet-600 hover:bg-violet-700 text-white">
              {createMutation.isPending ? "A guardar..." : "Guardar Registo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}