import { Bell, Menu } from "lucide-react";

export default function DashboardHeader({ user, onMenuClick }) {
  return (
    <header className="flex min-h-[76px] items-center justify-between border-b border-white/[0.08] px-4 sm:px-7">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir navegación"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/80 lg:hidden"
        >
          <Menu size={19} aria-hidden="true" />
        </button>
        <div>
          <p className="hidden text-xs text-white/45 sm:block">Portal de usuario</p>
          <p className="text-sm font-semibold">Tu espacio FitZone</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-right sm:block">
          <span className="block text-sm font-medium">{user?.name || "Usuario demo"}</span>
          <span className="block text-xs text-white/45">Cuenta de demostración</span>
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neon/15 font-bold text-neon">
          {(user?.name || "U").slice(0, 1).toUpperCase()}
        </span>
        <Bell size={18} className="ml-1 text-white/45" aria-hidden="true" />
      </div>
    </header>
  );
}
