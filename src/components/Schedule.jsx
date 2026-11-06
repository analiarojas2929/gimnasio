import { Clock3 } from "lucide-react";

const schedule = [
  ["Musculación", "Lunes a viernes", "07:00 – 21:00"],
  ["Funcional", "Lunes, miércoles y viernes", "08:00 · 18:30"],
  ["Spinning", "Martes y jueves", "09:00 · 19:00"],
  ["Yoga", "Martes y jueves", "10:00 · 17:30"],
];

export default function Schedule() {
  return (
    <section
      id="horarios"
      className="section-anchor border-y border-white/5 bg-[#101010] py-24 sm:py-28"
    >
      <div className="section-wrap grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
        <div>
          <span className="eyebrow">Organiza tu semana</span>
          <h2 className="display-font mt-5 text-4xl font-bold leading-tight tracking-[-0.045em] sm:text-5xl">
            Hay un momento
            <br />
            para moverte.
          </h2>
          <p className="mt-5 max-w-[380px] text-sm leading-7 text-white/55">
            Horarios de ejemplo sujetos a cambios. Consulta la disponibilidad
            antes de planificar tu visita.
          </p>
          <div className="mt-7 inline-flex items-center gap-2 text-xs text-white/45">
            <Clock3 size={15} className="text-neon" aria-hidden="true" />
            Horarios referenciales
          </div>
        </div>

        <div className="overflow-hidden rounded border border-white/10 bg-card">
          <div className="hidden grid-cols-[1fr_1.2fr_0.8fr] gap-4 border-b border-white/10 px-6 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/40 sm:grid">
            <span>Clase</span>
            <span>Días</span>
            <span>Horario</span>
          </div>
          <div>
            {schedule.map(([name, days, time]) => (
              <div
                key={name}
                className="grid gap-2 border-b border-white/[0.07] px-5 py-5 last:border-0 sm:grid-cols-[1fr_1.2fr_0.8fr] sm:items-center sm:gap-4 sm:px-6"
              >
                <span className="display-font font-bold">{name}</span>
                <span className="text-sm text-white/55">{days}</span>
                <span className="text-sm font-medium text-neon">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
