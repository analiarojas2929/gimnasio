import { useState } from "react";
import { ArrowLeft, ArrowRight, Dumbbell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell, DemoNotice } from "./Login.jsx";
import { authService } from "../services/authService.js";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      setError("Ingresa tu nombre (al menos 2 caracteres).");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Ingresa un correo electrónico válido.");
    } else if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
    } else if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
    } else {
      await authService.register({ name: form.name.trim(), email: form.email.trim() });
      navigate("/dashboard", { replace: true });
    }
  }

  return (
    <AuthShell>
      <Link to="/" className="mb-7 inline-flex items-center gap-2 text-sm text-white/55 hover:text-neon">
        <ArrowLeft size={16} aria-hidden="true" /> Volver al sitio
      </Link>
      <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-neon/10 text-neon">
        <Dumbbell size={21} aria-hidden="true" />
      </span>
      <p className="eyebrow">Comienza hoy</p>
      <h1 className="display-font mt-3 text-3xl font-bold tracking-tight">Crea tu cuenta demo.</h1>
      <p className="mt-2 text-sm leading-6 text-white/50">Guarda tu perfil de prueba en este navegador.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4">
        <AuthField label="Nombre" name="name" autoComplete="name" value={form.name} onChange={update} />
        <AuthField label="Correo electrónico" name="email" type="email" autoComplete="email" value={form.email} onChange={update} />
        <AuthField label="Contraseña" name="password" type="password" autoComplete="new-password" value={form.password} onChange={update} hint="No se guardará en el navegador." />
        <AuthField label="Repite la contraseña" name="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={update} />
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <button type="submit" className="button-primary w-full">
          Crear cuenta demo <ArrowRight size={16} aria-hidden="true" />
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-white/50">
        ¿Ya tienes una cuenta? <Link to="/login" className="font-semibold text-neon hover:text-white">Inicia sesión</Link>
      </p>
      <DemoNotice />
    </AuthShell>
  );
}

function AuthField({ label, name, type = "text", autoComplete, value, onChange, hint }) {
  const id = `register-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-white/80">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white"
      />
      {hint && <p className="mt-1 text-xs text-white/35">{hint}</p>}
    </div>
  );
}
