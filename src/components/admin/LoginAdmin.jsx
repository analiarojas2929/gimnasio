
import { useState } from "react";
import { LockKeyhole, User, LogIn } from "lucide-react";

export default function LoginAdmin({ onLogin }) {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setCargando(true);

        try {
            const respuesta = await fetch(
                "http://localhost:3000/api/admin/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        usuario,
                        password,
                    }),
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    resultado.mensaje || "No se pudo iniciar sesión."
                );
            }

            onLogin(resultado.token);

        } catch (error) {
            setError(error.message || "Error al conectar con el servidor.");
        } finally {
            setCargando(false);
        }
    }

    return (
        <section className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-5 py-12">
            <div className="w-full max-w-md rounded border border-white/10 bg-[#171717] p-8">

                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#b6ff35]/10">
                        <LockKeyhole size={30} className="text-neon" />
                    </div>

                    <h1 className="display-font text-3xl font-bold text-white">
                        FitZone <span className="text-neon">Admin</span>
                    </h1>

                    <p className="mt-3 text-sm text-white/50">
                        Ingresa tus credenciales para acceder al panel.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="mb-2 block text-sm font-medium text-white/80">
                            Usuario
                        </label>

                        <div className="flex items-center rounded border border-white/15 bg-[#101010] px-3">
                            <User size={18} className="text-white/40" />

                            <input
                                type="text"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                placeholder="Usuario administrador"
                                autoComplete="username"
                                required
                                className="min-h-12 w-full bg-transparent px-3 text-sm text-white outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-white/80">
                            Contraseña
                        </label>

                        <div className="flex items-center rounded border border-white/15 bg-[#101010] px-3">
                            <LockKeyhole size={18} className="text-white/40" />

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Tu contraseña"
                                autoComplete="current-password"
                                required
                                className="min-h-12 w-full bg-transparent px-3 text-sm text-white outline-none"
                            />
                        </div>
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={cargando}
                        className="button-primary flex w-full items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {cargando ? "Ingresando..." : "Iniciar sesión"}
                        <LogIn size={17} />
                    </button>

                </form>

                <p className="mt-7 text-center text-xs text-white/35">
                    FitZone Gym · Panel de administración
                </p>
            </div>
        </section>
    );
}
