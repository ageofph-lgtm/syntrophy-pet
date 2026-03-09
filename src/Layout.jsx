import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  Home, CalendarDays, PawPrint, ClipboardList,
  LogOut, Menu, X, Settings, ChevronRight, Store, User
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const u = await base44.auth.me();
      setUser(u);
    } catch (e) {
      // not logged in
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-[#A0A0A0] text-sm">A carregar...</span>
        </div>
      </div>
    );
  }

  const isLojista = user?.role === "admin";
  const navItems = isLojista ? LOJISTA_NAV : TUTOR_NAV;

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F5F5]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#161616]/95 backdrop-blur-md border-b border-[#2A2A2A] px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-1">
          <Menu className="w-5 h-5 text-[#A0A0A0]" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-bold text-lg">φ</span>
          <span className="font-semibold text-sm tracking-wide">Syntrophy</span>
        </div>
        <div className="w-7" />
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50
        w-64 bg-[#161616] border-r border-[#2A2A2A]
        transform transition-transform duration-300 ease-out
        lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <span className="text-orange-500 font-bold text-xl">φ</span>
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wide">Syntrophy</h1>
                <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest">
                  {isLojista ? "Loja" : "Pet Care"}
                </p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
              <X className="w-4 h-4 text-[#6B6B6B]" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? "bg-orange-500/10 text-orange-500"
                      : "text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]"
                    }
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* User Footer */}
          {user && (
            <div className="px-4 py-4 border-t border-[#2A2A2A]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <span className="text-orange-500 text-xs font-bold">
                    {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{user.full_name}</p>
                  <p className="text-[10px] text-[#6B6B6B] truncate">{user.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-[#6B6B6B] hover:text-red-400 hover:bg-red-500/10 text-xs"
                onClick={() => base44.auth.logout()}
              >
                <LogOut className="w-3 h-3 mr-2" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}