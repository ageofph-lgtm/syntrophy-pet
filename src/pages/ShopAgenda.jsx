import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format, addDays, subDays } from "date-fns";
import { pt } from "date-fns/locale";
import { ChevronLeft, ChevronRight, PawPrint, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "../components/shared/StatusBadge";
import PetAlertTags from "../components/shared/PetAlertTags";
import EmptyState from "../components/shared/EmptyState";

export default function ShopAgenda() {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [date]);

  const loadData = async () => {
    setLoading(true);
    const dateStr = format(date, "yyyy-MM-dd");
    const a = await base44.entities.Appointments.filter(
      { scheduled_date: dateStr, status: { $ne: "cancelado" } },
      "scheduled_time"
    );
    setAppointments(a);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <h1 className="text-xl font-bold mb-6">Agenda</h1>

      {/* Date Navigator */}
      <div className="flex items-center justify-between bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-4 py-3 mb-6">
        <button onClick={() => setDate(subDays(date, 1))} className="p-1.5 rounded-lg hover:bg-[#222222] transition-colors">
          <ChevronLeft className="w-4 h-4 text-[#A0A0A0]" />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold">{format(date, "EEEE", { locale: pt })}</p>
          <p className="text-xs text-[#6B6B6B]">{format(date, "d 'de' MMMM, yyyy", { locale: pt })}</p>
        </div>
        <button onClick={() => setDate(addDays(date, 1))} className="p-1.5 rounded-lg hover:bg-[#222222] transition-colors">
          <ChevronRight className="w-4 h-4 text-[#A0A0A0]" />
        </button>
      </div>

      {/* Quick date buttons */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[-1, 0, 1, 2, 3, 4, 5, 6].map((offset) => {
          const d = addDays(new Date(), offset);
          const isSelected = format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
          return (
            <button
              key={offset}
              onClick={() => setDate(d)}
              className={`
                flex-shrink-0 px-3 py-2 rounded-xl border text-center transition-all min-w-[60px]
                ${isSelected
                  ? "border-orange-500 bg-orange-500/10 text-orange-400"
                  : "border-[#2A2A2A] bg-[#1A1A1A] text-[#6B6B6B] hover:border-[#3A3A3A]"
                }
              `}
            >
              <p className="text-[10px]">{format(d, "EEE", { locale: pt })}</p>
              <p className="text-sm font-bold">{format(d, "d")}</p>
            </button>
          );
        })}
      </div>

      {/* Appointments */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Dia livre"
          description="Sem agendamentos para esta data."
        />
      ) : (
        <div className="space-y-2">
          {appointments.map((appt) => (
            <Link key={appt.id} to={createPageUrl(`ShopAppointmentDetail?id=${appt.id}`)}>
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 hover:border-[#3A3A3A] transition-colors flex items-center gap-3">
                <div className="bg-[#161616] border border-[#2A2A2A] rounded-xl px-3 py-2 text-center flex-shrink-0 min-w-[65px]">
                  <p className="text-sm font-bold text-orange-500">{appt.scheduled_time}</p>
                  <p className="text-[9px] text-[#6B6B6B]">{appt.total_calculated_duration}min</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <PawPrint className="w-3 h-3 text-orange-500/50" />
                    <span className="font-semibold text-sm truncate">{appt.pet_name}</span>
                    <span className="text-[10px] text-[#6B6B6B]">{appt.pet_breed}</span>
                  </div>
                  <p className="text-xs text-[#A0A0A0] truncate">{appt.service_names}</p>
                  <div className="mt-1">
                    <PetAlertTags behavior={appt.pet_behavior} allergies={appt.pet_allergies} />
                  </div>
                </div>
                <StatusBadge status={appt.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}