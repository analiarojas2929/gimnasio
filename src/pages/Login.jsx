import { useState } from "react";
import { ArrowLeft, ArrowRight, Dumbbell, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService.js";

export default function Login() {
  const [email, setEmail] = useState("fitzone.demo@demo.cl");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Ingresa tu correo y contraseña para continuar.");
      return;
    }
    await authService.signIn({ email: email.trim() });
    navigate("/dashboard", { replace: true });
  }

  async function enterDemo() {
    await authService.signIn({ email: "fitzone.demo@demo.cl", name: "Alex Demo" });
    navigate("/dashboard", { replace: true });
  }

  return (
    <AuthShell>
      <Link to="/" className="mb-9 inline-flex items-center gap-2 text-sm text-white/55 hover:text-neon">
        <ArrowLeft size={16} aria-hidden="true" /> Volver al sitio
      </Link>
      <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-neon/10 text-neon">
        <Dumbbell size={23} aria-hidden="true" />
      </span>
      <p className="eyebrow">Tu espacio personal</p>
      <h1 className="display-font mt-3 text-3xl font-bold tracking-tight">Qué bueno verte.</h1>
      <p className="mt-2 text-sm leading-6 text-white/50">
        Ingresa a tu portal FitZone para seguir tu actividad.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-white/80">
            Correo electrónico
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            className="h-12 w-full rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-white/80">
            Contraseña <span className="text-xs font-normal text-white/35">(solo visual en esta demo)</span>
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              className="h-12 w-full rounded-lg border border-white/10 bg-[#111111] px-3 pr-12 text-sm text-white"
            />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-white/45 hover:text-white"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <button type="submit" className="button-primary w-full">
          Iniciar sesión <ArrowRight size={16} aria-hidden="true" />
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-white/35">
        <span className="h-px flex-1 bg-white/10" /> O prueba el portal <span className="h-px flex-1 bg-white/10" />
      </div>
      <button
        type="button"
        onClick={enterDemo}
        className="min-h-12 w-full rounded-lg border border-white/15 text-sm font-semibold text-white/80 transition-colors hover:border-neon hover:text-neon"
      >
        Entrar como usuario demo
      </button>
      <p className="mt-6 text-center text-sm text-white/50">
        ¿Primera vez aquí?{" "}
        <Link to="/registro" className="font-semibold text-neon hover:text-white">Crea tu cuenta demo</Link>
      </p>
      <DemoNotice />
    </AuthShell>
  );
}

export function AuthShell({ children }) {
  return (
    <main className="grid min-h-screen bg-ink lg:grid-cols-[1fr_0.85fr]">
      <div className="relative hidden min-h-screen overflow-hidden bg-[#101010] lg:block">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=85"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          onError={(event) => { event.currentTarget.style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/20" />
        <Link to="/" className="display-font absolute left-10 top-9 z-10 flex items-center gap-2 text-lg font-extrabold">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-neon text-ink">F</span>
          FitZone <span className="text-neon">Gym</span>
        </Link>
        <div className="absolute bottom-14 left-10 z-10 max-w-xl">
          <p className="eyebrow">Muévete a tu manera</p>
          <p className="display-font mt-5 text-5xl font-bold leading-tight tracking-tight">
            Cada día es una nueva oportunidad para avanzar.
          </p>
          <p className="mt-4 text-white/55">Un portal de prueba para acompañarte en tu camino.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </main>
  );
}

export function DemoNotice() {
  return (
    <p className="mt-8 rounded-lg border border-neon/15 bg-neon/[0.05] p-3 text-xs leading-5 text-white/50">
      <span className="font-semibold text-neon">Prototipo de demostración:</span>{" "}
      no hay autenticación segura ni backend. No uses contraseñas reales ni información sensible.
    </p>
  );
}
