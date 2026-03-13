import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns";
import { pt } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Euro, TrendingUp, Users } from "lucide-react";
import { SkeletonStatCard } from "../components/shared/SkeletonCard";

export default function ShopCommissions() {
  const [referenceDate, setReferenceDate] = useState(new Date());

  const monthStart = format(startOfMonth(referenceDate), "yyyy-MM-dd");
  const monthEnd   = format(endOfMonth(referenceDate),   "yyyy-MM-dd");
  const monthLabel = format(referenceDate, "MMMM yyyy", { locale: pt });

  const { data: professionals = [] } = useQuery({
    queryKey: ["professionals"],
    queryFn: () => base44.entities.Professionals.list(),
  });

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments-month", monthStart, monthEnd],
    queryFn: () => base44.entities.Appointments.filter(
      { scheduled_date: { $gte: monthStart, $lte: monthEnd }, status: { $in: ["concluido", "pronto"] } },
      "professional_name"
    ),
  });

  // Group by professional
  const proMap = {};
  for (const pro of professionals) {
    proMap[pro.name] = { ...pro, appointments: [], revenue: 0, commission: 0 };
  }
  // Catch appointments with professional not in map (deleted)
  for (const appt of appointments) {
    const key = appt.professional_name || "Sem profissional";
    if (!proMap[key]) proMap[key] = { name: key, commission_rate: 10, appointments: [], revenue: 0, commission: 0 };
    proMap[key].appointments.push(appt);
    proMap[key].revenue += appt.total_price || 0;
    proMap[key].commission += (appt.total_price || 0) * ((proMap[key].commission_rate || 10) / 100);
  }

  const rows = Object.values(proMap).filter((p) => p.appointments.length > 0);
  const totalRevenue   = rows.reduce((s, r) => s + r.revenue, 0);
  const totalCommission = rows.reduce((s, r) => s + r.commission, 0);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-stone-900">Comissões</h1>
        <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-sm">
          <button onClick={() => setReferenceDate(subMonths(referenceDate, 1))} className="p-1 hover:bg-stone-100 rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4 text-stone-500" />
          </button>
          <span className="text-sm font-medium text-stone-700 capitalize min-w-[130px] text-center">{monthLabel}</span>
          <button onClick={() => setReferenceDate(addMonths(referenceDate, 1))} className="p-1 hover:bg-stone-100 rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4 text-stone-500" />
          </button>
        </div>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-stone-900">{appointments.length}</p>
            <p className="text-[11px] text-stone-400">Serviços Pagos</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
              <Euro className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-stone-900">{totalRevenue.toFixed(0)}€</p>
            <p className="text-[11px] text-stone-400">Receita Total</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-3">
              <TrendingUp className="w-4 h-4 text-violet-600" />
            </div>
            <p className="text-2xl font-bold text-stone-900">{totalCommission.toFixed(0)}€</p>
            <p className="text-[11px] text-stone-400">Total Comissões</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100">
          <h2 className="text-sm font-semibold text-stone-900">Detalhe por Profissional</h2>
        </div>
        {isLoading ? (
          <div className="p-5 space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-stone-100 rounded-lg animate-pulse" />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center">
            <TrendingUp className="w-8 h-8 text-stone-200 mx-auto mb-3" />
            <p className="text-sm text-stone-400">Sem serviços concluídos em {monthLabel}.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {/* Header row */}
            <div className="grid grid-cols-5 gap-4 px-5 py-2 bg-stone-50">
              <span className="text-[10px] font-semibold text-stone-400 uppercase col-span-2">Profissional</span>
              <span className="text-[10px] font-semibold text-stone-400 uppercase text-center">Serviços</span>
              <span className="text-[10px] font-semibold text-stone-400 uppercase text-right">Receita</span>
              <span className="text-[10px] font-semibold text-stone-400 uppercase text-right">Comissão</span>
            </div>
            {rows.map((row) => (
              <div key={row.name} className="grid grid-cols-5 gap-4 px-5 py-4 items-center hover:bg-stone-50 transition-colors">
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-stone-900">{row.name}</p>
                  <p className="text-[10px] text-stone-400">{row.commission_rate || 10}% comissão</p>
                </div>
                <p className="text-sm text-stone-600 text-center">{row.appointments.length}</p>
                <p className="text-sm font-medium text-stone-900 text-right">{row.revenue.toFixed(2)}€</p>
                <p className="text-sm font-bold text-violet-600 text-right">{row.commission.toFixed(2)}€</p>
              </div>
            ))}
            {/* Total row */}
            <div className="grid grid-cols-5 gap-4 px-5 py-4 bg-stone-50 border-t border-stone-200">
              <div className="col-span-2">
                <p className="text-sm font-bold text-stone-900">Total</p>
              </div>
              <p className="text-sm font-bold text-stone-900 text-center">{appointments.length}</p>
              <p className="text-sm font-bold text-stone-900 text-right">{totalRevenue.toFixed(2)}€</p>
              <p className="text-sm font-bold text-violet-600 text-right">{totalCommission.toFixed(2)}€</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}