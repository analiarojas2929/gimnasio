
import express from "express";
import cors from "cors";
import { pool } from "./config/db.js";
import * as jwt from "jsonwebtoken";
import { verificarToken } from "./middleware/auth.js";


const app = express();
const PORT = Number(process.env.PORT || 3000);

const allowedOrigins = (process.env.FRONTEND_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.warn(`Origen CORS rechazado: ${origin}`);
        return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// ==========================================
// VALIDACIONES COMPARTIDAS
// ==========================================

const nombreValido = /^[A-Za-z ]+$/;

const correoValido =
    /^(?!.*\.\.)[A-Za-z0-9_%+-]+(?:\.[A-Za-z0-9_%+-]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/;

// Normalizar teléfono: guardar solamente los 9 dígitos
function normalizarTelefono(telefono: string): string {
    const digitos = telefono.replace(/\D/g, "");

    return digitos.startsWith("56")
        ? digitos.slice(2)
        : digitos;
}

// Validar teléfono
function telefonoValido(telefono: string): boolean {
    const nacional = normalizarTelefono(telefono);

    return nacional.length === 9 && nacional.startsWith("9");
}

// ==========================================
// RUTA PRINCIPAL
// ==========================================

app.get("/api", (req, res) => {
    res.json({
        mensaje: "Bienvenido al backend de FitZone Gym",
        estado: "Servidor funcionando correctamente"
    });
});

app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.json({ estado: "Servidor y PostgreSQL disponibles" });
    } catch (error) {
        console.error("Health check de PostgreSQL fallido:", error);
        res.status(503).json({ estado: "Servidor disponible, PostgreSQL no disponible" });
    }
});

// ==========================================
// OBTENER PLANES ACTIVOS
// ==========================================

app.get("/api/planes", async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT id, nombre, descripcion, precio, duracion_dias
             FROM planes
             WHERE estado = TRUE
             ORDER BY id`
        );

        res.json(resultado.rows);

    } catch (error) {
        console.error("Error al consultar GET /api/planes:", error);

        res.status(500).json({
            mensaje: "No se pudieron consultar los planes. Verifica la conexión a PostgreSQL y la tabla planes."
        });
    }
});

// ==========================================
// REGISTRAR UNA INSCRIPCIÓN
// ==========================================

app.post("/api/usuarios", async (req, res) => {
    try {
        const { nombre, apellido, correo, telefono, plan } = req.body;

        // Validar campos obligatorios y tipos
        if (
            typeof nombre !== "string" ||
            typeof apellido !== "string" ||
            typeof correo !== "string" ||
            typeof telefono !== "string" ||
            typeof plan !== "string" ||
            !nombre.trim() ||
            !apellido.trim() ||
            !correo.trim() ||
            !telefono.trim() ||
            !plan.trim()
        ) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios y deben tener un formato válido."
            });
        }

        // Limpiar datos
        const nombreLimpio = nombre.trim();
        const apellidoLimpio = apellido.trim();
        const correoLimpio = correo.trim().toLowerCase();
        const telefonoLimpio = normalizarTelefono(telefono);

        // Validar nombre
        if (
            nombreLimpio.length > 50 ||
            !nombreValido.test(nombreLimpio)
        ) {
            return res.status(400).json({
                mensaje: "El nombre solo puede contener letras y espacios. Máximo 50 caracteres."
            });
        }

        // Validar apellido
        if (
            apellidoLimpio.length > 50 ||
            !nombreValido.test(apellidoLimpio)
        ) {
            return res.status(400).json({
                mensaje: "El apellido solo puede contener letras y espacios. Máximo 50 caracteres."
            });
        }

        // Validar correo
        if (
            correoLimpio.length < 10 ||
            correoLimpio.length > 100 ||
            !correoValido.test(correoLimpio)
        ) {
            return res.status(400).json({
                mensaje: "Ingresa un correo válido de entre 10 y 100 caracteres."
            });
        }

        // Validar teléfono
        if (
            telefono.length > 15 ||
            !telefonoValido(telefono)
        ) {
            return res.status(400).json({
                mensaje: "Ingresa un número válido de 9 dígitos. Ejemplo: +56 9 1234 5678."
            });
        }

        // Validar plan
        if (!["Básico", "Premium", "VIP"].includes(plan.trim())) {
            return res.status(400).json({
                mensaje: "El plan seleccionado no es válido."
            });
        }

        // Comprobar datos duplicados
        const duplicados = await pool.query(
            `SELECT
                EXISTS (
                    SELECT 1 FROM usuarios
                    WHERE LOWER(correo) = $1
                ) AS correo_existe,
                EXISTS (
                    SELECT 1 FROM usuarios
                    WHERE telefono = $2
                ) AS telefono_existe`,
            [correoLimpio, telefonoLimpio]
        );

        const correoExiste = duplicados.rows[0].correo_existe;
        const telefonoExiste = duplicados.rows[0].telefono_existe;

        if (correoExiste && telefonoExiste) {
            return res.status(409).json({
                mensaje: "El correo y el número de teléfono ya se encuentran registrados."
            });
        }

        if (correoExiste) {
            return res.status(409).json({
                mensaje: "Este correo ya se encuentra registrado."
            });
        }

        if (telefonoExiste) {
            return res.status(409).json({
                mensaje: "Este número de teléfono ya se encuentra registrado."
            });
        }

        // Registrar usuario
        const resultado = await pool.query(
            `INSERT INTO usuarios
             (nombre, apellido, correo, telefono, plan, fecha_registro)
             VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)
             RETURNING id, nombre, correo, plan`,
            [
                nombreLimpio,
                apellidoLimpio,
                correoLimpio,
                telefonoLimpio,
                plan.trim()
            ]
        );

        res.status(201).json({
            mensaje: "Inscripción registrada correctamente.",
            usuario: resultado.rows[0]
        });

    } catch (error: any) {
        console.error("ERROR REAL DE INSCRIPCIÓN:", error);

        // Controlar duplicados de PostgreSQL
        if (error.code === "23505") {
            if (error.constraint === "usuarios_correo_key") {
                return res.status(409).json({
                    mensaje: "Este correo ya se encuentra registrado."
                });
            }

            if (error.constraint === "usuarios_telefono_unique") {
                return res.status(409).json({
                    mensaje: "Este número de teléfono ya se encuentra registrado."
                });
            }
        }

        res.status(500).json({
            mensaje: "No se pudo registrar la inscripción."
        });
    }
});

// ==========================================
// REGISTRAR UNA CONSULTA DE CONTACTO
// ==========================================

app.post("/api/contactos", async (req, res) => {
    try {
        const { nombre, correo, telefono, mensaje } = req.body;

        // Validar campos obligatorios y tipos
        if (
            typeof nombre !== "string" ||
            typeof correo !== "string" ||
            typeof telefono !== "string" ||
            typeof mensaje !== "string" ||
            !nombre.trim() ||
            !correo.trim() ||
            !telefono.trim() ||
            !mensaje.trim()
        ) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios y deben tener un formato válido."
            });
        }

        // Limpiar datos
        const nombreLimpio = nombre.trim();
        const correoLimpio = correo.trim().toLowerCase();
        const telefonoLimpio = normalizarTelefono(telefono);
        const mensajeLimpio = mensaje.trim();

        // Validar nombre
        if (
            nombreLimpio.length > 50 ||
            !nombreValido.test(nombreLimpio)
        ) {
            return res.status(400).json({
                mensaje: "El nombre solo puede contener letras y espacios. Máximo 50 caracteres."
            });
        }

        // Validar correo
        if (
            correoLimpio.length < 10 ||
            correoLimpio.length > 100 ||
            !correoValido.test(correoLimpio)
        ) {
            return res.status(400).json({
                mensaje: "Ingresa un correo válido de entre 10 y 100 caracteres."
            });
        }

        // Validar teléfono
        if (
            telefono.length > 15 ||
            !telefonoValido(telefono)
        ) {
            return res.status(400).json({
                mensaje: "Ingresa un número válido de 9 dígitos. Ejemplo: +56 9 1234 5678."
            });
        }

        // Validar mensaje
        if (
            mensajeLimpio.length < 10 ||
            mensajeLimpio.length > 500
        ) {
            return res.status(400).json({
                mensaje: "El mensaje debe tener entre 10 y 500 caracteres."
            });
        }

        // Registrar contacto
        const resultado = await pool.query(
            `INSERT INTO contactos
             (nombre, correo, telefono, mensaje, fecha_envio)
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
             RETURNING id, nombre, correo`,
            [
                nombreLimpio,
                correoLimpio,
                telefonoLimpio,
                mensajeLimpio
            ]
        );

        res.status(201).json({
            mensaje: "Consulta enviada correctamente.",
            contacto: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al registrar contacto:", error);

        res.status(500).json({
            mensaje: "No se pudo registrar la consulta."
        });
    }
});


 // ==========================================
// INICIAR SESIÓN DEL ADMINISTRADOR
// ==========================================


// ==========================================
// OBTENER INSCRIPCIONES (SOLO ADMINISTRADOR)
// ==========================================

app.get("/api/admin/inscripciones", verificarToken, async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT
                id,
                nombre,
                apellido,
                correo,
                telefono,
                plan,
                fecha_registro
             FROM usuarios
             ORDER BY id DESC`
        );

        res.json(resultado.rows);

    } catch (error) {
        console.error("Error al obtener las inscripciones:", error);

        res.status(500).json({
            mensaje: "No se pudieron obtener las inscripciones."
        });
    }
});


app.post("/api/admin/login", (req, res) => {
    const { usuario, password } = req.body;

    const adminUsuario = process.env.ADMIN_USER;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const secreto = process.env.JWT_SECRET;

    if (
        typeof usuario !== "string" ||
        typeof password !== "string" ||
        !usuario ||
        !password
    ) {
        return res.status(400).json({
            mensaje: "Debes ingresar usuario y contraseña."
        });
    }

    if (!adminUsuario || !adminPassword || !secreto) {
        console.error("Faltan variables de seguridad en el archivo .env");

        return res.status(500).json({
            mensaje: "Error en la configuración de seguridad."
        });
    }

    if (
        usuario !== adminUsuario ||
        password !== adminPassword
    ) {
        return res.status(401).json({
            mensaje: "Usuario o contraseña incorrectos."
        });
    }

    const token = jwt.sign(
        { usuario: adminUsuario, rol: "admin" },
        secreto,
        { expiresIn: "2h" }
    );

    return res.json({
        mensaje: "Inicio de sesión correcto.",
        token
    });
});


// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);

    pool.query("SELECT NOW()")
        .then(() => {
            console.log("PostgreSQL conectado correctamente.");
        })
        .catch((error) => {
            console.error("Error de conexión con PostgreSQL:", error);
        });
});
