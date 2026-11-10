
import { useEffect, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

const initialForm = {
  nombre: "",
  apellido: "",
  correo: "",
  telefono: "",
  plan: "",
};

export default function Inscription({ selectedPlan }) {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedPlan) {
      setForm((current) => ({
        ...current,
        plan: selectedPlan,
      }));
    }
  }, [selectedPlan]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSubmitted(false);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitted(false);

    if (
      !form.nombre.trim() ||
      !form.apellido.trim() ||
      !form.correo.trim() ||
      !form.telefono.trim() ||
      !form.plan
    ) {
      setError("Completa todos los campos.");
      return;
    }

    setIsSubmitting(true);

    try {
      const respuesta = await fetch(
        "http://localhost:3000/api/usuarios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: form.nombre.trim(),
            apellido: form.apellido.trim(),
            correo: form.correo.trim(),
            telefono: form.telefono.trim(),
            plan: form.plan,
          }),
        }
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.mensaje || "No se pudo completar la inscripción."
        );
      }

      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      console.error("Error al registrar inscripción:", err);
      setError(err.message || "Ocurrió un error al enviar los datos.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="inscripcion"
      className="section-anchor py-24 sm:py-32"
    >
      <div className="section-wrap">
        <div className="mx-auto max-w-2xl">
          <span className="eyebrow">Únete a FitZone</span>

          <h2 className="display-font mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Comienza tu <span className="text-neon">cambio.</span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-white/55">
            Completa tus datos y solicita tu inscripción.
            Nuestro equipo se pondrá en contacto contigo.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded border border-white/10 bg-card p-5 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Nombre"
                name="nombre"
                value={form.nombre}
                onChange={updateField}
                placeholder="Tu nombre"
              />

              <Field
                label="Apellido"
                name="apellido"
                value={form.apellido}
                onChange={updateField}
                placeholder="Tu apellido"
              />

              <Field
                label="Correo electrónico"
                name="correo"
                type="email"
                value={form.correo}
                onChange={updateField}
                placeholder="nombre@correo.cl"
              />

              <Field
                label="Teléfono"
                name="telefono"
                type="tel"
                value={form.telefono}
                onChange={updateField}
                placeholder="+56 9 1234 5678"
              />

              <div className="sm:col-span-2">
                <label
                  htmlFor="plan-inscripcion"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  Plan seleccionado
                </label>

                <select
                  id="plan-inscripcion"
                  name="plan"
                  value={form.plan}
                  onChange={updateField}
                  className="min-h-12 w-full rounded border border-white/15 bg-[#101010] px-3 text-sm text-white"
                >
                  <option value="">Selecciona un plan</option>
                  <option value="Básico">Básico</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="button-primary mt-7 w-full sm:w-auto disabled:opacity-50"
            >
              {isSubmitting ? "Registrando..." : "Solicitar inscripción"}
              <Send size={15} aria-hidden="true" />
            </button>

            {error && (
              <p role="alert" className="mt-5 text-sm text-red-400">
                {error}
              </p>
            )}

            {submitted && (
              <p
                role="status"
                className="mt-5 flex items-start gap-2 text-sm leading-6 text-neon"
              >
                <CheckCircle2 size={18} className="shrink-0" />
                ¡Inscripción registrada correctamente! Nos pondremos
                en contacto contigo.
              </p>
            )}
          </form>
        </div>
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
  placeholder,
}) {
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
        placeholder={placeholder}
        className="min-h-12 w-full rounded border border-white/15 bg-[#101010] px-3 text-sm text-white placeholder:text-white/30 focus:border-neon"
      />
    </div>
  );
}
