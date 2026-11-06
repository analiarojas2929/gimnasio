import { ArrowDown, ArrowRight, MoveUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="section-anchor relative flex min-h-[760px] items-center overflow-hidden border-b border-white/5 pt-[4.5rem] sm:min-h-[820px]"
    >
      <div className="image-fallback absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2200&q=85"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-55"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/25" />

      <div className="section-wrap relative z-10 grid items-center gap-12 py-20 lg:grid-cols-[1fr_260px]">
        <div className="max-w-[760px]">
          <span className="eyebrow fade-up">Tu próxima versión empieza aquí</span>
          <h1 className="display-font fade-up delay-100 mt-6 text-5xl font-extrabold leading-[1.05] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            Transforma tu cuerpo.
            <span className="mt-1 block text-neon">Supera tus límites.</span>
          </h1>
          <p className="fade-up delay-200 mt-6 max-w-[540px] text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            Un espacio para entrenar con propósito, encontrar tu ritmo y avanzar
            un poco más cada día. Tu camino, a tu manera.
          </p>
          <div className="fade-up delay-200 mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#planes" className="button-primary">
              Ver planes <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a href="#clases" className="button-secondary">
              Conoce nuestras clases
            </a>
          </div>
        </div>

        <a
          href="#nosotros"
          className="hidden items-center gap-3 justify-self-end text-xs uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-neon lg:flex"
        >
          Descubre FitZone
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30">
            <ArrowDown size={16} aria-hidden="true" />
          </span>
        </a>
      </div>

      <div className="absolute bottom-8 right-8 hidden items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-white/40 sm:flex">
        <MoveUpRight size={14} aria-hidden="true" /> Entrena a tu manera
      </div>
    </section>
  );
}
