import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const INSTANCE_ID = Deno.env.get("GREEN_API_INSTANCE_ID");
const API_TOKEN   = Deno.env.get("GREEN_API_TOKEN");

function buildMessage(eventType, data) {
  const { ownerName, petName, petBreed, date, time } = data;

  if (eventType === "appointment_confirmed") {
    return `Olá ${ownerName}! 🐾\n\nA marcação do *${petName}* (${petBreed}) foi *confirmada* para o dia *${date}* às *${time}*.\n\nAté já! 💜 — Syntrophy Pet`;
  }
  if (eventType === "service_ready") {
    return `Olá ${ownerName}! 🐾\n\nO *${petName}* está pronto e à espera de si! 🎀\n\nPode vir buscar quando quiser.\n\nObrigado! 💜 — Syntrophy Pet`;
  }
  return null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { chatId, eventType, ownerName, petName, petBreed, date, time } = await req.json();

    if (!chatId || !eventType) {
      return Response.json({ error: "chatId e eventType são obrigatórios" }, { status: 400 });
    }

    const message = buildMessage(eventType, { ownerName, petName, petBreed, date, time });
    if (!message) {
      return Response.json({ error: "Tipo de evento desconhecido" }, { status: 400 });
    }

    const url = `https://api.green-api.com/waInstance${INSTANCE_ID}/sendMessage/${API_TOKEN}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, message }),
    });

    const result = await res.json();

    if (!res.ok) {
      return Response.json({ error: "Green-API error", details: result }, { status: 500 });
    }

    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});