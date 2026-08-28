/**
 * Custom Web Component: <route-card>
 * Representa una tarjeta de ruta escolar con sus estudiantes asignados.
 */
export class RouteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['route-id', 'route-name', 'driver-name', 'departure-time', 'students'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const routeId = this.getAttribute('route-id') || '';
    const routeName = this.getAttribute('route-name') || 'Ruta Sin Nombre';
    const driverName = this.getAttribute('driver-name') || 'Sin Conductor';
    const departureTime = this.getAttribute('departure-time') || '--:--';
    const studentsData = JSON.parse(this.getAttribute('students') || '[]');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .card {
          background: #ffffff;
          border-radius: 8px;
          padding: 1.25rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border-left: 5px solid #2563eb;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }
        .card-header h3 {
          margin: 0;
          color: #1e293b;
          font-size: 1.15rem;
        }
        .time-badge {
          background-color: #e0e7ff;
          color: #3730a3;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: bold;
        }
        .info {
          font-size: 0.9rem;
          color: #475569;
        }
        .students-section {
          margin-top: 0.5rem;
        }
        .students-section h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.95rem;
          color: #0f172a;
        }
        .student-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .student-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
          padding: 0.4rem 0.6rem;
          border-radius: 4px;
          margin-bottom: 0.3rem;
          font-size: 0.85rem;
        }
        .actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        button {
          padding: 0.4rem 0.75rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .btn-edit { background-color: #f59e0b; color: white; }
        .btn-delete { background-color: #dc2626; color: white; }
        .btn-remove-student { 
          background-color: transparent; 
          color: #dc2626; 
          padding: 0 0.2rem;
          font-size: 1rem;
        }
      </style>

      <div class="card">
        <div class="card-header">
          <h3>${routeName}</h3>
          <span class="time-badge">🕒 ${departureTime}</span>
        </div>
        
        <div class="info">
          <strong>Conductor:</strong> ${driverName}
        </div>

        <div class="students-section">
          <h4>Estudiantes (${studentsData.length})</h4>
          <ul class="student-list">
            ${
              studentsData.length === 0
                ? '<li style="color:#94a3b8; font-size: 0.85rem;">No hay estudiantes asignados</li>'
                : studentsData.map((student, index) => `
                    <li class="student-item">
                      <span>👤 ${student}</span>
                      <button class="btn-remove-student" data-index="${index}" title="Eliminar estudiante">✕</button>
                    </li>
                  `).join('')
            }
          </ul>
        </div>

        <div class="actions">
          <button class="btn-edit" id="btn-edit">Editar Ruta</button>
          <button class="btn-delete" id="btn-delete">Eliminar Ruta</button>
        </div>
      </div>
    `;

    this.addEventListeners(routeId);
  }

  addEventListeners(routeId) {
    // Evento personalizado para Eliminar Ruta
    const btnDelete = this.shadowRoot.querySelector('#btn-delete');
    if (btnDelete) {
      btnDelete.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('delete-route', {
          detail: { routeId },
          bubbles: true,
          composed: true
        }));
      });
    }

    // Evento personalizado para Editar Ruta
    const btnEdit = this.shadowRoot.querySelector('#btn-edit');
    if (btnEdit) {
      btnEdit.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('edit-route', {
          detail: { routeId },
          bubbles: true,
          composed: true
        }));
      });
    }

    // Evento personalizado para Eliminar Estudiante
    const removeStudentBtns = this.shadowRoot.querySelectorAll('.btn-remove-student');
    removeStudentBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const studentIndex = parseInt(e.target.getAttribute('data-index'), 10);
        this.dispatchEvent(new CustomEvent('delete-student', {
          detail: { routeId, studentIndex },
          bubbles: true,
          composed: true
        }));
      });
    });
  }
}

// Registrar el Custom Element
customElements.define('route-card', RouteCard);