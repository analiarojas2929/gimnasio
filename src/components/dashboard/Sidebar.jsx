import {
  CalendarDays,
  ChartNoAxesCombined,
  Dumbbell,
  LogOut,
  Scale,
  UserRound,
  X,
  LayoutDashboard,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Inicio", to: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "Mis rutinas", to: "/dashboard/rutinas", icon: Dumbbell },
  { label: "Mi peso", to: "/dashboard/peso", icon: Scale },
  { label: "Mi progreso", to: "/dashboard/progreso", icon: ChartNoAxesCombined },
  { label: "Calendario", to: "/dashboard/calendario", icon: CalendarDays },
  { label: "Mi perfil", to: "/dashboard/perfil", icon: UserRound },
];

export default function Sidebar({ open, user, onClose, onSignOut }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/[0.08] bg-[#101010] px-4 py-5 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-2">
        <a href="/" className="display-font flex items-center gap-2 font-extrabold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-neon text-sm text-ink">F</span>
          <span>FitZone <span className="text-neon">Gym</span></span>
        </a>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          className="flex h-9 w-9 items-center justify-center rounded text-white/60 lg:hidden"
        >
          <X size={19} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-10 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/35">
        Mi espacio
      </div>
      <nav aria-label="Menú del usuario" className="mt-3 flex flex-1 flex-col gap-1">
        {navItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
                isActive
                  ? "bg-neon/10 font-semibold text-neon"
                  : "text-white/60 hover:bg-white/[0.05] hover:text-white"
              }`
            }
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/[0.08] pt-4">
        <div className="mb-4 flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neon/15 text-sm font-bold text-neon">
            {(user?.name || "U").slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{user?.name || "Usuario demo"}</span>
            <span className="block truncate text-xs text-white/40">Cuenta demo</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-white/55 transition-colors hover:bg-white/[0.05] hover:text-red-300"
        >
          <LogOut size={17} aria-hidden="true" /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
