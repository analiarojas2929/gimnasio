
import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setSubmitted(false);
    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = form.phone.replace(/\D/g, "");

    if (form.name.trim().length < 2) {
      nextErrors.name = "Ingresa tu nombre.";
    }

    if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = "Ingresa un correo válido.";
    }

    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      nextErrors.phone = "Ingresa un teléfono válido.";
    }

    if (form.message.trim().length < 10) {
      nextErrors.message = "Escribe al menos 10 caracteres.";
    }

    setErrors(nextErrors);
    setSubmitted(false);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const respuesta = await fetch(
        "http://localhost:3000/api/contactos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: form.name.trim(),
            correo: form.email.trim(),
            telefono: form.phone.trim(),
            mensaje: form.message.trim(),
          }),
        }
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.mensaje || "No se pudo enviar la consulta."
        );
      }

      setSubmitted(true);
      setForm(initialForm);
    } catch (error) {
      console.error("Error al enviar la consulta:", error);
      setSubmitError(error.message || "Ocurrió un error.");
    } finally {
      setIsSubmitting(false);
    }
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
            ¿Tienes alguna pregunta? Déjanos tus datos y
            cuéntanos qué necesitas. Nuestro equipo se pondrá
            en contacto contigo.
          </p>

          <div className="mt-8 rounded border border-white/10 bg-card p-5">
            <p className="text-sm font-semibold">
              ¿Quieres saber más?
            </p>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Estamos aquí para ayudarte a encontrar la mejor
              opción para tus objetivos.
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
              placeholder="Tu nombre"
            />

            <Field
              label="Correo electrónico"
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              error={errors.email}
              placeholder="nombre@correo.cl"
            />

            <Field
              label="Teléfono"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={updateField}
              error={errors.phone}
              placeholder="+56 9 1234 5678"
            />

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
                placeholder="Escribe tu consulta..."
                className="w-full resize-y rounded border border-white/15 bg-[#101010] px-3 py-3 text-sm text-white placeholder:text-white/30 focus:border-neon"
              />

              {errors.message && (
                <p className="mt-1.5 text-xs text-red-300">
                  {errors.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="button-primary mt-6 w-full sm:w-auto disabled:opacity-50"
          >
            {isSubmitting ? "Enviando..." : "Enviar consulta"}
            <Send size={15} aria-hidden="true" />
          </button>

          {submitError && (
            <p role="alert" className="mt-5 text-sm text-red-400">
              {submitError}
            </p>
          )}

          {submitted && (
            <p
              role="status"
              className="mt-5 flex items-start gap-2 text-sm leading-6 text-neon"
            >
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              Tu consulta fue registrada correctamente. Nos pondremos
              en contacto contigo.
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
