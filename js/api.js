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
    const response = await fetch(BASE_URL);
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
    return null;
  }
}
/**
 * Servicio para obtener el clima actual en vivo (Open-Meteo / Weather API)
 * Por defecto consulta las coordenadas de la ciudad de la ruta (ej. San Gil / Bogotá).
 */
export async function fetchWeather(lat = 6.5543, lon = -73.1367) {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await response.json();
    return data.current_weather; // Retorna { temperature: 24.5, weathercode: 1, windspeed: 10.2, ... }
  } catch (error) {
    console.error('Error al obtener el clima:', error);
    return null;
  }
}