import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CalendarDays, PawPrint, Star, Clock, Plus } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StatusBadge from "../components/shared/StatusBadge";
import EmptyState from "../components/shared/EmptyState";
import { SkeletonAppointmentRow } from "../components/shared/SkeletonCard";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function MyBookings() {
  const queryClient = useQueryClient();
  const [ratingModal, setRatingModal] = useState(null);
  const [rating, setRating] = useState(0);

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments", user?.email],
    queryFn: () => base44.entities.Appointments.filter({ owner_email: user.email }, "-scheduled_date"),
    enabled: !!user?.email,
  });

  const ratingMutation = useMutation({
    mutationFn: ({ id, value }) => base44.entities.Appointments.update(id, { rating: value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setRatingModal(null);
      setRating(0);
    },
  });

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-stone-900">As Minhas Marcações</h1>
        <Link to={createPageUrl("NewBooking")}>
          <Button className="bg-stone-950 hover:bg-stone-800 text-white text-sm">
            <Plus className="w-4 h-4 mr-1" /> Nova
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <SkeletonAppointmentRow key={i} />)}
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Sem marcações" description="Ainda não agendou nenhum serviço." />
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div key={appt.id} className="bg-white border border-stone-200 rounded-2xl p-4 hover:border-stone-300 hover:shadow-sm transition-all shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                    <PawPrint className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-stone-900">{appt.pet_name}</h3>
                    <p className="text-[11px] text-stone-400">{appt.pet_breed}</p>
                  </div>
                </div>
                <StatusBadge status={appt.status} />
              </div>
              <p className="text-xs text-stone-500 mb-2">{appt.service_names}</p>
              <div className="flex items-center gap-4 text-[11px] text-stone-400">
                <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{appt.scheduled_date && format(new Date(appt.scheduled_date), "d MMM yyyy", { locale: pt })}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{appt.scheduled_time} — {appt.scheduled_end_time}</span>
              </div>
              {appt.professional_name && <p className="text-[11px] text-stone-400 mt-1">Profissional: {appt.professional_name}</p>}
              {appt.total_price > 0 && <p className="text-sm font-bold text-stone-900 mt-2">{appt.total_price.toFixed(2)}€</p>}
              {(appt.status === "pronto" || appt.status === "concluido") && !appt.rating && (
                <Button variant="outline" size="sm" className="mt-3 border-violet-200 text-violet-600 hover:bg-violet-50 text-xs"
                  onClick={() => { setRatingModal(appt); setRating(0); }}>
                  <Star className="w-3 h-3 mr-1" /> Avaliar
                </Button>
              )}
              {appt.rating && (
                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= appt.rating ? "text-amber-400 fill-amber-400" : "text-stone-200"}`} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!ratingModal} onOpenChange={() => setRatingModal(null)}>
        <DialogContent className="bg-white border-stone-200 text-stone-900 max-w-xs">
          <DialogHeader><DialogTitle className="text-center text-stone-900">Avaliar Serviço</DialogTitle></DialogHeader>
          <div className="text-center py-4">
            <p className="text-sm text-stone-500 mb-4">Como foi a experiência do <strong>{ratingModal?.pet_name}</strong>?</p>
            <div className="flex justify-center gap-2 mb-6">
              {[1,2,3,4,5].map((s) => (
                <button key={s} onClick={() => setRating(s)} className="p-1 transition-transform hover:scale-110">
                  <Star className={`w-8 h-8 ${s <= rating ? "text-amber-400 fill-amber-400" : "text-stone-200"}`} />
                </button>
              ))}
            </div>
            <Button
              onClick={() => ratingMutation.mutate({ id: ratingModal.id, value: rating })}
              disabled={rating === 0 || ratingMutation.isPending}
              className="bg-stone-950 hover:bg-stone-800 text-white w-full"
            >
              {ratingMutation.isPending ? "A enviar..." : "Enviar Avaliação"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}