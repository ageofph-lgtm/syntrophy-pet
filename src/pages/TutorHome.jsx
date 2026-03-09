import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, CalendarDays, ArrowRight, PawPrint, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import PetCard from "../components/tutor/PetCard";
import StatusBadge from "../components/shared/StatusBadge";
import EmptyState from "../components/shared/EmptyState";

export default function TutorHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const u = await base44.auth.me();
    setUser(u);
    const [p, a] = await Promise.all([
      base44.entities.Pets.filter({ owner_email: u.email }, "-created_date", 10),
      base44.entities.Appointments.filter({ owner_email: u.email, status: { $ne: "cancelado" } }, "-scheduled_date", 5),
    ]);
    setPets(p);
    setAppointments(a);
    setLoading(false);
    // Redirect new tutors to onboarding if no phone and no pets
    if (!u.phone && p.length === 0 && u.role !== "admin") {
      navigate(createPageUrl("Onboarding"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const vaccineWarnings = pets.filter((p) =>
    p.rabies_vaccine_expiry &&
    new Date(p.rabies_vaccine_expiry) < new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header Boutique */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Olá, <span className="text-[#F5F5F5]">{user?.full_name?.split(" ")[0]}</span>
          </h1>
          <p className="text-sm text-[#A0A0A0] mt-1 font-light">O ecossistema de bem-estar do seu pet.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.1)]">
          <span className="text-orange-500 font-serif text-xl italic">φ</span>
        </div>
      </div>

      {/* Vaccine Alerts */}
      {vaccineWarnings.length > 0 && (
        <div className="space-y-2">
          {vaccineWarnings.map((pet) => (
            <div
              key={pet.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-400">
                <strong>{pet.name}</strong> — Vacina da raiva a vencer em{" "}
                {format(new Date(pet.rabies_vaccine_expiry), "d MMM yyyy", { locale: pt })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* CTA Premium */}
      <Link to={createPageUrl("NewBooking")}>
        <div className="relative overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 cursor-pointer hover:border-orange-500/50 transition-all duration-500 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-orange-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-lg font-bold mb-1 text-[#F5F5F5]">Agendar Sessão</h2>
              <p className="text-xs text-[#A0A0A0]">Nutrição estética e cuidado clínico.</p>
            </div>
            <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300">
              <Plus className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>

      {/* My Pets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">Meus Pets</h2>
          <Link to={createPageUrl("MyPets")} className="text-xs text-orange-500 hover:text-orange-400 flex items-center gap-1">
            Ver todos <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {pets.length === 0 ? (
          <EmptyState
            icon={PawPrint}
            title="Nenhum pet registado"
            description="Adicione o seu primeiro pet para começar a agendar serviços."
            action={
              <Link to={createPageUrl("MyPets")}>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Pet
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {pets.slice(0, 4).map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">Próximas Marcações</h2>
          <Link to={createPageUrl("MyBookings")} className="text-xs text-orange-500 hover:text-orange-400 flex items-center gap-1">
            Ver todas <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {appointments.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Sem marcações"
            description="Agende o próximo tratamento do seu pet."
          />
        ) : (
          <div className="space-y-2">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 hover:border-[#3A3A3A] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <PawPrint className="w-4 h-4 text-orange-500/60" />
                    <span className="font-semibold text-sm">{appt.pet_name}</span>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
                <p className="text-xs text-[#A0A0A0] mb-1">{appt.service_names}</p>
                <div className="flex items-center gap-2 text-[11px] text-[#6B6B6B]">
                  <CalendarDays className="w-3 h-3" />
                  {appt.scheduled_date && format(new Date(appt.scheduled_date), "d MMM", { locale: pt })} · {appt.scheduled_time}
                  {appt.professional_name && ` · ${appt.professional_name}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}