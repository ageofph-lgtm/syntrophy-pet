import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Users, Scissors, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ShopSettings() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <h1 className="text-xl font-bold text-stone-900 mb-6">Definições da Loja</h1>
      <Tabs defaultValue="professionals" className="space-y-6">
        <TabsList className="bg-white border border-stone-200 shadow-sm">
          <TabsTrigger value="professionals" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 text-stone-500">
            <Users className="w-3 h-3 mr-1.5" /> Profissionais
          </TabsTrigger>
          <TabsTrigger value="services" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 text-stone-500">
            <Scissors className="w-3 h-3 mr-1.5" /> Serviços
          </TabsTrigger>
        </TabsList>
        <TabsContent value="professionals"><ProfessionalsTab /></TabsContent>
        <TabsContent value="services"><ServicesTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function ProfessionalsTab() {
  const queryClient = useQueryClient();
  const { data: professionals = [] } = useQuery({ queryKey: ["professionals"], queryFn: () => base44.entities.Professionals.list() });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", specialties: "", is_active: true, work_start: "09:00", work_end: "18:00" });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editing) return base44.entities.Professionals.update(editing.id, data);
      return base44.entities.Professionals.create(data);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["professionals"] }); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Professionals.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["professionals"] }),
  });

  const openForm = (pro) => {
    if (pro) { setEditing(pro); setForm(pro); }
    else { setEditing(null); setForm({ name: "", specialties: "", is_active: true, work_start: "09:00", work_end: "18:00" }); }
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-stone-400">Gerir profissionais da equipa</p>
        <Button onClick={() => openForm(null)} size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
          <Plus className="w-3 h-3 mr-1" /> Novo
        </Button>
      </div>
      <div className="space-y-2">
        {professionals.map((pro) => (
          <div key={pro.id} className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-stone-900">{pro.name}</h3>
                {!pro.is_active && <span className="text-[9px] bg-red-50 text-red-500 border border-red-200 px-1.5 py-0.5 rounded-full">Inativo</span>}
              </div>
              <p className="text-[11px] text-stone-400">{pro.work_start} — {pro.work_end} · {pro.specialties}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openForm(pro)} className="p-1.5 rounded-lg hover:bg-stone-100"><Pencil className="w-3.5 h-3.5 text-stone-400" /></button>
              <button onClick={() => deleteMutation.mutate(pro.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-white border-stone-200 text-stone-900 max-w-sm">
          <DialogHeader><DialogTitle className="text-stone-900">{editing ? "Editar" : "Novo"} Profissional</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div><Label className="text-xs text-stone-500">Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-stone-50 border-stone-200 mt-1" /></div>
            <div><Label className="text-xs text-stone-500">Especialidades</Label><Input value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} placeholder="banho,tosquia,spa" className="bg-stone-50 border-stone-200 mt-1" /></div>
            <div><Label className="text-xs text-stone-500">Comissão (%)</Label><Input type="number" min="0" max="100" value={form.commission_rate ?? 10} onChange={(e) => setForm({ ...form, commission_rate: Number(e.target.value) })} className="bg-stone-50 border-stone-200 mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs text-stone-500">Início</Label><Input type="time" value={form.work_start} onChange={(e) => setForm({ ...form, work_start: e.target.value })} className="bg-stone-50 border-stone-200 mt-1" /></div>
              <div><Label className="text-xs text-stone-500">Fim</Label><Input type="time" value={form.work_end} onChange={(e) => setForm({ ...form, work_end: e.target.value })} className="bg-stone-50 border-stone-200 mt-1" /></div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label className="text-xs text-stone-500">Ativo</Label>
            </div>
            <Button onClick={() => saveMutation.mutate(form)} disabled={!form.name} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Save className="w-4 h-4 mr-2" /> Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ServicesTab() {
  const queryClient = useQueryClient();
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => base44.entities.Services.list() });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", category: "banho", base_price: 0, base_duration_minutes: 30, description: "", is_addon: false });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const parsed = { ...data, base_price: Number(data.base_price), base_duration_minutes: Number(data.base_duration_minutes) };
      if (editing) return base44.entities.Services.update(editing.id, parsed);
      return base44.entities.Services.create(parsed);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["services"] }); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Services.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });

  const openForm = (svc) => {
    if (svc) { setEditing(svc); setForm(svc); }
    else { setEditing(null); setForm({ name: "", category: "banho", base_price: 0, base_duration_minutes: 30, description: "", is_addon: false }); }
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-stone-400">Gerir serviços disponíveis</p>
        <Button onClick={() => openForm(null)} size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
          <Plus className="w-3 h-3 mr-1" /> Novo
        </Button>
      </div>
      <div className="space-y-2">
        {services.map((svc) => (
          <div key={svc.id} className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-stone-900">{svc.name}</h3>
                {svc.is_addon && <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-full">Adicional</span>}
              </div>
              <p className="text-[11px] text-stone-400">{svc.category} · {svc.base_duration_minutes}min · {svc.base_price}€</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openForm(svc)} className="p-1.5 rounded-lg hover:bg-stone-100"><Pencil className="w-3.5 h-3.5 text-stone-400" /></button>
              <button onClick={() => deleteMutation.mutate(svc.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-white border-stone-200 text-stone-900 max-w-sm">
          <DialogHeader><DialogTitle className="text-stone-900">{editing ? "Editar" : "Novo"} Serviço</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div><Label className="text-xs text-stone-500">Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-stone-50 border-stone-200 mt-1" /></div>
            <div>
              <Label className="text-xs text-stone-500">Categoria</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="bg-stone-50 border-stone-200 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-stone-200">
                  <SelectItem value="banho">Banho</SelectItem>
                  <SelectItem value="tosquia">Tosquia</SelectItem>
                  <SelectItem value="spa">SPA</SelectItem>
                  <SelectItem value="adicional">Adicional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs text-stone-500">Preço (€)</Label><Input type="number" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} className="bg-stone-50 border-stone-200 mt-1" /></div>
              <div><Label className="text-xs text-stone-500">Duração (min)</Label><Input type="number" value={form.base_duration_minutes} onChange={(e) => setForm({ ...form, base_duration_minutes: e.target.value })} className="bg-stone-50 border-stone-200 mt-1" /></div>
            </div>
            <div><Label className="text-xs text-stone-500">Descrição</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-stone-50 border-stone-200 mt-1" /></div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_addon} onCheckedChange={(v) => setForm({ ...form, is_addon: v })} />
              <Label className="text-xs text-stone-500">É adicional (upsell)</Label>
            </div>
            <Button onClick={() => saveMutation.mutate(form)} disabled={!form.name} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Save className="w-4 h-4 mr-2" /> Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}