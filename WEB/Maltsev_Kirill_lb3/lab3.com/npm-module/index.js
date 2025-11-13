// Утилиты для форматирования данных социальной сети

/**
 * Форматирует полное имя пользователя
 * @param {Object} user - Объект пользователя
 * @returns {string} Полное имя
 */
export function formatFullName(user) {
  return `${user.lastName} ${user.firstName} ${user.middleName}`;
}

/**
 * Форматирует дату в удобочитаемый вид
 * @param {string} dateString - Дата в формате ISO
 * @returns {string} Отформатированная дата
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}

/**
 * Получает текстовое представление роли
 * @param {string} role - Роль пользователя
 * @returns {string} Текст роли
 */
export function getRoleText(role) {
  const roles = {
    'admin': 'Администратор',
    'user': 'Пользователь'
  };
  return roles[role] || 'Неизвестная роль';
}

/**
 * Получает текстовое представление статуса
 * @param {string} status - Статус пользователя
 * @returns {string} Текст статуса
 */
export function getStatusText(status) {
  const statuses = {
    'active': 'Активный',
    'blocked': 'Заблокированный',
    'pending': 'Не подтверждён'
  };
  return statuses[status] || 'Неизвестный статус';
}

/**
 * Валидация email
 * @param {string} email - Email для проверки
 * @returns {boolean} Результат валидации
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Вычисление возраста по дате рождения
 * @param {string} birthDate - Дата рождения
 * @returns {number} Возраст в годах
 */
export function calculateAge(birthDate) {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Фильтрация пользователей по статусу
 * @param {Array} users - Массив пользователей
 * @param {string} status - Статус для фильтрации
 * @returns {Array} Отфильтрованный массив
 */
export function filterByStatus(users, status) {
  return users.filter(user => user.status === status);
}

/**
 * Фильтрация пользователей по роли
 * @param {Array} users - Массив пользователей
 * @param {string} role - Роль для фильтрации
 * @returns {Array} Отфильтрованный массив
 */
export function filterByRole(users, role) {
  return users.filter(user => user.role === role);
}

export default {
  formatFullName,
  formatDate,
  getRoleText,
  getStatusText,
  validateEmail,
  calculateAge,
  filterByStatus,
  filterByRole
};

