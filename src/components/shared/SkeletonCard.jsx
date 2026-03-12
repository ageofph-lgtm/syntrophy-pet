import React from "react";

const Pulse = ({ className }) => (
  <div className={`bg-stone-200 animate-pulse rounded-lg ${className}`} />
);

export function SkeletonPetCard() {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Pulse className="w-12 h-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Pulse className="h-4 w-28" />
          <Pulse className="h-3 w-20" />
          <Pulse className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonAppointmentRow() {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pulse className="w-4 h-4 rounded-full" />
          <Pulse className="h-4 w-32" />
        </div>
        <Pulse className="h-5 w-20 rounded-full" />
      </div>
      <Pulse className="h-3 w-48" />
      <Pulse className="h-3 w-36" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
      <Pulse className="w-8 h-8 rounded-xl mb-3" />
      <Pulse className="h-7 w-14 mb-2" />
      <Pulse className="h-3 w-20" />
    </div>
  );
}

export function SkeletonDashboardRow() {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Pulse className="w-16 h-14 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Pulse className="h-4 w-36" />
          <Pulse className="h-3 w-52" />
          <Pulse className="h-3 w-24" />
        </div>
        <Pulse className="h-6 w-20 rounded-full flex-shrink-0" />
      </div>
    </div>
  );
}