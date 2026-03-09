import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, X, PawPrint, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PetCard from "../components/tutor/PetCard";
import EmptyState from "../components/shared/EmptyState";

const EMPTY_PET = {
  name: "", species: "cão", breed: "", weight_kg: "", behavior: "calmo",
  allergies_medical_info: "", rabies_vaccine_expiry: "", microchip_number: "",
  vet_contact: "", photo_url: "", vaccine_booklet_url: "",
};

export default function MyPets() {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [form, setForm] = useState(EMPTY_PET);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingVaccine, setUploadingVaccine] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const u = await base44.auth.me();
    setUser(u);
    const p = await base44.entities.Pets.filter({ owner_email: u.email }, "-created_date");
    setPets(p);
    setLoading(false);
  };

  const openForm = (pet) => {
    if (pet) {
      setEditingPet(pet);
      setForm({ ...EMPTY_PET, ...pet });
    } else {
      setEditingPet(null);
      setForm(EMPTY_PET);
    }
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, owner_email: user.email, weight_kg: Number(form.weight_kg) || 0 };
    if (editingPet) {
      await base44.entities.Pets.update(editingPet.id, data);
    } else {
      await base44.entities.Pets.create(data);
    }
    setShowForm(false);
    setSaving(false);
    loadData();
  };

  const handleDelete = async () => {
    if (!editingPet) return;
    await base44.entities.Pets.delete(editingPet.id);
    setShowForm(false);
    loadData();
  };

  const uploadFile = async (file, field, setUploading) => {
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm((prev) => ({ ...prev, [field]: file_url }));
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Meus Pets</h1>
        <Button onClick={() => openForm(null)} className="bg-orange-500 hover:bg-orange-600 text-sm">
          <Plus className="w-4 h-4 mr-2" />
          Novo Pet
        </Button>
      </div>

      {pets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="Nenhum pet registado"
          description="Adicione o seu pet para começar a agendar serviços."
          action={
            <Button onClick={() => openForm(null)} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Pet
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onEdit={openForm} />
          ))}
        </div>
      )}

      {/* Pet Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#161616] border-[#2A2A2A] text-[#F5F5F5] max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPet ? "Editar Pet" : "Novo Pet"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Photo */}
            <div className="flex justify-center">
              <label className="relative w-20 h-20 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center cursor-pointer overflow-hidden hover:border-orange-500/50 transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && uploadFile(e.target.files[0], "photo_url", setUploadingPhoto)} />
                {uploadingPhoto ? (
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                ) : form.photo_url ? (
                  <img src={form.photo_url} className="w-full h-full object-cover" alt="" />
                ) : (
                  <PawPrint className="w-8 h-8 text-[#6B6B6B]" />
                )}
              </label>
            </div>

            <div>
              <Label className="text-xs text-[#A0A0A0]">Nome</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-[#1A1A1A] border-[#2A2A2A] mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-[#A0A0A0]">Espécie</Label>
                <Select value={form.species} onValueChange={(v) => setForm({ ...form, species: v })}>
                  <SelectTrigger className="bg-[#1A1A1A] border-[#2A2A2A] mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                    <SelectItem value="cão">Cão</SelectItem>
                    <SelectItem value="gato">Gato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-[#A0A0A0]">Raça</Label>
                <Input value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className="bg-[#1A1A1A] border-[#2A2A2A] mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-[#A0A0A0]">Peso (kg)</Label>
                <Input type="number" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} className="bg-[#1A1A1A] border-[#2A2A2A] mt-1" />
              </div>
              <div>
                <Label className="text-xs text-[#A0A0A0]">Comportamento</Label>
                <Select value={form.behavior} onValueChange={(v) => setForm({ ...form, behavior: v })}>
                  <SelectTrigger className="bg-[#1A1A1A] border-[#2A2A2A] mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                    <SelectItem value="calmo">Calmo</SelectItem>
                    <SelectItem value="agitado">Agitado</SelectItem>
                    <SelectItem value="agressivo">Agressivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs text-[#A0A0A0]">Alergias / Info Médica</Label>
              <Textarea value={form.allergies_medical_info} onChange={(e) => setForm({ ...form, allergies_medical_info: e.target.value })} className="bg-[#1A1A1A] border-[#2A2A2A] mt-1" rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-[#A0A0A0]">Validade Vacina Raiva</Label>
                <Input type="date" value={form.rabies_vaccine_expiry} onChange={(e) => setForm({ ...form, rabies_vaccine_expiry: e.target.value })} className="bg-[#1A1A1A] border-[#2A2A2A] mt-1" />
              </div>
              <div>
                <Label className="text-xs text-[#A0A0A0]">Microchip</Label>
                <Input value={form.microchip_number} onChange={(e) => setForm({ ...form, microchip_number: e.target.value })} className="bg-[#1A1A1A] border-[#2A2A2A] mt-1" />
              </div>
            </div>

            <div>
              <Label className="text-xs text-[#A0A0A0]">Contacto do Veterinário</Label>
              <Input value={form.vet_contact} onChange={(e) => setForm({ ...form, vet_contact: e.target.value })} className="bg-[#1A1A1A] border-[#2A2A2A] mt-1" />
            </div>

            {/* Vaccine Booklet Upload */}
            <div>
              <Label className="text-xs text-[#A0A0A0]">Boletim de Vacinas</Label>
              {form.vaccine_booklet_url ? (
                <div className="mt-1 relative w-24 h-24 rounded-xl overflow-hidden border border-[#2A2A2A]">
                  <img src={form.vaccine_booklet_url} className="w-full h-full object-cover" alt="" />
                  <button onClick={() => setForm({ ...form, vaccine_booklet_url: "" })} className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px]">×</button>
                </div>
              ) : (
                <label className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl border border-dashed border-[#2A2A2A] bg-[#1A1A1A] cursor-pointer hover:border-orange-500/50 transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && uploadFile(e.target.files[0], "vaccine_booklet_url", setUploadingVaccine)} />
                  {uploadingVaccine ? (
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 text-[#6B6B6B]" />
                  )}
                  <span className="text-xs text-[#6B6B6B]">Carregar foto</span>
                </label>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              {editingPet && (
                <Button variant="outline" onClick={handleDelete} className="border-red-500/30 text-red-400 hover:bg-red-500/10 flex-1">
                  Eliminar
                </Button>
              )}
              <Button onClick={handleSave} disabled={saving || !form.name} className="bg-orange-500 hover:bg-orange-600 flex-1">
                {saving ? "A guardar..." : editingPet ? "Guardar" : "Criar Pet"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}