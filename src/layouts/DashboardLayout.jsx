import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import Sidebar from "../components/dashboard/Sidebar.jsx";
import { authService } from "../services/authService.js";

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  async function handleSignOut() {
    await authService.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-ink lg:flex">
      {menuOpen && (
        <button
          type="button"
          aria-label="Cerrar navegación"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}
      <Sidebar
        open={menuOpen}
        user={user}
        onClose={() => setMenuOpen(false)}
        onSignOut={handleSignOut}
      />
      <div className="min-w-0 flex-1">
        <DashboardHeader user={user} onMenuClick={() => setMenuOpen(true)} />
        <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-7 sm:py-8 lg:px-9">
          <div className="mb-5 rounded-lg border border-neon/15 bg-neon/[0.05] px-4 py-3 text-xs leading-5 text-white/65">
            <span className="font-semibold text-neon">Modo demostración:</span>{" "}
            datos de ejemplo guardados localmente en este navegador. No hay
            servidor ni autenticación segura; no uses información sensible.
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
