/**
 * Módulo de validación para los formularios del proyecto
 */

/**
 * Valida un campo de texto genérico (no vacío y longitud mínima)
 * @param {HTMLInputElement} input 
 * @param {HTMLElement} errorElement 
 * @param {string} message 
 * @returns {boolean}
 */
export function validateRequired(input, errorElement, message = 'Este campo es obligatorio') {
  if (!input.value || input.value.trim() === '') {
    showError(input, errorElement, message);
    return false;
  }
  clearError(input, errorElement);
  return true;
}

/**
 * Valida la selección de un dropdown/select
 * @param {HTMLSelectElement} select 
 * @param {HTMLElement} errorElement 
 * @param {string} message 
 * @returns {boolean}
 */
export function validateSelect(select, errorElement, message = 'Debe seleccionar una opción') {
  if (!select.value || select.value === '') {
    showError(select, errorElement, message);
    return false;
  }
  clearError(select, errorElement);
  return true;
}

/**
 * Muestra el mensaje de error y aplica la clase de estilo inválido
 */
function showError(element, errorElement, message) {
  element.classList.add('invalid');
  if (errorElement) {
    errorElement.textContent = message;
  }
}

/**
 * Limpia el estado de error
 */
function clearError(element, errorElement) {
  element.classList.remove('invalid');
  if (errorElement) {
    errorElement.textContent = '';
  }
}