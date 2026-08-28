# Rutas Seguras Kids - Sistema Frontend de Transporte Escolar

Sistema de gestión frontend desarrollado dinámicamente con JavaScript puro (Vanilla JS), CSS3 y HTML5 sin uso de frameworks ni librerías externas. La aplicación permite organizar rutas escolares, gestionar asignaciones de estudiantes, actualizar información en tiempo real y consumir perfiles aleatorios desde una API pública.

---

## 🚀 Características y Requerimientos Implementados

* **Manipulación Dinámica del DOM:** Creación, edición y eliminación de rutas y estudiantes sin recargar la página.
* **Componentes Reutilizables (Web Components):** Implementación del custom element `<route-card>` encapsulado mediante Shadow DOM y plantillas HTML.
* **Eventos Personalizados (`CustomEvent`):** Comunicación bidireccional entre los Web Components y la lógica principal del sistema.
* **Consumo de API Pública:** Integración de **Random User Generator API** (`https://randomuser.me/api/`) utilizando `fetch` y `async/await` para la carga automática de conductores y estudiantes.
* **Validación de Formularios:** Control de campos obligatorios e indicación visual de errores mediante un módulo independiente.
* **Diseño Responsivo (3 Breakpoints):**
  * **Mobile:** `< 640px` (Vista apilada en una columna)
  * **Tablet:** `641px - 1024px` (Formularios lado a lado y grilla de 2 columnas)
  * **Desktop:** `> 1025px` (Grilla principal de 3 columnas)

---

## 📁 Estructura del Proyecto

```text
PROYECTO_RUTAS_SEGURAS_KIDS/
│
├── index.html            # Maquetación principal de la interfaz
├── README.md             # Documentación del proyecto
│
├── css/
│   ├── styles.css        # Estilos generales, resets y variables CSS
│   ├── components.css    # Estilos auxiliares para Web Components
│   └── responsive.css    # Definición de los 3 breakpoints media queries
│
└── js/
    ├── app.js            # Controlador principal y gestión del estado
    ├── RouteCard.js      # Web Component <route-card> (Shadow DOM)
    ├── api.js            # Servicio de consumo de API pública (fetch / async-await)
    └── validators.js     # Funciones para la validación de formularios