import { HeartPulse, ShieldCheck, Zap } from "lucide-react";

const benefits = [
  {
    icon: HeartPulse,
    title: "Entrena a tu ritmo",
    text: "Encuentra actividades y espacios que se adaptan a tus objetivos y a tu día a día.",
  },
  {
    icon: ShieldCheck,
    title: "Un espacio para todos",
    text: "Un ambiente cercano y motivador, tanto si estás empezando como si ya tienes experiencia.",
  },
  {
    icon: Zap,
    title: "Energía que impulsa",
    text: "Haz de cada entrenamiento un nuevo paso hacia la versión de ti que buscas.",
  },
];

export default function About() {
  return (
    <section id="nosotros" className="section-anchor py-24 sm:py-32">
      <div className="section-wrap">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="eyebrow">Más que un gimnasio</span>
            <h2 className="display-font mt-5 text-4xl font-bold leading-tight tracking-[-0.045em] sm:text-5xl">
              El lugar donde
              <br />
              <span className="text-white/45">empieza tu cambio.</span>
            </h2>
          </div>
          <p className="max-w-[590px] text-base leading-8 text-white/60 lg:justify-self-end">
            En FitZone creemos que no existe una sola forma de avanzar. Por eso
            creamos un espacio para moverte, descubrir lo que te hace bien y
            celebrar cada progreso, grande o pequeño.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }, index) => (
            <article
              key={title}
              className="rounded border border-white/[0.07] bg-card p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded bg-neon/10 text-neon">
                  <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="display-font text-sm font-semibold text-white/25">
                  0{index + 1}
                </span>
              </div>
              <h3 className="display-font mt-7 text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
