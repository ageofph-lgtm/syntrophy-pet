import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { PawPrint, User, Phone, ArrowRight, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [profileForm, setProfileForm] = useState({ phone: "", nif: "" });
  const [petForm, setPetForm] = useState({
    name: "", species: "cão", breed: "", weight_kg: "",
    behavior: "calmo", allergies_medical_info: "", photo_url: "",
  });

  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const handleProfileNext = async () => {
    setSaving(true);
    await base44.auth.updateMe(profileForm);
    setSaving(false);
    setStep(1);
  };

  const handlePetSave = async () => {
    setSaving(true);
    await base44.entities.Pets.create({ ...petForm, owner_email: user.email, weight_kg: Number(petForm.weight_kg) || 0 });
    setSaving(false);
    navigate(createPageUrl("TutorHome"));
  };

  const uploadPhoto = async (file) => {
    setUploadingPhoto(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setPetForm((prev) => ({ ...prev, photo_url: file_url }));
    setUploadingPhoto(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-orange-500 font-bold text-3xl">φ</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Bem-vindo ao Syntrophy</h1>
          <p className="text-sm text-stone-400 mt-1">Vamos configurar o seu perfil</p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {["O seu perfil", "O seu pet"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${i < step ? "bg-orange-500 text-white" : i === step ? "bg-orange-100 text-orange-600 ring-2 ring-orange-400" : "bg-stone-100 text-stone-400"}`}>
                {i < step ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className={`text-xs ${i === step ? "text-stone-800 font-medium" : "text-stone-400"}`}>{label}</span>
              {i < 1 && <div className="w-8 h-px bg-stone-200" />}
            </div>
          ))}
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          {step === 0 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900">O seu perfil</h2>
                  <p className="text-xs text-stone-400">Olá, {user?.full_name?.split(" ")[0]}!</p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-stone-500">Telemóvel (WhatsApp)</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="+351 9XX XXX XXX" className="bg-stone-50 border-stone-200 pl-10" />
                </div>
              </div>

              <div>
                <Label className="text-xs text-stone-500">NIF (opcional)</Label>
                <Input value={profileForm.nif} onChange={(e) => setProfileForm({ ...profileForm, nif: e.target.value })} placeholder="XXXXXXXXX" className="bg-stone-50 border-stone-200 mt-1" />
              </div>

              <Button onClick={handleProfileNext} disabled={saving} className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12">
                {saving ? "A guardar..." : "Próximo"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                  <PawPrint className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900">O seu pet</h2>
                  <p className="text-xs text-stone-400">Adicione o seu primeiro companheiro</p>
                </div>
              </div>

              <div className="flex justify-center">
                <label className="relative w-20 h-20 rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-orange-300 hover:bg-orange-50 transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && uploadPhoto(e.target.files[0])} />
                  {uploadingPhoto ? (
                    <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  ) : petForm.photo_url ? (
                    <img src={petForm.photo_url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-5 h-5 text-stone-400 mx-auto" />
                      <p className="text-[9px] text-stone-400 mt-1">Foto</p>
                    </div>
                  )}
                </label>
              </div>

              <div>
                <Label className="text-xs text-stone-500">Nome do pet *</Label>
                <Input value={petForm.name} onChange={(e) => setPetForm({ ...petForm, name: e.target.value })} className="bg-stone-50 border-stone-200 mt-1" placeholder="Ex: Bolinha" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-stone-500">Espécie</Label>
                  <Select value={petForm.species} onValueChange={(v) => setPetForm({ ...petForm, species: v })}>
                    <SelectTrigger className="bg-stone-50 border-stone-200 mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-white border-stone-200">
                      <SelectItem value="cão">Cão</SelectItem>
                      <SelectItem value="gato">Gato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-stone-500">Raça</Label>
                  <Input value={petForm.breed} onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })} className="bg-stone-50 border-stone-200 mt-1" placeholder="Ex: Labrador" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-stone-500">Peso (kg)</Label>
                  <Input type="number" value={petForm.weight_kg} onChange={(e) => setPetForm({ ...petForm, weight_kg: e.target.value })} className="bg-stone-50 border-stone-200 mt-1" placeholder="Ex: 5.5" />
                </div>
                <div>
                  <Label className="text-xs text-stone-500">Temperamento</Label>
                  <Select value={petForm.behavior} onValueChange={(v) => setPetForm({ ...petForm, behavior: v })}>
                    <SelectTrigger className="bg-stone-50 border-stone-200 mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-white border-stone-200">
                      <SelectItem value="calmo">Calmo</SelectItem>
                      <SelectItem value="agitado">Agitado</SelectItem>
                      <SelectItem value="agressivo">Agressivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs text-stone-500">Alergias / Info Médica</Label>
                <Textarea value={petForm.allergies_medical_info} onChange={(e) => setPetForm({ ...petForm, allergies_medical_info: e.target.value })} className="bg-stone-50 border-stone-200 mt-1" rows={2} placeholder="Opcional..." />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => navigate(createPageUrl("TutorHome"))} className="border-stone-200 text-stone-500 hover:bg-stone-50">
                  Saltar
                </Button>
                <Button onClick={handlePetSave} disabled={saving || !petForm.name} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-12">
                  {saving ? "A guardar..." : "Concluir Registo"}
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}