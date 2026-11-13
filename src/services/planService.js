const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/planes`;

// Obtener todos los planes activos
export const obtenerPlanes = async () => {
  let respuesta;

  try {
    respuesta = await fetch(API_URL);
  } catch (error) {
    console.error("No se pudo conectar con la API de planes:", error);
    throw new Error(
      `No se pudo conectar con el backend en ${API_URL}. Comprueba que esté iniciado en el puerto 3000.`,
    );
  }

  const resultado = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new Error(
      resultado?.mensaje || `Error HTTP ${respuesta.status} al consultar los planes.`,
    );
  }

  if (!Array.isArray(resultado)) {
    throw new Error("La API de planes devolvió una respuesta con formato inválido.");
  }

  return resultado;
};