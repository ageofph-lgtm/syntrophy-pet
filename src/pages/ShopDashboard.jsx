import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarDays, PawPrint, ChevronRight, TrendingUp, Euro, ClipboardList } from "lucide-react";
import StatusBadge from "../components/shared/StatusBadge";
import PetAlertTags from "../components/shared/PetAlertTags";
import { SkeletonStatCard, SkeletonDashboardRow } from "../components/shared/SkeletonCard";

export default function ShopDashboard() {
  const [todayAppts, setTodayAppts] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [stats, setStats] = useState({ today: 0, revenue: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const [todayData, allToday, pending] = await Promise.all([
      base44.entities.Appointments.filter({ scheduled_date: today, status: { $ne: "cancelado" } }, "scheduled_time"),
      base44.entities.Appointments.filter({ scheduled_date: today }),
      base44.entities.Appointments.filter({ status: "pendente" }),
    ]);
    setTodayAppts(todayData);
    setPendingCount(pending.length);
    const completedToday = allToday.filter((a) => a.status === "concluido" || a.status === "pronto");
    setStats({ today: todayData.length, revenue: completedToday.reduce((s, a) => s + (a.total_price || 0), 0), completed: completedToday.length });
    setLoading(false);
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="bg-stone-200 animate-pulse rounded-lg h-7 w-32" />
          <div className="bg-stone-200 animate-pulse rounded-lg h-4 w-48" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        <SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard />
      </div>
      <div className="space-y-2">
        <SkeletonDashboardRow /><SkeletonDashboardRow /><SkeletonDashboardRow />
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
          <p className="text-sm text-stone-400">{format(new Date(), "EEEE, d 'de' MMMM", { locale: pt })}</p>
        </div>
        {pendingCount > 0 && (
          <Link to={createPageUrl("ShopOrders")}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-950 text-white text-sm font-medium hover:bg-stone-800 transition-colors">
              <ClipboardList className="w-4 h-4" />
              {pendingCount} pedido{pendingCount > 1 ? "s" : ""} pendente{pendingCount > 1 ? "s" : ""}
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
            <CalendarDays className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-stone-900">{stats.today}</p>
          <p className="text-[11px] text-stone-400">Hoje</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-stone-900">{stats.completed}</p>
          <p className="text-[11px] text-stone-400">Concluídos</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-3">
            <Euro className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-2xl font-bold text-stone-900">{stats.revenue.toFixed(0)}€</p>
          <p className="text-[11px] text-stone-400">Receita Hoje</p>
        </div>
      </div>

      <h2 className="text-base font-bold text-stone-800 mb-4">Agenda do Dia</h2>
      {todayAppts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center shadow-sm">
          <CalendarDays className="w-8 h-8 text-stone-300 mx-auto mb-3" />
          <p className="text-sm text-stone-400">Nenhum agendamento para hoje.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {todayAppts.map((appt) => (
            <Link key={appt.id} to={createPageUrl(`ShopAppointmentDetail?id=${appt.id}`)} className="block">
              <div className={`bg-white border rounded-2xl p-4 hover:shadow-md transition-all duration-200 group shadow-sm
                ${appt.pet_behavior === "agressivo" ? "border-l-4 border-l-red-400 border-stone-200" : "border-stone-200 hover:border-stone-300"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="bg-violet-50 border border-violet-100 rounded-xl px-3 py-2 text-center flex-shrink-0 min-w-[70px]">
                      <p className="text-sm font-bold text-violet-700">{appt.scheduled_time}</p>
                      <p className="text-[9px] text-stone-400">{appt.scheduled_end_time}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <PawPrint className="w-3.5 h-3.5 text-stone-400" />
                        <h3 className="font-semibold text-sm text-stone-900">{appt.pet_name}</h3>
                        <span className="text-[10px] text-stone-400">{appt.pet_breed} · {appt.pet_weight_kg}kg</span>
                      </div>
                      <p className="text-xs text-stone-500 mb-2">{appt.service_names}</p>
                      <PetAlertTags behavior={appt.pet_behavior} allergies={appt.pet_allergies} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={appt.status} />
                    <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}