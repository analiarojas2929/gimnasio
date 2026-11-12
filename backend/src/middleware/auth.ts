import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export function verificarToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const encabezado = req.headers.authorization;

    if (!encabezado || !encabezado.startsWith("Bearer ")) {
        return res.status(401).json({
            mensaje: "Acceso no autorizado. Debes iniciar sesión."
        });
    }

    const token = encabezado.split(" ")[1];
    const secreto = process.env.JWT_SECRET;

    if (!secreto) {
        return res.status(500).json({
            mensaje: "No está configurada la clave de seguridad."
        });
    }

    try {
        jwt.verify(token, secreto);
        next();
    } catch {
        return res.status(401).json({
            mensaje: "Tu sesión no es válida o ha expirado."
        });
    }
}