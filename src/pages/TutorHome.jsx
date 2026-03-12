import React, { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, CalendarDays, ArrowRight, PawPrint, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PetCard from "../components/tutor/PetCard";
import StatusBadge from "../components/shared/StatusBadge";
import EmptyState from "../components/shared/EmptyState";
import LiveTrackingCard from "../components/tutor/LiveTrackingCard";
import { SkeletonPetCard, SkeletonAppointmentRow } from "../components/shared/SkeletonCard";

export default function TutorHome() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── Dados base ────────────────────────────────────────────
  const { data: user, isSuccess: userSuccess } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: pets = [], isLoading: petsLoading, isSuccess: petsSuccess } = useQuery({
    queryKey: ["pets", user?.email],
    queryFn: () => base44.entities.Pets.filter({ owner_email: user.email }, "-created_date", 10),
    enabled: !!user?.email,
  });

  const { data: appointments = [], isLoading: apptLoading } = useQuery({
    queryKey: ["appointments-home", user?.email],
    queryFn: () => base44.entities.Appointments.filter(
      { owner_email: user.email, status: { $ne: "cancelado" } },
      "-scheduled_date",
      10
    ),
    enabled: !!user?.email,
    // Polling de fallback a cada 30s
    refetchInterval: 30_000,
  });

  // ── Subscription em tempo real ────────────────────────────
  useEffect(() => {
    if (!user?.email) return;
    const unsubscribe = base44.entities.Appointments.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["appointments-home", user.email] });
    });
    return () => unsubscribe();
  }, [user?.email, queryClient]);

  // ── Redirect onboarding ───────────────────────────────────
  useEffect(() => {
    if (userSuccess && petsSuccess && user && !user.phone && pets.length === 0 && user.role !== "admin") {
      navigate(createPageUrl("Onboarding"));
    }
  }, [userSuccess, petsSuccess, user, pets]);

  // ── Derivações ────────────────────────────────────────────
  const vaccineWarnings = pets.filter((p) =>
    p.rabies_vaccine_expiry && new Date(p.rabies_vaccine_expiry) < new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  );

  // Marcação mais recente que está ativa (qualquer data)
  const liveAppointment = appointments.find(
    (a) => ["confirmado", "em_andamento", "pronto", "concluido"].includes(a.status)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Olá, {user?.full_name?.split(" ")[0] || "..."} 👋
          </h1>
          <p className="text-sm text-stone-400 mt-1">O ecossistema de bem-estar do seu pet.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center">
          <span className="text-violet-600 font-serif text-xl italic font-bold">φ</span>
        </div>
      </div>

      {/* Vaccine Alerts */}
      {vaccineWarnings.length > 0 && (
        <div className="space-y-2">
          {vaccineWarnings.map((pet) => (
            <div key={pet.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600">
                <strong>{pet.name}</strong> — Vacina da raiva a vencer em{" "}
                {format(new Date(pet.rabies_vaccine_expiry), "d MMM yyyy", { locale: pt })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Live Tracking */}
      {!apptLoading && liveAppointment && (
        <LiveTrackingCard appointment={liveAppointment} />
      )}

      {/* CTA */}
      <Link to={createPageUrl("NewBooking")}>
        <div className="relative overflow-hidden bg-stone-950 rounded-2xl p-6 cursor-pointer group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-violet-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-lg font-bold mb-1 text-white">Agendar Sessão</h2>
              <p className="text-xs text-stone-400">Banho · Tosquia · Spa · e mais</p>
            </div>
            <div className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-500 transition-all duration-300 shadow-lg">
              <Plus className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>

      {/* My Pets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-stone-900">Meus Pets</h2>
          <Link to={createPageUrl("MyPets")} className="text-xs text-violet-600 hover:text-violet-700 flex items-center gap-1 font-medium">
            Ver todos <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {petsLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <SkeletonPetCard /><SkeletonPetCard />
          </div>
        ) : pets.length === 0 ? (
          <EmptyState icon={PawPrint} title="Nenhum pet registado" description="Adicione o seu primeiro pet para começar a agendar serviços."
            action={
              <Link to={createPageUrl("MyPets")}>
                <Button className="bg-stone-950 hover:bg-stone-800 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Pet
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {pets.slice(0, 4).map((pet) => <PetCard key={pet.id} pet={pet} />)}
          </div>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-stone-900">Próximas Marcações</h2>
          <Link to={createPageUrl("MyBookings")} className="text-xs text-violet-600 hover:text-violet-700 flex items-center gap-1 font-medium">
            Ver todas <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {apptLoading ? (
          <div className="space-y-2">
            <SkeletonAppointmentRow /><SkeletonAppointmentRow />
          </div>
        ) : appointments.length === 0 ? (
          <EmptyState icon={CalendarDays} title="Sem marcações" description="Agende o próximo tratamento do seu pet." />
        ) : (
          <div className="space-y-2">
            {appointments.map((appt) => (
              <div key={appt.id} className="bg-white border border-stone-200 rounded-xl p-4 hover:border-stone-300 hover:shadow-sm transition-all shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <PawPrint className="w-4 h-4 text-violet-500" />
                    <span className="font-semibold text-sm text-stone-900">{appt.pet_name}</span>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
                <p className="text-xs text-stone-500 mb-1">{appt.service_names}</p>
                <div className="flex items-center gap-2 text-[11px] text-stone-400">
                  <CalendarDays className="w-3 h-3" />
                  {appt.scheduled_date && format(new Date(appt.scheduled_date + "T00:00:00"), "d MMM", { locale: pt })} · {appt.scheduled_time}
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