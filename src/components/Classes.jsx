import { ArrowUpRight } from "lucide-react";

const classes = [
  {
    name: "Musculación",
    category: "Fuerza",
    description: "Construye fuerza y trabaja a tu ritmo en la sala.",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80",
    alt: "Persona entrenando con pesas en un gimnasio",
  },
  {
    name: "Funcional",
    category: "Movimiento",
    description: "Ejercicios dinámicos para moverte con energía.",
    image:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=80",
    alt: "Entrenamiento funcional en grupo",
  },
  {
    name: "Spinning",
    category: "Cardio",
    description: "Súbete a la bici y encuentra tu propio ritmo.",
    image:
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=900&q=80",
    alt: "Bicicletas de spinning en una sala de entrenamiento",
  },
  {
    name: "Yoga",
    category: "Equilibrio",
    description: "Un momento para conectar cuerpo, respiración y calma.",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80",
    alt: "Práctica de yoga en un espacio tranquilo",
  },
];

export default function Classes() {
  return (
    <section id="clases" className="section-anchor py-24 sm:py-32">
      <div className="section-wrap">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">Muévete como te gusta</span>
            <h2 className="display-font mt-5 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Tu próxima clase te espera.
            </h2>
          </div>
          <a
            href="#horarios"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neon hover:text-white"
          >
            Ver horarios <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {classes.map((activity) => (
            <article
              key={activity.name}
              className="group overflow-hidden rounded border border-white/[0.08] bg-card"
            >
              <div className="image-fallback relative h-64 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-ink/70 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wider backdrop-blur">
                  {activity.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="display-font text-lg font-bold">
                  {activity.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {activity.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
