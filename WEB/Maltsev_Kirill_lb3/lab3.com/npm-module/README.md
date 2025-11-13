# Social Network Utils

Утилиты для работы с данными социальной сети.

## Установка

```bash
npm install social-network-utils
```

## Использование

```javascript
import { formatFullName, calculateAge, validateEmail } from 'social-network-utils';

const user = {
  firstName: 'Иван',
  lastName: 'Иванов',
  middleName: 'Иванович',
  birthDate: '1990-05-15',
  email: 'ivanov@example.com'
};

console.log(formatFullName(user)); // "Иванов Иван Иванович"
console.log(calculateAge(user.birthDate)); // Возраст в годах
console.log(validateEmail(user.email)); // true
```

## API

### formatFullName(user)
Форматирует полное имя пользователя.

### formatDate(dateString)
Форматирует дату в удобочитаемый вид.

### getRoleText(role)
Получает текстовое представление роли.

### getStatusText(status)
Получает текстовое представление статуса.

### validateEmail(email)
Валидация email адреса.

### calculateAge(birthDate)
Вычисляет возраст по дате рождения.

### filterByStatus(users, status)
Фильтрует пользователей по статусу.

### filterByRole(users, role)
Фильтрует пользователей по роли.

