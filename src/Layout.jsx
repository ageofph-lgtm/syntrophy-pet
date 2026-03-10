import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Home, CalendarDays, PawPrint, ClipboardList, LogOut, Menu, X, Settings, ChevronRight, Store, User } from "lucide-react";

const TUTOR_NAV = [
  { name: "Início", page: "TutorHome", icon: Home },
  { name: "Meus Pets", page: "MyPets", icon: PawPrint },
  { name: "Marcações", page: "MyBookings", icon: CalendarDays },
];

const LOJISTA_NAV = [
  { name: "Dashboard", page: "ShopDashboard", icon: Home },
  { name: "Pedidos", page: "ShopOrders", icon: ClipboardList },
  { name: "Agenda", page: "ShopAgenda", icon: CalendarDays },
  { name: "Definições", page: "ShopSettings", icon: Settings },
];

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUser(); }, []);

  const loadUser = async () => {
    try {
      const u = await base44.auth.me();
      setUser(u || null);
    } catch (e) {
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-stone-400 text-sm">A carregar...</span>
        </div>
      </div>
    );
  }

  const isLojista = user?.role === "admin";
  const navItems = isLojista ? LOJISTA_NAV : TUTOR_NAV;

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-stone-900">

      {/* ── MOBILE HEADER ───────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onPointerDown={() => setSidebarOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-xl active:bg-stone-100"
            style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
          >
            <Menu className="w-6 h-6 text-stone-600" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center border border-violet-100">
              <span className="text-violet-600 font-bold text-base">φ</span>
            </div>
            <span className="font-semibold text-sm tracking-wide text-stone-800">Syntrophy</span>
          </div>

          {/* Avatar placeholder for symmetry */}
          <div className="w-10 h-10 rounded-full bg-stone-950 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{user?.full_name?.charAt(0)?.toUpperCase() || "U"}</span>
          </div>
        </div>
      </header>

      {/* ── OVERLAY ─────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onPointerDown={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ─────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-72 lg:w-64 bg-white border-r border-stone-200 transform transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="px-6 py-6 flex items-center justify-between border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center border border-violet-100">
                <span className="text-violet-600 font-bold text-xl">φ</span>
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wide text-stone-900">Syntrophy</h1>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">{isLojista ? "Loja" : "Pet Care"}</p>
              </div>
            </div>
            <button
              onPointerDown={() => setSidebarOpen(false)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl active:bg-stone-100"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <X className="w-5 h-5 text-stone-400" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? "bg-violet-50 text-violet-700 border border-violet-100"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-50 active:bg-stone-100"
                    }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.name}
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto text-violet-400" />}
                </Link>
              );
            })}
          </nav>

          {/* User Footer */}
          {user && (
            <div className="px-4 py-4 border-t border-stone-100 space-y-2">
              <div className="flex items-center gap-3 px-1 py-1">
                <div className="w-9 h-9 rounded-full bg-stone-950 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{user.full_name?.charAt(0)?.toUpperCase() || "U"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800 truncate">{user.full_name}</p>
                  <p className="text-xs text-stone-400 truncate">{isLojista ? "Lojista" : "Tutor"}</p>
                </div>
              </div>

              {user.role === "admin" && (
                <Link
                  to={createPageUrl(isLojista ? "TutorHome" : "ShopDashboard")}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-stone-200 hover:border-violet-200 hover:bg-violet-50 transition-all text-xs text-stone-500 hover:text-violet-600"
                >
                  {isLojista ? <User className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                  {isLojista ? "Ver como Tutor" : "Ir para Loja"}
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 transition-all text-sm"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── BOTTOM NAV (mobile only) ─────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-stone-200">
        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all
                  ${isActive ? "text-violet-600" : "text-stone-400"}`}
                style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── MAIN CONTENT ────────────────────────────── */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 pb-24 lg:pb-0">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}