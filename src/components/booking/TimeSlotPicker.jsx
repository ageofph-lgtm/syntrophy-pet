import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { pt } from "date-fns/locale";
import { Clock, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function generateTimeSlots(workStart, workEnd, durationMinutes, bookedSlots) {
  const slots = [];
  const [startH, startM] = (workStart || "09:00").split(":").map(Number);
  const [endH, endM] = (workEnd || "18:00").split(":").map(Number);
  const startTotal = startH * 60 + startM;
  const endTotal = endH * 60 + endM;

  for (let t = startTotal; t + durationMinutes <= endTotal; t += 30) {
    const h = Math.floor(t / 60);
    const m = t % 60;
    const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const endT = t + durationMinutes;
    const endHr = Math.floor(endT / 60);
    const endMin = endT % 60;
    const endTimeStr = `${String(endHr).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;

    const isBlocked = bookedSlots.some((booked) => {
      const [bsH, bsM] = booked.start.split(":").map(Number);
      const [beH, beM] = booked.end.split(":").map(Number);
      const bs = bsH * 60 + bsM;
      const be = beH * 60 + beM;
      return t < be && endT > bs;
    });

    if (!isBlocked) {
      slots.push({ time: timeStr, endTime: endTimeStr });
    }
  }
  return slots;
}

export default function TimeSlotPicker({ duration, selectedDate, selectedTime, onDateChange, onTimeChange, selectedProfessional, onProfessionalChange }) {
  const [professionals, setProfessionals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    base44.entities.Professionals.list().then(setProfessionals);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    base44.entities.Appointments.filter(
      { scheduled_date: dateStr, status: { $ne: "cancelado" } }
    ).then(setAppointments);
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedDate || !duration) return;

    const bookedSlots = appointments
      .filter((a) =>
        !selectedProfessional || selectedProfessional === "any" || a.professional_id === selectedProfessional
      )
      .map((a) => ({ start: a.scheduled_time, end: a.scheduled_end_time }))
      .filter((s) => s.start && s.end);

    const pro = selectedProfessional && selectedProfessional !== "any"
      ? professionals.find((p) => p.id === selectedProfessional)
      : null;

    const generated = generateTimeSlots(
      pro?.work_start || "09:00",
      pro?.work_end || "18:00",
      duration,
      bookedSlots
    );
    setSlots(generated);
  }, [selectedDate, duration, appointments, selectedProfessional, professionals]);

  return (
    <div className="space-y-6">
      {/* Professional Selector */}
      <div>
        <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Profissional</h4>
        <Select value={selectedProfessional || "any"} onValueChange={onProfessionalChange}>
          <SelectTrigger className="bg-white border-stone-200 text-stone-800">
            <SelectValue placeholder="Qualquer profissional" />
          </SelectTrigger>
          <SelectContent className="bg-white border-stone-200">
            <SelectItem value="any" className="text-stone-500">Qualquer profissional</SelectItem>
            {professionals.filter((p) => p.is_active).map((p) => (
              <SelectItem key={p.id} value={p.id} className="text-stone-800">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  {p.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Calendar */}
      <div>
        <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Data</h4>
        <div className="bg-white border border-stone-200 rounded-2xl p-3 inline-block shadow-sm">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            disabled={(date) => date > addDays(new Date(), 60)}
            locale={pt}
            className="text-stone-900"
          />
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
            Horários Disponíveis — {format(selectedDate, "d MMM", { locale: pt })}
          </h4>
          {slots.length === 0 ? (
            <p className="text-xs text-stone-400 bg-stone-50 border border-stone-200 rounded-xl p-4 text-center">
              Nenhum horário disponível para esta data e duração ({duration} min).
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => onTimeChange(slot.time, slot.endTime)}
                  className={`
                    p-2.5 rounded-xl border text-center transition-all duration-200
                    ${selectedTime === slot.time
                      ? "border-orange-400 bg-orange-50 text-orange-600 shadow-sm"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                    }
                  `}
                >
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-medium">{slot.time}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}