import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Check, X, PawPrint, Clock, CalendarDays, ChevronRight, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import PetAlertTags from "../components/shared/PetAlertTags";
import EmptyState from "../components/shared/EmptyState";
import { SkeletonDashboardRow } from "../components/shared/SkeletonCard";

export default function ShopOrders() {
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [p, u] = await Promise.all([
      base44.entities.Appointments.filter({ status: "pendente" }, "-created_date"),
      base44.entities.User.list("-created_date", 200),
    ]);
    setPending(p);
    setUsers(u);
    setLoading(false);
  };

  const getNoShowCount = (email) => {
    const u = users.find(u => u.email?.toLowerCase() === email?.toLowerCase());
    return u?.no_show_count || 0;
  };

  const handleAccept = async (id) => {
    await base44.entities.Appointments.update(id, { status: "confirmado" });
    loadData();
  };

  const handleReject = async (id) => {
    await base44.entities.Appointments.update(id, { status: "cancelado" });
    loadData();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        <div className="bg-stone-200 animate-pulse rounded-lg h-7 w-48 mb-6" />
        <div className="space-y-3">
          <SkeletonDashboardRow /><SkeletonDashboardRow /><SkeletonDashboardRow />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <h1 className="text-xl font-bold text-stone-900 mb-6">Pedidos Pendentes</h1>

      {pending.length === 0 ? (
        <EmptyState icon={Check} title="Tudo tratado!" description="Não há pedidos pendentes de momento." />
      ) : (
        <div className="space-y-3">
          {pending.map((appt) => (
            <div key={appt.id} className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-stone-300 hover:shadow-sm transition-all shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <PawPrint className="w-4 h-4 text-orange-400" />
                    <h3 className="font-bold text-base text-stone-900">{appt.pet_name}</h3>
                    <span className="text-xs text-stone-400">{appt.pet_breed} · {appt.pet_weight_kg}kg</span>
                  </div>
                  <PetAlertTags behavior={appt.pet_behavior} allergies={appt.pet_allergies} />
                  <p className="text-sm text-stone-500 mt-2">{appt.service_names}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {appt.scheduled_date && format(new Date(appt.scheduled_date), "d MMM yyyy", { locale: pt })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {appt.scheduled_time} — {appt.scheduled_end_time}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Tutor: <span className="text-stone-600">{appt.owner_name}</span>
                  </p>
                  {appt.total_price > 0 && (
                    <p className="text-lg font-bold text-orange-500 mt-3">{appt.total_price.toFixed(2)}€</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button onClick={() => handleAccept(appt.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm">
                    <Check className="w-4 h-4 mr-1" /> Aceitar
                  </Button>
                  <Button variant="outline" onClick={() => handleReject(appt.id)} className="border-red-200 text-red-500 hover:bg-red-50 text-sm">
                    <X className="w-4 h-4 mr-1" /> Recusar
                  </Button>
                  <Link to={createPageUrl(`ShopAppointmentDetail?id=${appt.id}`)}>
                    <Button variant="ghost" size="sm" className="text-stone-400 hover:text-stone-600 text-xs w-full">
                      Detalhes <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}