import { ArrowUpRight } from "lucide-react";

const footerLinks = [
  ["Nosotros", "#nosotros"],
  ["Planes", "#planes"],
  ["Clases", "#clases"],
  ["Horarios", "#horarios"],
  ["Contacto", "#contacto"],
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080808]">
      <div className="section-wrap py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <a
              href="#inicio"
              className="display-font inline-flex items-center gap-2 text-lg font-extrabold"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded bg-neon text-sm text-ink">
                F
              </span>
              FitZone <span className="text-neon">Gym</span>
            </a>
            <p className="mt-4 max-w-[300px] text-sm leading-6 text-white/45">
              Tu espacio para moverte, encontrar tu ritmo y seguir creciendo.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Explora</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
              {footerLinks.map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-white/50 transition-colors hover:text-neon"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Redes sociales</h2>
            <p className="mt-4 max-w-[250px] text-sm leading-6 text-white/45">
              Los enlaces oficiales estarán disponibles próximamente.
            </p>
            <a
              href="#contacto"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-neon hover:text-white"
            >
              Escríbenos <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FitZone Gym. Todos los derechos reservados.</p>
          <p>Precios y horarios mostrados son referenciales.</p>
        </div>
      </div>
    </footer>
  );
}
