
import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { obtenerPlanes } from "../services/planService";

const caracteristicas = {
  Básico: [
    "Acceso a sala de musculación",
    "Entrena en horario valle",
    "Plan mensual",
  ],
  Premium: [
    "Acceso libre a la sala",
    "Clases grupales incluidas",
    "Acceso todos los días",
  ],
  VIP: [
    "Todo lo incluido en Premium",
    "Sesión de orientación inicial",
    "Invita a un acompañante",
  ],
};

export default function Plans({ onChoosePlan }) {
  const [plans, setPlans] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPlanes = async () => {
      try {
        const datos = await obtenerPlanes();
        setPlans(datos);
      } catch (err) {
        setError("No fue posible cargar los planes.");
      } finally {
        setCargando(false);
      }
    };

    cargarPlanes();
  }, []);

  return (
    <section
      id="planes"
      className="section-anchor border-y border-white/5 bg-[#101010] py-24 sm:py-32"
    >
      <div className="section-wrap">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">Encuentra tu ritmo</span>
            <h2 className="display-font mt-5 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Un plan para cada meta.
            </h2>
          </div>

          <p className="max-w-[400px] text-sm leading-6 text-white/55">
            Elige el que mejor se adapte a ti. Hablemos de tus objetivos y te
            ayudamos a encontrar tu mejor opción.
          </p>
        </div>

        {cargando && (
          <p className="mt-12 text-center text-white/60">
            Cargando planes...
          </p>
        )}

        {error && (
          <p className="mt-12 text-center text-red-400">{error}</p>
        )}

        {!cargando && !error && plans.length === 0 && (
          <p className="mt-12 text-center text-white/60">
            Próximamente tendremos planes disponibles.
          </p>
        )}

        {!cargando && !error && plans.length > 0 && (
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded border p-7 ${
                  plan.nombre === "Premium"
                    ? "border-neon/60 bg-[#1a1d16]"
                    : "border-white/10 bg-card"
                }`}
              >
                {plan.nombre === "Premium" && (
                  <span className="absolute right-5 top-5 rounded-full bg-neon px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink">
                    Más elegido
                  </span>
                )}

                <h3 className="display-font text-xl font-bold">
                  {plan.nombre}
                </h3>

                <p className="mt-2 min-h-10 max-w-[250px] text-sm leading-5 text-white/55">
                  {plan.descripcion}
                </p>

                <div className="mt-7 flex items-baseline gap-2">
                  <span className="display-font text-4xl font-extrabold tracking-tight">
                    ${Number(plan.precio).toLocaleString("es-CL")}
                  </span>
                  <span className="text-sm text-white/50">
                    / {plan.duracion_dias} días
                  </span>
                </div>

                <p className="mt-1 text-xs text-white/40">
                  Precio referencial en pesos chilenos
                </p>

                <div className="my-7 h-px bg-white/10" />

                <ul className="flex flex-1 flex-col gap-4">
                  {(caracteristicas[plan.nombre] || []).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-white/75"
                    >
                      <Check
                        size={17}
                        className="mt-0.5 shrink-0 text-neon"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => onChoosePlan?.(plan.nombre)}
                  className={`mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded px-4 text-sm font-bold transition-colors ${
                    plan.nombre === "Premium"
                      ? "bg-neon text-ink hover:bg-white"
                      : "border border-white/20 text-white hover:border-neon hover:text-neon"
                  }`}
                >
                  Elegir plan <ArrowRight size={16} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
