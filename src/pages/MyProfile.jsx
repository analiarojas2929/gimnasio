import { useEffect, useState } from "react";
import { CheckCircle2, UserRound } from "lucide-react";
import { demoProfile } from "../data/mockRoutines.js";
import useLocalStorage from "../hooks/useLocalStorage.js";
import { authService } from "../services/authService.js";

export default function MyProfile() {
  const [profile, setProfile] = useLocalStorage("fitzone-demo-profile", demoProfile);
  const [form, setForm] = useState(profile);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
    setSaved(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const height = form.height === "" ? "" : Number(form.height);
    if (form.name.trim().length < 2) {
      setError("Ingresa tu nombre (al menos 2 caracteres).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }
    if (height !== "" && (!Number.isFinite(height) || height < 50 || height > 250)) {
      setError("La estatura debe estar entre 50 y 250 cm, o dejarse vacía.");
      return;
    }
    if (form.photoUrl && !isValidUrl(form.photoUrl)) {
      setError("Ingresa una URL válida para la foto o deja el campo vacío.");
      return;
    }
    const updated = { ...form, name: form.name.trim(), email: form.email.trim(), height };
    setProfile(updated);
    await authService.updateProfile(updated);
    setForm(updated);
    setSaved(true);
  }

  return (
    <div className="space-y-7">
      <section>
        <p className="eyebrow">Información personal</p>
        <h1 className="display-font mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Mi perfil</h1>
        <p className="mt-2 text-sm text-white/50">Edita los datos de tu perfil de demostración.</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[0.65fr_1.35fr]">
        <section className="h-fit rounded-xl border border-white/[0.08] bg-card p-6 text-center">
          <ProfileAvatar name={form.name} photoUrl={form.photoUrl} />
          <h2 className="mt-4 font-semibold">{form.name || "Tu nombre"}</h2>
          <p className="mt-1 text-sm text-white/45">{form.email || "tu@correo.cl"}</p>
          <span className="mt-4 inline-flex rounded-full border border-neon/20 bg-neon/[0.06] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-neon">
            Perfil de demostración
          </span>
        </section>

        <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-white/[0.08] bg-card p-5 sm:p-7">
          <h2 className="font-semibold">Datos del perfil</h2>
          <p className="mt-1 text-xs text-white/45">Los cambios se guardan en localStorage de este navegador.</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <ProfileField id="profile-name" name="name" label="Nombre" value={form.name} onChange={update} autoComplete="name" />
            <ProfileField id="profile-email" name="email" label="Correo electrónico" type="email" value={form.email} onChange={update} autoComplete="email" />
            <ProfileField id="profile-height" name="height" label="Estatura (cm)" type="number" value={form.height} onChange={update} placeholder="Opcional" min="50" max="250" />
            <div>
              <label htmlFor="profile-photo" className="mb-2 block text-sm font-medium text-white/75">Foto de perfil <span className="text-white/35">(opcional)</span></label>
              <input id="profile-photo" name="photoUrl" type="url" value={form.photoUrl} onChange={update} placeholder="https://..." className="h-11 w-full rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white placeholder:text-white/30" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="profile-goal" className="mb-2 block text-sm font-medium text-white/75">Objetivo personal <span className="text-white/35">(opcional)</span></label>
              <textarea id="profile-goal" name="goal" rows="3" maxLength="500" value={form.goal} onChange={update} placeholder="¿Qué te gustaría conseguir con tu entrenamiento?" className="w-full resize-y rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 text-sm text-white placeholder:text-white/30" />
            </div>
          </div>

          {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
          {saved && <p role="status" className="mt-4 flex items-center gap-2 text-sm text-neon"><CheckCircle2 size={17} aria-hidden="true" /> Cambios guardados en esta demo.</p>}
          <button type="submit" className="button-primary mt-6">Guardar cambios</button>
        </form>
      </div>
      <p className="text-xs leading-5 text-white/35">Tu objetivo es personal y opcional. Esta página no genera recomendaciones de salud ni cálculos automáticos.</p>
    </div>
  );
}

function ProfileAvatar({ name, photoUrl }) {
  const [imageError, setImageError] = useState(false);
  useEffect(() => setImageError(false), [photoUrl]);
  return (
    <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-neon/20 bg-neon/10 text-neon">
      {photoUrl && !imageError ? (
        <img src={photoUrl} alt={`Foto de perfil de ${name || "usuario"}`} className="h-full w-full object-cover" onError={() => setImageError(true)} />
      ) : name ? (
        <span className="display-font text-3xl font-bold">{name.slice(0, 1).toUpperCase()}</span>
      ) : (
        <UserRound size={30} aria-hidden="true" />
      )}
    </div>
  );
}

function ProfileField({ id, name, label, type = "text", value, onChange, autoComplete, placeholder, min, max }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-white/75">{label}</label>
      <input id={id} name={name} type={type} value={value ?? ""} onChange={onChange} autoComplete={autoComplete} placeholder={placeholder} min={min} max={max} className="h-11 w-full rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white placeholder:text-white/30" />
    </div>
  );
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
