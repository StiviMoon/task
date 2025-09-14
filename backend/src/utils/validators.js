/**
 * Utilidades de validación para el backend
 */

/**
 * Valida si una contraseña cumple con los requisitos de seguridad
 * @param {string} password - Contraseña a validar
 * @returns {boolean} - true si la contraseña es válida, false en caso contrario
 */
const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return false;
  }

  // Mínimo 8 caracteres
  if (password.length < 8) {
    return false;
  }

  // Debe contener al menos una mayúscula
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Debe contener al menos un número
  if (!/\d/.test(password)) {
    return false;
  }

  // Debe contener al menos un carácter especial
  if (!/[^A-Za-z0-9]/.test(password)) {
    return false;
  }

  return true;
};

/**
 * Valida si un email tiene formato válido
 * @param {string} email - Email a validar
 * @returns {boolean} - true si el email es válido, false en caso contrario
 */
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

/**
 * Valida si una edad es válida (mínimo 13 años)
 * @param {number} age - Edad a validar
 * @returns {boolean} - true si la edad es válida, false en caso contrario
 */
const validateAge = (age) => {
  if (typeof age !== 'number' || isNaN(age)) {
    return false;
  }

  return age >= 13 && age <= 120;
};

/**
 * Valida si una hora está en formato HH:mm
 * @param {string} hour - Hora a validar
 * @returns {boolean} - true si la hora es válida, false en caso contrario
 */
const validateHour = (hour) => {
  if (!hour || typeof hour !== 'string') {
    return false;
  }

  const hourRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return hourRegex.test(hour);
};

/**
 * Valida si una fecha no es en el pasado
 * @param {Date} date - Fecha a validar
 * @returns {boolean} - true si la fecha es válida, false en caso contrario
 */
const validateDate = (date) => {
  if (!date) {
    return true; // Fecha opcional
  }

  if (!(date instanceof Date)) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date >= today;
};

module.exports = {
  validatePassword,
  validateEmail,
  validateAge,
  validateHour,
  validateDate
};
