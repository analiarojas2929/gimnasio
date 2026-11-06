import { useEffect, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  plan: "",
  message: "",
};

export default function Contact({ selectedPlan }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedPlan) {
      setForm((current) => ({ ...current, plan: selectedPlan }));
    }
  }, [selectedPlan]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = form.phone.replace(/\D/g, "");

    if (form.name.trim().length < 2) {
      nextErrors.name = "Ingresa tu nombre (al menos 2 caracteres).";
    }
    if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = "Ingresa un correo electrónico válido.";
    }
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      nextErrors.phone = "Ingresa un teléfono válido (entre 8 y 15 dígitos).";
    }
    if (!form.plan) {
      nextErrors.plan = "Selecciona un plan de interés.";
    }
    if (form.message.trim().length < 10) {
      nextErrors.message = "Cuéntanos un poco más (al menos 10 caracteres).";
    }

    setErrors(nextErrors);
    setSubmitted(Object.keys(nextErrors).length === 0);
  }

  return (
    <section id="contacto" className="section-anchor py-24 sm:py-32">
      <div className="section-wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <span className="eyebrow">Hablemos</span>
          <h2 className="display-font mt-5 text-4xl font-bold leading-tight tracking-[-0.045em] sm:text-5xl">
            Tu próximo paso
            <br />
            <span className="text-neon">empieza aquí.</span>
          </h2>
          <p className="mt-5 max-w-[410px] text-sm leading-7 text-white/55">
            Déjanos tus datos y cuéntanos qué estás buscando. Te orientamos
            para que encuentres la opción que mejor se adapte a ti.
          </p>
          <div className="mt-8 rounded border border-white/10 bg-card p-5">
            <p className="text-sm font-semibold">¿Tienes una meta en mente?</p>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Cuéntanos un poco de ti y empecemos a darle forma juntos.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded border border-white/10 bg-card p-5 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Nombre"
              name="name"
              value={form.name}
              onChange={updateField}
              error={errors.name}
              autoComplete="name"
              placeholder="Tu nombre"
            />
            <Field
              label="Correo electrónico"
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              error={errors.email}
              autoComplete="email"
              placeholder="nombre@correo.cl"
            />
            <Field
              label="Teléfono"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={updateField}
              error={errors.phone}
              autoComplete="tel"
              placeholder="+56 9 1234 5678"
            />
            <div>
              <label
                htmlFor="plan"
                className="mb-2 block text-sm font-medium text-white/80"
              >
                Plan de interés
              </label>
              <select
                id="plan"
                name="plan"
                value={form.plan}
                onChange={updateField}
                aria-invalid={Boolean(errors.plan)}
                aria-describedby={errors.plan ? "plan-error" : undefined}
                className="min-h-12 w-full rounded border border-white/15 bg-[#101010] px-3 text-sm text-white focus:border-neon"
              >
                <option value="">Selecciona un plan</option>
                <option value="Básico">Básico</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
              </select>
              {errors.plan && (
                <p id="plan-error" className="mt-1.5 text-xs text-red-300">
                  {errors.plan}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-white/80"
              >
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={form.message}
                onChange={updateField}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? "message-error" : "message-hint"
                }
                placeholder="Cuéntanos qué te gustaría lograr..."
                className="w-full resize-y rounded border border-white/15 bg-[#101010] px-3 py-3 text-sm text-white placeholder:text-white/30 focus:border-neon"
              />
              {errors.message ? (
                <p id="message-error" className="mt-1.5 text-xs text-red-300">
                  {errors.message}
                </p>
              ) : (
                <p id="message-hint" className="mt-1.5 text-xs text-white/35">
                  Mínimo 10 caracteres.
                </p>
              )}
            </div>
          </div>

          <button type="submit" className="button-primary mt-6 w-full sm:w-auto">
            Enviar consulta <Send size={15} aria-hidden="true" />
          </button>

          {submitted && (
            <p
              role="status"
              className="mt-5 flex items-start gap-2 text-sm leading-6 text-neon"
            >
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />
              Datos validados correctamente. Esta es una confirmación local:
              tu consulta no se envió a ningún servidor.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
}) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-white/80"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="min-h-12 w-full rounded border border-white/15 bg-[#101010] px-3 text-sm text-white placeholder:text-white/30 focus:border-neon"
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
