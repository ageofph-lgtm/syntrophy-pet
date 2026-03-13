import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Gift } from "lucide-react";

const BANHOS_PER_REWARD = 10;

export default function LoyaltyCard({ ownerEmail }) {
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["loyalty-banhos", ownerEmail],
    queryFn: () => base44.entities.Appointments.filter(
      { owner_email: ownerEmail, status: "concluido" },
      "-scheduled_date",
      200
    ),
    enabled: !!ownerEmail,
  });

  const banhoCount = appointments.filter((a) =>
    a.service_names?.toLowerCase().includes("banho")
  ).length;

  if (isLoading || banhoCount === 0) return null;

  const progress = banhoCount % BANHOS_PER_REWARD;
  const rewards = Math.floor(banhoCount / BANHOS_PER_REWARD);
  const remaining = BANHOS_PER_REWARD - progress;
  const isFreeReady = progress === 0 && banhoCount > 0;

  return (
    <div className={`rounded-2xl p-5 border shadow-sm ${
      isFreeReady
        ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
        : "bg-white border-stone-200"
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isFreeReady ? "bg-amber-100" : "bg-violet-50"
          }`}>
            <Gift className={`w-4 h-4 ${isFreeReady ? "text-amber-500" : "text-violet-500"}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900">Programa Fidelização</p>
            <p className="text-[11px] text-stone-400">
              {isFreeReady
                ? `🎉 ${rewards} benefício${rewards > 1 ? "s" : ""} ganho${rewards > 1 ? "s" : ""}!`
                : `${banhoCount} banho${banhoCount > 1 ? "s" : ""} concluído${banhoCount > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        {!isFreeReady && (
          <span className="text-xs font-bold text-violet-600">{progress}/{BANHOS_PER_REWARD}</span>
        )}
      </div>

      {isFreeReady ? (
        <div className="px-3 py-2 rounded-xl bg-amber-100 border border-amber-200">
          <p className="text-xs font-semibold text-amber-700 text-center">
            🎁 Tens direito a um benefício especial no próximo banho!
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-1 mb-2">
            {Array.from({ length: BANHOS_PER_REWARD }).map((_, i) => (
              <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                i < progress ? "bg-violet-500" : "bg-stone-100 border border-stone-200"
              }`} />
            ))}
          </div>
          {remaining <= 2 && (
            <p className="text-[11px] text-violet-600 font-medium text-center mt-1">
              ✨ Falta{remaining === 1 ? "" : "m"} só {remaining} banho{remaining > 1 ? "s" : ""} para o teu benefício!
            </p>
          )}
        </>
      )}
    </div>
  );
}