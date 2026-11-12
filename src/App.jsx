
import { useEffect, useState } from "react";

import About from "./components/About.jsx";
import Classes from "./components/Classes.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import Navbar from "./components/Navbar.jsx";
import Plans from "./components/Plans.jsx";
import Schedule from "./components/Schedule.jsx";
import Inscription from "./services/Inscription.jsx";

import LoginAdmin from "./components/admin/LoginAdmin.jsx";

const API_URL = "http://localhost:3000/api";

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const esAdmin = window.location.pathname === "/admin";

  function choosePlan(plan) {
    setSelectedPlan(plan);

    setTimeout(() => {
      document.getElementById("inscripcion")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }

  // Obtener inscripciones del administrador
  useEffect(() => {
    if (!esAdmin || !adminToken) return;

    async function obtenerInscripciones() {
      setCargando(true);
      setError("");

      try {
        const respuesta = await fetch(
          `${API_URL}/admin/inscripciones`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            resultado.mensaje || "No se pudieron obtener las inscripciones."
          );
        }

        setInscripciones(resultado);
      } catch (err) {
        setError(err.message || "Error al cargar las inscripciones.");
      } finally {
        setCargando(false);
      }
    }

    obtenerInscripciones();
  }, [esAdmin, adminToken]);

  // Panel de administración
  if (esAdmin) {
    if (!adminToken) {
      return (
        <LoginAdmin
          onLogin={(token) => setAdminToken(token)}
        />
      );
    }

    return (
      <main className="min-h-screen bg-[#0b0b0b] px-5 py-10 text-white">
        <div className="mx-auto max-w-6xl">

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                FitZone <span className="text-neon">Admin</span>
              </h1>
              <p className="mt-2 text-sm text-white/50">
                Panel de administración
              </p>
            </div>

            <button
              onClick={() => {
                setAdminToken("");
                setInscripciones([]);
              }}
              className="button-primary"
            >
              Cerrar sesión
            </button>
          </div>

          <section className="mt-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">
                Inscripciones registradas
              </h2>

              <span className="rounded bg-white/10 px-4 py-2 text-sm">
                Total: {inscripciones.length}
              </span>
            </div>

            {cargando && (
              <p className="text-white/60">
                Cargando inscripciones...
              </p>
            )}

            {error && (
              <p className="mb-4 text-red-400">
                {error}
              </p>
            )}

            {!cargando && !error && inscripciones.length === 0 && (
              <div className="rounded border border-white/10 bg-[#171717] p-8 text-center">
                <p className="text-white/60">
                  Todavía no hay inscripciones registradas.
                </p>
              </div>
            )}

            {!cargando && inscripciones.length > 0 && (
              <div className="overflow-x-auto rounded border border-white/10">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-[#1b1b1b] text-white/70">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Nombre</th>
                      <th className="p-4">Apellido</th>
                      <th className="p-4">Correo</th>
                      <th className="p-4">Teléfono</th>
                      <th className="p-4">Plan</th>
                      <th className="p-4">Fecha</th>
                    </tr>
                  </thead>

                  <tbody>
                    {inscripciones.map((usuario) => (
                      <tr
                        key={usuario.id}
                        className="border-t border-white/10 hover:bg-white/5"
                      >
                        <td className="p-4">{usuario.id}</td>
                        <td className="p-4">{usuario.nombre}</td>
                        <td className="p-4">{usuario.apellido}</td>
                        <td className="p-4">{usuario.correo}</td>
                        <td className="p-4">{usuario.telefono}</td>
                        <td className="p-4">
                          <span className="rounded bg-lime-400/10 px-3 py-1 text-neon">
                            {usuario.plan}
                          </span>
                        </td>
                        <td className="p-4">
                          {usuario.fecha_registro
                            ? new Date(usuario.fecha_registro).toLocaleDateString("es-CL")
                            : "Sin fecha"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    );
  }

  // Página pública de FitZone
  return (
    <>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>

      <Navbar />

      <main id="main-content">
        <Hero />
        <About />
        <Plans onChoosePlan={choosePlan} />
        <Inscription selectedPlan={selectedPlan} />
        <Classes />
        <Schedule />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
