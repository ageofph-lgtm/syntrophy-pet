import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  CalendarDays, Clock, PawPrint, AlertTriangle,
  ChevronRight, TrendingUp, Euro, ClipboardList
} from "lucide-react";
import StatusBadge from "../components/shared/StatusBadge";
import PetAlertTags from "../components/shared/PetAlertTags";

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
    setStats({
      today: todayData.length,
      revenue: completedToday.reduce((s, a) => s + (a.total_price || 0), 0),
      completed: completedToday.length,
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-[#6B6B6B]">{format(new Date(), "EEEE, d 'de' MMMM", { locale: pt })}</p>
        </div>
        {pendingCount > 0 && (
          <Link to={createPageUrl("ShopOrders")}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium hover:bg-orange-500/20 transition-colors">
              <ClipboardList className="w-4 h-4" />
              {pendingCount} pedido{pendingCount > 1 ? "s" : ""} pendente{pendingCount > 1 ? "s" : ""}
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
            <CalendarDays className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold">{stats.today}</p>
          <p className="text-[11px] text-[#6B6B6B]">Hoje</p>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4">
          <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold">{stats.completed}</p>
          <p className="text-[11px] text-[#6B6B6B]">Concluídos</p>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center mb-3">
            <Euro className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-bold">{stats.revenue.toFixed(0)}€</p>
          <p className="text-[11px] text-[#6B6B6B]">Receita Hoje</p>
        </div>
      </div>

      {/* Today's Schedule */}
      <h2 className="text-base font-bold mb-4">Agenda do Dia</h2>
      {todayAppts.length === 0 ? (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 text-center">
          <CalendarDays className="w-8 h-8 text-[#6B6B6B] mx-auto mb-3" />
          <p className="text-sm text-[#6B6B6B]">Nenhum agendamento para hoje.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {todayAppts.map((appt) => (
            <Link
              key={appt.id}
              to={createPageUrl(`ShopAppointmentDetail?id=${appt.id}`)}
              className="block"
            >
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 hover:border-[#3A3A3A] transition-all duration-200 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Time Block */}
                    <div className="bg-[#161616] border border-[#2A2A2A] rounded-xl px-3 py-2 text-center flex-shrink-0 min-w-[70px]">
                      <p className="text-sm font-bold text-orange-500">{appt.scheduled_time}</p>
                      <p className="text-[9px] text-[#6B6B6B]">{appt.scheduled_end_time}</p>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <PawPrint className="w-3.5 h-3.5 text-orange-500/50" />
                        <h3 className="font-semibold text-sm">{appt.pet_name}</h3>
                        <span className="text-[10px] text-[#6B6B6B]">{appt.pet_breed} · {appt.pet_weight_kg}kg</span>
                      </div>
                      <p className="text-xs text-[#A0A0A0] mb-2">{appt.service_names}</p>
                      <PetAlertTags behavior={appt.pet_behavior} allergies={appt.pet_allergies} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={appt.status} />
                    <ChevronRight className="w-4 h-4 text-[#6B6B6B] group-hover:text-[#A0A0A0] transition-colors" />
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