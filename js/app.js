import './RouteCard.js';
import { fetchRandomPerson } from './api.js';
import { validateRequired, validateSelect } from './validators.js';

// Estado global de la aplicación
let routes = [
  {
    id: '1',
    name: 'Ruta Norte - Primaria',
    driver: 'Carlos Mendoza',
    time: '06:30',
    students: ['Ana Silva', 'Mateo Gómez']
  }
];

// Referencias del DOM
const routeForm = document.getElementById('route-form');
const studentForm = document.getElementById('student-form');
const inputRouteId = document.getElementById('route-id');
const inputRouteName = document.getElementById('route-name');
const inputDriverName = document.getElementById('driver-name');
const inputDepartureTime = document.getElementById('departure-time');
const selectRoute = document.getElementById('select-route');
const inputStudentName = document.getElementById('student-name');
const routesList = document.getElementById('routes-list');

const btnGenerateApiDriver = document.getElementById('btn-generate-api');
const btnRandomStudent = document.getElementById('btn-random-student');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  renderRoutes();
  updateSelectOptions();
  setupEventListeners();
});

function setupEventListeners() {
  // Guardar o Editar Ruta
  routeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateRouteForm()) return;

    const id = inputRouteId.value;
    const name = inputRouteName.value.trim();
    const driver = inputDriverName.value.trim();
    const time = inputDepartureTime.value;

    if (id) {
      // Editar ruta existente
      const route = routes.find(r => r.id === id);
      if (route) {
        route.name = name;
        route.driver = driver;
        route.time = time;
      }
    } else {
      // Crear nueva ruta
      const newRoute = {
        id: Date.now().toString(),
        name,
        driver,
        time,
        students: []
      };
      routes.push(newRoute);
    }

    resetRouteForm();
    renderRoutes();
    updateSelectOptions();
  });

  // Asignar Estudiante a una Ruta
  studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStudentForm()) return;

    const routeId = selectRoute.value;
    const studentName = inputStudentName.value.trim();

    const route = routes.find(r => r.id === routeId);
    if (route) {
      route.students.push(studentName);
      inputStudentName.value = '';
      renderRoutes();
    }
  });

  // Consumir API pública para Autocompletar Conductor
  btnGenerateApiDriver.addEventListener('click', async () => {
    try {
      btnGenerateApiDriver.disabled = true;
      btnGenerateApiDriver.textContent = 'Cargando...';
      const person = await fetchRandomPerson();
      inputDriverName.value = person.name;
    } catch (err) {
      alert('No se pudo obtener el conductor de la API.');
    } finally {
      btnGenerateApiDriver.disabled = false;
      btnGenerateApiDriver.textContent = 'Cargar Conductor (API)';
    }
  });

  // Consumir API pública para Autocompletar Estudiante
  btnRandomStudent.addEventListener('click', async () => {
    try {
      btnRandomStudent.disabled = true;
      btnRandomStudent.textContent = 'Cargando...';
      const person = await fetchRandomPerson();
      inputStudentName.value = person.name;
    } catch (err) {
      alert('No se pudo obtener el estudiante de la API.');
    } finally {
      btnRandomStudent.disabled = false;
      btnRandomStudent.textContent = 'Obtener de API';
    }
  });

  // Escuchar CustomEvents emitidos desde los Web Components <route-card>
  routesList.addEventListener('delete-route', (e) => {
    const { routeId } = e.detail;
    routes = routes.filter(r => r.id !== routeId);
    renderRoutes();
    updateSelectOptions();
  });

  routesList.addEventListener('edit-route', (e) => {
    const { routeId } = e.detail;
    const route = routes.find(r => r.id === routeId);
    if (route) {
      inputRouteId.value = route.id;
      inputRouteName.value = route.name;
      inputDriverName.value = route.driver;
      inputDepartureTime.value = route.time;
      document.getElementById('btn-save-route').textContent = 'Actualizar Ruta';
    }
  });

  routesList.addEventListener('delete-student', (e) => {
    const { routeId, studentIndex } = e.detail;
    const route = routes.find(r => r.id === routeId);
    if (route) {
      route.students.splice(studentIndex, 1);
      renderRoutes();
    }
  });
}

// Renderizado de las tarjetas <route-card>
function renderRoutes() {
  routesList.innerHTML = '';
  
  if (routes.length === 0) {
    routesList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">No hay rutas registradas.</p>';
    return;
  }

  routes.forEach(route => {
    const card = document.createElement('route-card');
    card.setAttribute('route-id', route.id);
    card.setAttribute('route-name', route.name);
    card.setAttribute('driver-name', route.driver);
    card.setAttribute('departure-time', route.time);
    card.setAttribute('students', JSON.stringify(route.students));
    routesList.appendChild(card);
  });
}

// Actualizar las opciones del select de rutas
function updateSelectOptions() {
  selectRoute.innerHTML = '<option value="">-- Seleccione una ruta --</option>';
  routes.forEach(route => {
    const option = document.createElement('option');
    option.value = route.id;
    option.textContent = route.name;
    selectRoute.appendChild(option);
  });
}

// Validaciones
function validateRouteForm() {
  const isNameValid = validateRequired(inputRouteName, document.getElementById('error-name'), 'Ingrese el nombre de la ruta');
  const isDriverValid = validateRequired(inputDriverName, document.getElementById('error-driver'), 'Ingrese el nombre del conductor');
  const isTimeValid = validateRequired(inputDepartureTime, document.getElementById('error-time'), 'Seleccione la hora de salida');
  return isNameValid && isDriverValid && isTimeValid;
}

function validateStudentForm() {
  const isSelectValid = validateSelect(selectRoute, document.getElementById('error-select-route'), 'Seleccione una ruta válida');
  const isStudentValid = validateRequired(inputStudentName, document.getElementById('error-student'), 'Ingrese el nombre del estudiante');
  return isSelectValid && isStudentValid;
}

function resetRouteForm() {
  routeForm.reset();
  inputRouteId.value = '';
  document.getElementById('btn-save-route').textContent = 'Guardar Ruta';
}