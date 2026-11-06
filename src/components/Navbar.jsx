import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const links = [
  ["Inicio", "#inicio"],
  ["Nosotros", "#nosotros"],
  ["Planes", "#planes"],
  ["Clases", "#clases"],
  ["Contacto", "#contacto"],
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/85 backdrop-blur-xl">
      <nav
        aria-label="Navegación principal"
        className="section-wrap flex h-[4.5rem] items-center justify-between"
      >
        <a
          href="#inicio"
          onClick={closeMenu}
          className="display-font flex items-center gap-2 text-lg font-extrabold tracking-tight"
          aria-label="FitZone Gym, ir al inicio"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded bg-neon text-ink">
            <span className="text-sm font-extrabold">F</span>
          </span>
          FitZone <span className="text-neon">Gym</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm text-white/65 transition-colors hover:text-neon"
            >
              {label}
            </a>
          ))}
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 rounded bg-neon px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-white"
          >
            Inscríbete <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded border border-white/15 text-white md:hidden"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-ink px-6 pb-5 pt-3 md:hidden"
        >
          <div className="mx-auto flex max-w-[1180px] flex-col">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={closeMenu}
                className="border-b border-white/10 py-3.5 text-sm text-white/75 hover:text-neon"
              >
                {label}
              </a>
            ))}
            <a
              href="#contacto"
              onClick={closeMenu}
              className="button-primary mt-4 w-full"
            >
              Inscríbete <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
