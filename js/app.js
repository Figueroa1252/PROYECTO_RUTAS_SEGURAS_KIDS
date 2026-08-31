import './RouteCard.js';
import { fetchRandomPerson, fetchWeather } from './api.js';

let routes = [
  {
    id: '1',
    name: 'Ruta Norte - Primaria',
    driver: 'Carlos Mendoza',
    time: '06:30',
    students: [
      { name: 'Ana Silva', picture: '' },
      { name: 'Mateo Gómez', picture: '' }
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderRoutes();
  setupEventListeners();
  loadWeatherData();
});

function renderRoutes() {
  const container = document.getElementById('routes-container');
  const selectRoute = document.getElementById('select-route');
  
  container.innerHTML = '';
  selectRoute.innerHTML = '<option value="">-- Seleccione una ruta --</option>';

  routes.forEach(route => {
    // Render Web Component
    const card = document.createElement('route-card');
    card.setAttribute('route-id', route.id);
    card.setAttribute('route-name', route.name);
    card.setAttribute('driver-name', route.driver);
    card.setAttribute('departure-time', route.time);
    card.setAttribute('students', JSON.stringify(route.students));
    container.appendChild(card);

    // Poblar Select
    const option = document.createElement('option');
    option.value = route.id;
    option.textContent = route.name;
    selectRoute.appendChild(option);
  });

  updateKPIs();
}

function updateKPIs() {
  const totalRoutes = routes.length;
  const totalStudents = routes.reduce((acc, r) => acc + r.students.length, 0);

  document.getElementById('kpi-total-routes').textContent = totalRoutes;
  document.getElementById('kpi-total-students').textContent = totalStudents;
}

function setupEventListeners() {
  // Guardar / Editar Ruta
  document.getElementById('route-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-route-id').value;
    const name = document.getElementById('route-name').value.trim();
    const driver = document.getElementById('driver-name').value.trim();
    const time = document.getElementById('departure-time').value;

    if (!name || !driver || !time) return;

    if (id) {
      const index = routes.findIndex(r => r.id === id);
      if (index !== -1) routes[index] = { ...routes[index], name, driver, time };
      document.getElementById('form-title').textContent = 'Crear Nueva Ruta';
      document.getElementById('edit-route-id').value = '';
    } else {
      routes.push({ id: Date.now().toString(), name, driver, time, students: [] });
    }

    e.target.reset();
    renderRoutes();
  });

  // Asignar Estudiante
  document.getElementById('student-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const routeId = document.getElementById('select-route').value;
    const studentName = document.getElementById('student-name').value.trim();

    if (!routeId || !studentName) return;

    const route = routes.find(r => r.id === routeId);
    if (route) {
      route.students.push({ name: studentName, picture: '' });
      e.target.reset();
      renderRoutes();
    }
  });

 // Consumir API Conductor
document.getElementById('btn-fetch-driver').addEventListener('click', async () => {
  const person = await fetchRandomPerson();
  if (person) {
    document.getElementById('driver-name').value = person.name;
  }
});

// Consumir API Estudiante
document.getElementById('btn-fetch-student').addEventListener('click', async () => {
  const person = await fetchRandomPerson();
  if (person) {
    document.getElementById('student-name').value = person.name;
    document.getElementById('student-name').dataset.picture = person.picture;
  }
});

  // Custom Events del Web Component
  document.addEventListener('delete-route', (e) => {
    routes = routes.filter(r => r.id !== e.detail.routeId);
    renderRoutes();
  });

  document.addEventListener('edit-route', (e) => {
    const route = routes.find(r => r.id === e.detail.routeId);
    if (route) {
      document.getElementById('edit-route-id').value = route.id;
      document.getElementById('route-name').value = route.name;
      document.getElementById('driver-name').value = route.driver;
      document.getElementById('departure-time').value = route.time;
      document.getElementById('form-title').textContent = 'Editar Ruta';
    }
  });

  document.addEventListener('delete-student', (e) => {
    const { routeId, studentIndex } = e.detail;
    const route = routes.find(r => r.id === routeId);
    if (route) {
      route.students.splice(studentIndex, 1);
      renderRoutes();
    }
  });
}
async function loadWeatherData() {
  const weather = await fetchWeather();
  if (weather) {
    document.getElementById('weather-temp').textContent = `🌤️ ${weather.temperature} °C`;
  } else {
    document.getElementById('weather-temp').textContent = `⚠️ N/A`;
  }
}