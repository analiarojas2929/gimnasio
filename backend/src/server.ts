
import express from "express";
import cors from "cors";
import { pool } from "./config/db.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ruta principal
app.get("/api", (req, res) => {
    res.json({
        mensaje: "Bienvenido al backend de FitZone Gym",
        estado: "Servidor funcionando correctamente"
    });
});

// Obtener planes activos
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
        console.error("Error al obtener los planes:", error);
        res.status(500).json({
            mensaje: "Error al consultar los planes"
        });
    }
});

// Registrar una inscripción
app.post("/api/usuarios", async (req, res) => {
    try {
        const { nombre, apellido, correo, telefono, plan } = req.body;

        if (!nombre || !correo || !telefono || !plan) {
            return res.status(400).json({
                mensaje: "Todos los campos obligatorios deben completarse."
            });
        }

        if (!["Básico", "Premium", "VIP"].includes(plan)) {
            return res.status(400).json({
                mensaje: "El plan seleccionado no es válido."
            });
        }

        const resultado = await pool.query(
            `INSERT INTO usuarios
             (nombre, apellido, correo, telefono, plan, fecha_registro)
             VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)
             RETURNING id, nombre, correo, plan`,
            [
                nombre.trim(),
                (apellido || "").trim(),
                correo.trim(),
                telefono.trim(),
                plan
            ]
        );

        res.status(201).json({
            mensaje: "Inscripción registrada correctamente.",
            usuario: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al registrar inscripción:", error);
        res.status(500).json({
            mensaje: "No se pudo registrar la inscripción."
        });
    }
});

// Registrar una consulta de contacto
app.post("/api/contactos", async (req, res) => {
    try {
        const { nombre, correo, telefono, mensaje } = req.body;

        if (!nombre || !correo || !telefono || !mensaje) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios."
            });
        }

        const resultado = await pool.query(
            `INSERT INTO contactos
             (nombre, correo, telefono, mensaje, fecha_envio)
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
             RETURNING id, nombre, correo`,
            [
                nombre.trim(),
                correo.trim(),
                telefono.trim(),
                mensaje.trim()
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

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
