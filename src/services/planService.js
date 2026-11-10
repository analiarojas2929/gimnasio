const API_URL = "http://localhost:3000/api/planes";

// Obtener todos los planes activos
export const obtenerPlanes = async () => {
  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener los planes");
    }

    const planes = await respuesta.json();

    return planes;
  } catch (error) {
    console.error("Error al obtener los planes:", error);
    throw error;
  }
};