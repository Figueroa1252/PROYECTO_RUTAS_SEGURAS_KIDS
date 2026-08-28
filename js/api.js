/**
 * Servicio para consumir la API pública de Random User Generator
 * Proporciona datos reales de conductores y estudiantes dinámicamente.
 */
const BASE_URL = 'https://randomuser.me/api/';

/**
 * Consulta la API pública para obtener un perfil aleatorio
 * @returns {Promise<{name: string, picture: string, city: string, country: string}>}
 */
export async function fetchRandomPerson() {
  try {
    const response = await fetch(`${BASE_URL}?nat=es,us`);

    if (!response.ok) {
      throw new Error(`Error en la petición HTTP: ${response.status}`);
    }

    const data = await response.json();
    const user = data.results[0];

    return {
      name: `${user.name.first} ${user.name.last}`,
      picture: user.picture.medium,
      city: user.location.city,
      country: user.location.country
    };
  } catch (error) {
    console.error('Error al consumir la API pública:', error);
    throw error;
  }
}