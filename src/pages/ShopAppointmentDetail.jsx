import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  ArrowLeft, PawPrint, Weight, Phone, Mail,
  Clock, CalendarDays, User, Scissors,
  CheckCircle, Play, Image
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import StatusBadge from "../components/shared/StatusBadge";
import PetAlertTags from "../components/shared/PetAlertTags";

// ── Substitua pelo URL do Make.com após criar o Webhook ──────────────
const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/ulab2o1mqjqbhp649irvtrriwz92s3ru";

async function triggerWhatsAppNotification(appointment, eventType) {
  if (MAKE_WEBHOOK_URL.includes("SEU_URL_AQUI")) return; // URL não configurado ainda
  const payload = {
    event: eventType,
    appointment_id: appointment.id,
    client: { name: appointment.owner_name, phone: appointment.owner_phone },
    pet:    { name: appointment.pet_name,   breed: appointment.pet_breed },
    service:{ name: appointment.service_names, time: appointment.scheduled_time, date: appointment.scheduled_date },
  };
  await fetch(MAKE_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export default function ShopAppointmentDetail() {
  const navigate = useNavigate();
  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const apptId = urlParams.get("id");

  useEffect(() => { if (apptId) loadData(); }, [apptId]);

  const loadData = async () => {
    const appointments = await base44.entities.Appointments.filter({ id: apptId });
    if (appointments.length > 0) setAppt(appointments[0]);
    setLoading(false);
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    await base44.entities.Appointments.update(apptId, { status: newStatus });

    // Disparar notificação WhatsApp nos eventos relevantes
    if (newStatus === "confirmado") {
      await triggerWhatsAppNotification(appt, "appointment_confirmed");
      toast.success("Pedido confirmado — cliente notificado!");
    } else if (newStatus === "pronto") {
      await triggerWhatsAppNotification(appt, "service_ready");
      toast.success("Cliente notificado para recolha!");
    }

    await loadData();
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!appt) {
    return <div className="text-center py-20"><p className="text-stone-400">Marcação não encontrada.</p></div>;
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white border border-stone-200 hover:border-stone-300 shadow-sm transition-colors">
          <ArrowLeft className="w-4 h-4 text-stone-500" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-stone-900">Ficha de Atendimento</h1>
          <p className="text-xs text-stone-400">#{apptId?.slice(0, 8)}</p>
        </div>
        <StatusBadge status={appt.status} />
      </div>

      <div className="space-y-4">
        {/* Pet Info */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center flex-shrink-0">
              <PawPrint className="w-7 h-7 text-orange-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-stone-900">{appt.pet_name}</h2>
              <p className="text-xs text-stone-400">{appt.pet_breed}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-xs text-stone-500">
                  <Weight className="w-3 h-3" /> {appt.pet_weight_kg}kg
                </span>
              </div>
              <div className="mt-2"><PetAlertTags behavior={appt.pet_behavior} allergies={appt.pet_allergies} /></div>
              {appt.pet_allergies && (
                <div className="mt-3 px-3 py-2 rounded-lg bg-orange-50 border border-orange-200">
                  <p className="text-[10px] text-orange-600 font-semibold uppercase tracking-wider mb-1">Alergias</p>
                  <p className="text-xs text-stone-600">{appt.pet_allergies}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Schedule & Price */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
            <CalendarDays className="w-4 h-4 text-blue-500 mb-2" />
            <p className="text-xs text-stone-400 mb-1">Data e Hora</p>
            <p className="text-sm font-semibold text-stone-900">
              {appt.scheduled_date && format(new Date(appt.scheduled_date), "d MMM yyyy", { locale: pt })}
            </p>
            <p className="text-xs text-stone-500">{appt.scheduled_time} — {appt.scheduled_end_time}</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
            <Clock className="w-4 h-4 text-violet-500 mb-2" />
            <p className="text-xs text-stone-400 mb-1">Duração / Preço</p>
            <p className="text-sm font-semibold text-stone-900">{appt.total_calculated_duration} min</p>
            <p className="text-sm font-bold text-orange-500">{appt.total_price?.toFixed(2)}€</p>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <Scissors className="w-4 h-4 text-violet-500 mb-2" />
          <p className="text-xs text-stone-400 mb-2">Serviços</p>
          <p className="text-sm font-medium text-stone-900">{appt.service_names}</p>
          {appt.professional_name && (
            <div className="flex items-center gap-1 mt-2 text-xs text-stone-500">
              <User className="w-3 h-3" /> {appt.professional_name}
            </div>
          )}
        </div>

        {/* Grooming Prefs */}
        {appt.tosquia_corpo && (
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Preferências de Tosquia</h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div><p className="text-[10px] text-stone-400 mb-0.5">Corpo</p><p className="font-medium text-stone-800">{appt.tosquia_corpo}</p></div>
              <div><p className="text-[10px] text-stone-400 mb-0.5">Cabeça</p><p className="font-medium text-stone-800">{appt.tosquia_cabeca}</p></div>
              <div><p className="text-[10px] text-stone-400 mb-0.5">Rabo</p><p className="font-medium text-stone-800">{appt.tosquia_rabo}</p></div>
            </div>
            {appt.perfume_preference && <p className="text-xs mt-2"><span className="text-stone-400">Perfume:</span> <span className="text-stone-700">{appt.perfume_preference}</span></p>}
            {appt.accessories && <p className="text-xs mt-1"><span className="text-stone-400">Acessório:</span> <span className="text-stone-700">{appt.accessories}</span></p>}
          </div>
        )}

        {/* Reference Photo */}
        {appt.reference_photo_url && (
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Image className="w-4 h-4 text-pink-500" />
              <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Foto de Referência</h3>
            </div>
            <img src={appt.reference_photo_url} alt="Referência" className="w-full max-w-sm rounded-xl border border-stone-200" />
          </div>
        )}

        {/* Tutor Info */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Tutor</h3>
          <div className="space-y-2">
            <p className="text-sm font-medium text-stone-900">{appt.owner_name}</p>
            <div className="flex items-center gap-2 text-xs text-stone-500"><Mail className="w-3 h-3" /> {appt.owner_email}</div>
            {appt.owner_phone && <div className="flex items-center gap-2 text-xs text-stone-500"><Phone className="w-3 h-3" /> {appt.owner_phone}</div>}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 space-y-3">
          {appt.status === "pendente" && (
            <div className="flex gap-3">
              <Button onClick={() => updateStatus("confirmado")} disabled={updating} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                <CheckCircle className="w-4 h-4 mr-2" /> Aceitar Pedido
              </Button>
              <Button variant="outline" onClick={() => updateStatus("cancelado")} disabled={updating} className="border-red-200 text-red-500 hover:bg-red-50">
                Recusar
              </Button>
            </div>
          )}
          {appt.status === "confirmado" && (
            <Button onClick={() => updateStatus("em_andamento")} disabled={updating} className="w-full bg-blue-500 hover:bg-blue-600 text-white h-14 text-base">
              <Play className="w-5 h-5 mr-2" /> Iniciar Serviço
            </Button>
          )}
          {appt.status === "em_andamento" && (
            <Button onClick={() => updateStatus("pronto")} disabled={updating} className="w-full bg-orange-500 hover:bg-orange-600 text-white h-16 text-lg font-bold pulse-orange">
              <CheckCircle className="w-6 h-6 mr-2" /> Finalizar e Avisar Tutor
            </Button>
          )}
          {appt.status === "pronto" && (
            <Button onClick={() => updateStatus("concluido")} disabled={updating} className="w-full bg-stone-100 border border-stone-200 hover:bg-stone-200 text-stone-600 h-12">
              <CheckCircle className="w-4 h-4 mr-2" /> Marcar como Concluído
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}