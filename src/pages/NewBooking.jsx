import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, ArrowRight, Check, PawPrint, Scissors, Calendar, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import PetCard from "../components/tutor/PetCard";
import ServiceCard from "../components/tutor/ServiceCard";
import GroomingSelector from "../components/booking/GroomingSelector";
import TimeSlotPicker from "../components/booking/TimeSlotPicker";
import BookingSummary from "../components/booking/BookingSummary";

function calculateDuration(services, pet) {
  let total = services.reduce((sum, s) => sum + (s.base_duration_minutes || 0), 0);
  const w = pet?.weight_kg || 0;
  if (w > 40) total += 45;
  else if (w > 20) total += 30;
  if (pet?.behavior === "agressivo" || pet?.behavior === "agitado") total += 15;
  return total;
}

function calculatePrice(services) {
  return services.reduce((sum, s) => sum + (s.base_price || 0), 0);
}

const STEP_META = [
  { key: "pet",      label: "Pet",      icon: PawPrint },
  { key: "servicos", label: "Serviços", icon: Scissors },
  { key: "horario",  label: "Horário",  icon: Calendar },
  { key: "resumo",   label: "Resumo",   icon: Check },
];

export default function NewBooking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);

  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [groomingPrefs, setGroomingPrefs] = useState({ corpo: "", cabeca: "", rabo: "", accessories: "", perfume: "", reference_photo_url: "" });
  const [lastGroomingPrefs, setLastGroomingPrefs] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState("any");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const u = await base44.auth.me();
    setUser(u);
    const [p, s, pr] = await Promise.all([
      base44.entities.Pets.filter({ owner_email: u.email }),
      base44.entities.Services.list(),
      base44.entities.Professionals.list(),
    ]);
    setPets(p); setServices(s); setProfessionals(pr);
    const lastAppt = await base44.entities.Appointments.filter({ owner_email: u.email }, "-created_date", 1);
    if (lastAppt.length > 0 && lastAppt[0].tosquia_corpo) {
      setLastGroomingPrefs({
        corpo: lastAppt[0].tosquia_corpo, cabeca: lastAppt[0].tosquia_cabeca,
        rabo: lastAppt[0].tosquia_rabo, accessories: lastAppt[0].accessories,
        perfume: lastAppt[0].perfume_preference, reference_photo_url: lastAppt[0].reference_photo_url,
      });
    }
    setLoading(false);
  };

  const hasTosquia = selectedServices.some((s) => s.category === "tosquia");
  const duration = calculateDuration(selectedServices, selectedPet);
  const totalPrice = calculatePrice(selectedServices);
  const baseServices = services.filter((s) => !s.is_addon);
  const addonServices = services.filter((s) => s.is_addon);

  // Build dynamic steps
  const dynamicSteps = [
    STEP_META[0], // pet
    STEP_META[1], // serviços
    ...(hasTosquia ? [{ key: "tosquia", label: "Tosquia", icon: Scissors }] : []),
    STEP_META[2], // horário
    STEP_META[3], // resumo
  ];

  const currentKey = dynamicSteps[step]?.key;

  const toggleService = (service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      return exists ? prev.filter((s) => s.id !== service.id) : [...prev, service];
    });
  };

  const canGoNext = () => {
    if (currentKey === "pet") return !!selectedPet;
    if (currentKey === "servicos") return selectedServices.length > 0;
    if (currentKey === "horario") return selectedDate && selectedTime;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const proName = selectedProfessional !== "any" ? professionals.find((p) => p.id === selectedProfessional)?.name : null;
    await base44.entities.Appointments.create({
      pet_id: selectedPet.id, pet_name: selectedPet.name, pet_breed: selectedPet.breed,
      pet_weight_kg: selectedPet.weight_kg, pet_behavior: selectedPet.behavior,
      pet_allergies: selectedPet.allergies_medical_info,
      owner_email: user.email, owner_name: user.full_name,
      service_ids: selectedServices.map((s) => s.id).join(","),
      service_names: selectedServices.map((s) => s.name).join(", "),
      professional_id: selectedProfessional !== "any" ? selectedProfessional : "",
      professional_name: proName || "",
      status: "pendente",
      scheduled_date: selectedDate.toISOString().split("T")[0],
      scheduled_time: selectedTime, scheduled_end_time: endTime,
      total_calculated_duration: duration, total_price: totalPrice,
      tosquia_corpo: groomingPrefs.corpo || "", tosquia_cabeca: groomingPrefs.cabeca || "",
      tosquia_rabo: groomingPrefs.rabo || "", perfume_preference: groomingPrefs.perfume || "",
      accessories: groomingPrefs.accessories || "", reference_photo_url: groomingPrefs.reference_photo_url || "",
    });
    navigate(createPageUrl("MyBookings"));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}
          className="p-2 rounded-xl bg-white border border-stone-200 hover:border-stone-300 shadow-sm transition-colors">
          <ArrowLeft className="w-4 h-4 text-stone-500" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-stone-900">Nova Marcação</h1>
          <p className="text-xs text-stone-400">{dynamicSteps[step]?.label} · Passo {step + 1} de {dynamicSteps.length}</p>
        </div>
      </div>

      {/* Step Bar */}
      <div className="flex items-center mb-8">
        {dynamicSteps.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isDone = i < step;
          return (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
                  ${isDone ? "bg-stone-950 text-white" : isActive ? "bg-violet-600 text-white ring-4 ring-violet-100" : "bg-stone-100 text-stone-400"}`}>
                  {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? "text-violet-600" : isDone ? "text-stone-700" : "text-stone-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < dynamicSteps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${i < step ? "bg-stone-950" : "bg-stone-200"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Content */}
      <div className="mb-36 lg:mb-24">

        {/* PET */}
        {currentKey === "pet" && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-stone-900">Qual é o pet?</h2>
              <p className="text-sm text-stone-400">Selecione o pet para esta sessão</p>
            </div>
            {pets.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
                <PawPrint className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                <p className="text-stone-500 font-medium mb-1">Nenhum pet registado</p>
                <p className="text-sm text-stone-400">Adicione um pet em "Meus Pets" primeiro.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} onSelect={(p) => { setSelectedPet(p); setTimeout(() => setStep(1), 150); }} selected={selectedPet?.id === pet.id} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SERVIÇOS */}
        {currentKey === "servicos" && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-stone-900">O que vai fazer?</h2>
              <p className="text-sm text-stone-400">Escolha os serviços para {selectedPet?.name}</p>
            </div>

            {baseServices.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Serviços Principais</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {baseServices.map((s) => (
                    <ServiceCard key={s.id} service={s} selected={selectedServices.some((sel) => sel.id === s.id)} onToggle={toggleService} />
                  ))}
                </div>
              </div>
            )}

            {addonServices.length > 0 && (
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Adicionais</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {addonServices.map((s) => (
                    <ServiceCard key={s.id} service={s} selected={selectedServices.some((sel) => sel.id === s.id)} onToggle={toggleService} />
                  ))}
                </div>
              </div>
            )}

            {selectedServices.length > 0 && (
              <div className="mt-6 p-4 bg-stone-950 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400">Selecionado</p>
                  <p className="text-sm font-semibold">{selectedServices.map(s => s.name).join(" + ")}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-400">Total</p>
                  <p className="text-xl font-bold">{totalPrice.toFixed(2)}€</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TOSQUIA */}
        {currentKey === "tosquia" && (
          <GroomingSelector
            preferences={groomingPrefs}
            onChange={setGroomingPrefs}
            hasAllergies={!!(selectedPet?.allergies_medical_info?.trim())}
            lastPreferences={lastGroomingPrefs}
          />
        )}

        {/* HORÁRIO */}
        {currentKey === "horario" && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-stone-900">Quando?</h2>
              <p className="text-sm text-stone-400">Escolha data e horário disponíveis</p>
            </div>

            {/* Duration info */}
            <div className="mb-6 p-4 bg-white border border-stone-200 rounded-2xl shadow-sm">
              <p className="text-[10px] text-violet-600 uppercase tracking-wider mb-3 font-bold">Duração Calculada</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Base dos serviços</span>
                  <span className="font-medium">{selectedServices.reduce((sum, s) => sum + (s.base_duration_minutes || 0), 0)} min</span>
                </div>
                {selectedPet?.weight_kg > 20 && (
                  <div className="flex justify-between text-sm text-stone-500">
                    <span>Porte ({selectedPet.weight_kg}kg)</span>
                    <span>+{selectedPet.weight_kg > 40 ? "45" : "30"} min</span>
                  </div>
                )}
                {(selectedPet?.behavior === "agressivo" || selectedPet?.behavior === "agitado") && (
                  <div className="flex justify-between text-sm text-amber-600">
                    <span>Atenção especial ({selectedPet.behavior})</span>
                    <span>+15 min</span>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-stone-100 flex justify-between font-bold text-stone-900">
                <span>Total alocado</span>
                <span className="text-violet-600">{duration} min</span>
              </div>
            </div>

            <TimeSlotPicker
              duration={duration}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateChange={setSelectedDate}
              onTimeChange={(t, et) => { setSelectedTime(t); setEndTime(et); }}
              selectedProfessional={selectedProfessional}
              onProfessionalChange={setSelectedProfessional}
            />
          </div>
        )}

        {/* RESUMO */}
        {currentKey === "resumo" && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-stone-900">Tudo certo?</h2>
              <p className="text-sm text-stone-400">Reveja os detalhes antes de enviar</p>
            </div>
            <BookingSummary
              pet={selectedPet}
              services={selectedServices}
              professional={selectedProfessional !== "any" ? professionals.find((p) => p.id === selectedProfessional)?.name : "Qualquer profissional"}
              date={selectedDate} time={selectedTime} endTime={endTime}
              duration={duration} totalPrice={totalPrice}
              groomingPrefs={hasTosquia ? groomingPrefs : null}
            />
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 lg:left-64 bg-white/95 backdrop-blur border-t border-stone-200 px-4 py-4 flex items-center justify-between">
        <Button variant="outline" onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}
          className="border-stone-200 text-stone-600 hover:bg-stone-50">
          <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
        </Button>

        {currentKey === "resumo" ? (
          <Button onClick={handleSubmit} disabled={submitting}
            className="bg-stone-950 hover:bg-stone-800 text-white px-8 pulse-accent">
            {submitting ? "A enviar..." : "Confirmar Pedido"}
            <Send className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={() => setStep(step + 1)} disabled={!canGoNext()}
            className="bg-violet-600 hover:bg-violet-700 text-white px-8 disabled:opacity-40">
            Próximo <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}