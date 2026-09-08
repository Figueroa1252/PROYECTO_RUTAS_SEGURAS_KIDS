export class RouteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['route-id', 'route-name', 'driver-name', 'departure-time', 'students'];
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const routeId = this.getAttribute('route-id') || '';
    const routeName = this.getAttribute('route-name') || 'Ruta Sin Nombre';
    const driverName = this.getAttribute('driver-name') || 'Sin Conductor';
    const departureTime = this.getAttribute('departure-time') || '--:--';
    const studentsData = JSON.parse(this.getAttribute('students') || '[]');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .card {
          background: #ffffff;
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          display: flex; flex-direction: column; gap: 1rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .card-header { display: flex; justify-content: space-between; align-items: center; }
        .card-header h3 { font-size: 1.1rem; color: #0f172a; margin: 0; }
        .time-badge { background: #eff6ff; color: #2563eb; padding: 0.25rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
        .driver-info { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #475569; background: #f8fafc; padding: 0.5rem; border-radius: 8px; }
        .student-list { list-style: none; padding: 0; margin: 0.5rem 0 0 0; }
        .student-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.4rem 0; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem;
        }
        .student-profile { display: flex; align-items: center; gap: 0.6rem; }
        .avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
        .actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
        button { flex: 1; padding: 0.4rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.8rem; }
        .btn-edit { background: #fef3c7; color: #d97706; }
        .btn-delete { background: #fee2e2; color: #dc2626; }
        .btn-remove-student { background: none; color: #94a3b8; border: none; cursor: pointer; font-size: 1rem; flex: none; }
        .btn-remove-student:hover { color: #dc2626; }
      </style>

      <div class="card">
        <div class="card-header">
          <h3>${routeName}</h3>
          <span class="time-badge">🕒 ${departureTime}</span>
        </div>
        
        <div class="driver-info">
          <span>🚍 <strong>Conductor:</strong> ${driverName}</span>
        </div>

        <div>
          <small style="color: #64748b; font-weight: 600;">Estudiantes Asignados (${studentsData.length})</small>
          <ul class="student-list">
            ${studentsData.length === 0
        ? '<li style="color:#94a3b8; font-size: 0.8rem; padding: 0.5rem 0;">Ningún estudiante en la ruta</li>'
        : studentsData.map((st, index) => {
          const name = typeof st === 'object' ? st.name : st;
          const photo = (typeof st === 'object' && st.picture)
            ? st.picture
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff&size=64`;

          return `
                      <li class="student-item">
                        <div class="student-profile">
                          <img class="avatar" src="${photo}" alt="${name}">
                          <span>${name}</span>
                        </div>
                        <button class="btn-remove-student" data-index="${index}">✕</button>
                      </li>
                    `;
        }).join('')
      }
          </ul>
        </div>

        <div class="actions">
          <button class="btn-edit" id="btn-edit">Editar</button>
          <button class="btn-delete" id="btn-delete">Eliminar</button>
        </div>
      </div>
    `;

    this.addEventListeners(routeId);
  }

  addEventListeners(routeId) {
    this.shadowRoot.querySelector('#btn-delete')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('delete-route', { detail: { routeId }, bubbles: true, composed: true }));
    });

    this.shadowRoot.querySelector('#btn-edit')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('edit-route', { detail: { routeId }, bubbles: true, composed: true }));
    });

    this.shadowRoot.querySelectorAll('.btn-remove-student').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const studentIndex = parseInt(e.target.getAttribute('data-index'), 10);
        this.dispatchEvent(new CustomEvent('delete-student', { detail: { routeId, studentIndex }, bubbles: true, composed: true }));
      });
    });
  }
}

customElements.define('route-card', RouteCard);