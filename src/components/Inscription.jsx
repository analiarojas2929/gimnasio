
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

    const nombre = form.nombre.trim();
    const apellido = form.apellido.trim();
    const correo = form.correo.trim();
    const telefono = form.telefono.trim();
    const plan = form.plan;

    // Validaciones
    const nombreValido = /^[A-Za-z ]+$/;
    const correoValido = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const digitosTelefono = telefono.replace(/\D/g, "");

    // Aceptar teléfono nacional o con prefijo 56
    const telefonoNacional = digitosTelefono.startsWith("56")
      ? digitosTelefono.slice(2)
      : digitosTelefono;

    // Todos los campos obligatorios
    if (!nombre || !apellido || !correo || !telefono || !plan) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // Nombre
    if (nombre.length > 50 || !nombreValido.test(nombre)) {
      setError(
        "El nombre solo puede contener letras sin tildes y espacios. Máximo 50 caracteres."
      );
      return;
    }

    // Apellido
    if (apellido.length > 50 || !nombreValido.test(apellido)) {
      setError(
        "El apellido solo puede contener letras sin tildes y espacios. Máximo 50 caracteres."
      );
      return;
    }

    // Correo electrónico
    if (
      correo.length < 10 ||
      correo.length > 100 ||
      !correoValido.test(correo)
    ) {
      setError(
        "Ingresa un correo válido de entre 10 y 100 caracteres."
      );
      return;
    }

    // Teléfono celular chileno
    if (
      telefonoNacional.length !== 9 ||
      !telefonoNacional.startsWith("9")
    ) {
      setError(
        "Ingresa un número válido de 9 dígitos. Ejemplo: +56 9 1234 5678."
      );
      return;
    }

    // Plan permitido
    if (!["Básico", "Premium", "VIP"].includes(plan)) {
      setError("Selecciona un plan válido.");
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
            nombre,
            apellido,
            correo,
            telefono,
            plan,
          }),
        }
      );

      const resultado = await respuesta.json();

      console.log("RESPUESTA DEL BACKEND:", resultado);

      if (!respuesta.ok) {
        throw new Error(
          resultado.detalle ||
          resultado.mensaje ||
          "No se pudo completar la inscripción."
        );
      }

      setSubmitted(true);
      setForm(initialForm);

    } catch (err) {
      console.error("Error al registrar inscripción:", err);

      setError(
        err.message || "Ocurrió un error al enviar los datos."
      );

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
            noValidate
            className="mt-10 rounded border border-white/10 bg-card p-5 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Nombre"
                name="nombre"
                value={form.nombre}
                onChange={updateField}
                placeholder="Tu nombre"
                maxLength={50}
              />

              <Field
                label="Apellido"
                name="apellido"
                value={form.apellido}
                onChange={updateField}
                placeholder="Tu apellido"
                maxLength={50}
              />

              <Field
                label="Correo electrónico"
                name="correo"
                type="email"
                value={form.correo}
                onChange={updateField}
                placeholder="nombre@correo.cl"
                maxLength={100}
              />

              <Field
                label="Teléfono"
                name="telefono"
                type="tel"
                value={form.telefono}
                onChange={updateField}
                placeholder="+56 9 1234 5678"
                maxLength={15}
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
                  required
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
  maxLength,
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
        maxLength={maxLength}
        className="min-h-12 w-full rounded border border-white/15 bg-[#101010] px-3 text-sm text-white placeholder:text-white/30 focus:border-neon"
      />
    </div>
  );
}
