import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, ArrowRight, Check, PawPrint } from "lucide-react";
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
    setPets(p);
    setServices(s);
    setProfessionals(pr);
    const lastAppt = await base44.entities.Appointments.filter({ owner_email: u.email }, "-created_date", 1);
    if (lastAppt.length > 0 && lastAppt[0].tosquia_corpo) {
      setLastGroomingPrefs({
        corpo: lastAppt[0].tosquia_corpo,
        cabeca: lastAppt[0].tosquia_cabeca,
        rabo: lastAppt[0].tosquia_rabo,
        accessories: lastAppt[0].accessories,
        perfume: lastAppt[0].perfume_preference,
        reference_photo_url: lastAppt[0].reference_photo_url,
      });
    }
    setLoading(false);
  };

  const hasTosquia = selectedServices.some((s) => s.category === "tosquia");
  const duration = calculateDuration(selectedServices, selectedPet);
  const totalPrice = calculatePrice(selectedServices);
  const baseServices = services.filter((s) => !s.is_addon);
  const addonServices = services.filter((s) => s.is_addon);

  const toggleService = (service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      return exists ? prev.filter((s) => s.id !== service.id) : [...prev, service];
    });
  };

  const getSteps = () => {
    const steps = ["Pet", "Serviços"];
    if (hasTosquia) steps.push("Tosquia");
    steps.push("Horário", "Resumo");
    return steps;
  };

  const steps = getSteps();

  const canGoNext = () => {
    if (step === 0) return !!selectedPet;
    if (step === 1) return selectedServices.length > 0;
    if (steps[step] === "Horário") return selectedDate && selectedTime;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const proName = selectedProfessional !== "any"
      ? professionals.find((p) => p.id === selectedProfessional)?.name
      : null;

    await base44.entities.Appointments.create({
      pet_id: selectedPet.id,
      pet_name: selectedPet.name,
      pet_breed: selectedPet.breed,
      pet_weight_kg: selectedPet.weight_kg,
      pet_behavior: selectedPet.behavior,
      pet_allergies: selectedPet.allergies_medical_info,
      owner_email: user.email,
      owner_name: user.full_name,
      service_ids: selectedServices.map((s) => s.id).join(","),
      service_names: selectedServices.map((s) => s.name).join(", "),
      professional_id: selectedProfessional !== "any" ? selectedProfessional : "",
      professional_name: proName || "",
      status: "pendente",
      scheduled_date: selectedDate.toISOString().split("T")[0],
      scheduled_time: selectedTime,
      scheduled_end_time: endTime,
      total_calculated_duration: duration,
      total_price: totalPrice,
      tosquia_corpo: groomingPrefs.corpo || "",
      tosquia_cabeca: groomingPrefs.cabeca || "",
      tosquia_rabo: groomingPrefs.rabo || "",
      perfume_preference: groomingPrefs.perfume || "",
      accessories: groomingPrefs.accessories || "",
      reference_photo_url: groomingPrefs.reference_photo_url || "",
    });
    navigate(createPageUrl("MyBookings"));
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
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white border border-stone-200 hover:border-stone-300 shadow-sm transition-colors">
          <ArrowLeft className="w-4 h-4 text-stone-500" />
        </button>
        <h1 className="text-xl font-bold text-stone-900">Nova Marcação</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
              ${i < step ? "bg-orange-500 text-white" : i === step ? "bg-orange-100 text-orange-600 ring-2 ring-orange-400" : "bg-stone-100 text-stone-400"}`}>
              {i < step ? <Check className="w-3 h-3" /> : i + 1}
            </div>
            <span className={`text-xs whitespace-nowrap ${i === step ? "text-stone-900 font-medium" : "text-stone-400"}`}>{s}</span>
            {i < steps.length - 1 && <div className="w-6 h-px bg-stone-200 flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {/* Pet */}
        {step === 0 && (
          <div>
            <h2 className="text-base font-semibold text-stone-800 mb-4">Selecione o Pet</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} onSelect={setSelectedPet} selected={selectedPet?.id === pet.id} />
              ))}
            </div>
            {pets.length === 0 && (
              <div className="text-center py-10">
                <PawPrint className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-sm text-stone-400">Precisa de adicionar um pet primeiro.</p>
              </div>
            )}
          </div>
        )}

        {/* Services */}
        {step === 1 && (
          <div>
            <h2 className="text-base font-semibold text-stone-800 mb-1">Serviços</h2>
            <p className="text-xs text-stone-400 mb-4">Selecione um ou mais serviços</p>
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Serviços Base</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
              {baseServices.map((s) => (
                <ServiceCard key={s.id} service={s} selected={selectedServices.some((sel) => sel.id === s.id)} onToggle={toggleService} />
              ))}
            </div>
            {addonServices.length > 0 && (
              <>
                <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Adicionais</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {addonServices.map((s) => (
                    <ServiceCard key={s.id} service={s} selected={selectedServices.some((sel) => sel.id === s.id)} onToggle={toggleService} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Grooming */}
        {steps[step] === "Tosquia" && (
          <GroomingSelector
            preferences={groomingPrefs}
            onChange={setGroomingPrefs}
            hasAllergies={!!(selectedPet?.allergies_medical_info?.trim())}
            lastPreferences={lastGroomingPrefs}
          />
        )}

        {/* Time Slot */}
        {steps[step] === "Horário" && (
          <div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Sintrofia da Agenda</h2>
            <div className="mb-6 p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
              <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-3 font-semibold">Cálculo de Duração Inteligente</p>
              <ul className="space-y-1.5 mb-3">
                <li className="flex justify-between text-sm text-stone-700">
                  <span>Tempo Base dos Serviços</span>
                  <span className="font-medium">{selectedServices.reduce((sum, s) => sum + (s.base_duration_minutes || 0), 0)} min</span>
                </li>
                {selectedPet?.weight_kg > 20 && (
                  <li className="flex justify-between text-sm text-orange-500">
                    <span>Ajuste de Porte ({selectedPet.weight_kg}kg)</span>
                    <span>+{selectedPet.weight_kg > 40 ? "45" : "30"} min</span>
                  </li>
                )}
                {(selectedPet?.behavior === "agressivo" || selectedPet?.behavior === "agitado") && (
                  <li className="flex justify-between text-sm text-amber-500">
                    <span>Atenção Especial ({selectedPet.behavior})</span>
                    <span>+15 min</span>
                  </li>
                )}
              </ul>
              <div className="pt-2 border-t border-stone-100 flex justify-between font-bold text-orange-500">
                <span>Tempo Total Alocado</span>
                <span>{duration} min</span>
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

        {/* Summary */}
        {steps[step] === "Resumo" && (
          <BookingSummary
            pet={selectedPet}
            services={selectedServices}
            professional={selectedProfessional !== "any" ? professionals.find((p) => p.id === selectedProfessional)?.name : "Qualquer profissional"}
            date={selectedDate}
            time={selectedTime}
            endTime={endTime}
            duration={duration}
            totalPrice={totalPrice}
            groomingPrefs={hasTosquia ? groomingPrefs : null}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between sticky bottom-0 bg-[#F7F5F2] py-4 border-t border-stone-200 -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0} className="border-stone-200 text-stone-600 hover:bg-stone-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        {steps[step] === "Resumo" ? (
          <Button onClick={handleSubmit} disabled={submitting} className="bg-orange-500 hover:bg-orange-600 text-white pulse-orange">
            {submitting ? "A enviar..." : "Confirmar Pedido"}
            <Check className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={() => setStep(step + 1)} disabled={!canGoNext()} className="bg-orange-500 hover:bg-orange-600 text-white">
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}