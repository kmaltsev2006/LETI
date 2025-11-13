import express from 'express';
import https from 'https';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3112;

// CORS для запросов от модуля пользователя
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(bodyParser.json());
app.use(express.static(join(__dirname, 'public')));

async function readJsonFile(filename) {
  const data = await readFile(join(__dirname, 'data', filename), 'utf-8');
  return JSON.parse(data);
}

async function writeJsonFile(filename, data) {
  await writeFile(join(__dirname, 'data', filename), JSON.stringify(data, null, 2));
}

// Валидация имени (только буквы, кириллица и латиница)
function validateName(name, fieldName) {
  if (!name || name.trim().length === 0) {
    return `${fieldName} обязательно для заполнения`;
  }
  
  // Проверяем что только буквы (кириллица, латиница), дефис и пробел
  const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s-]+$/;
  if (!nameRegex.test(name)) {
    return `${fieldName} должно содержать только буквы (без цифр и спецсимволов)`;
  }
  
  return null; // Валидация прошла
}

app.get('/api/users', async (req, res) => {
  try {
    const users = await readJsonFile('users.json');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const users = await readJsonFile('users.json');
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
      // Убираем пароль из ответа
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(404).json({ error: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

// Вход пользователя
app.post('/api/users/login', async (req, res) => {
  try {
    const users = await readJsonFile('users.json');
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Проверка блокировки
    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'Ваш аккаунт заблокирован. Обратитесь к администратору.' });
    }

    // Убираем пароль из ответа
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

app.post('/api/users/register', async (req, res) => {
  try {
    const users = await readJsonFile('users.json');
    const { firstName, lastName, middleName, birthDate, email, password } = req.body;

    // Валидация имени, фамилии, отчества
    const firstNameError = validateName(firstName, 'Имя');
    if (firstNameError) {
      return res.status(400).json({ error: firstNameError });
    }

    const lastNameError = validateName(lastName, 'Фамилия');
    if (lastNameError) {
      return res.status(400).json({ error: lastNameError });
    }

    const middleNameError = validateName(middleName, 'Отчество');
    if (middleNameError) {
      return res.status(400).json({ error: middleNameError });
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email уже используется' });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({ error: 'Пароль должен быть минимум 4 символа' });
    }

    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      middleName: middleName.trim(),
      birthDate,
      email,
      password,
      role: 'user',
      status: 'active',
      photo: '/images/default.jpg'
    };

    users.push(newUser);
    await writeJsonFile('users.json', users);
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка регистрации пользователя' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const users = await readJsonFile('users.json');
    
    // Валидация имени, фамилии, отчества
    if (req.body.firstName) {
      const firstNameError = validateName(req.body.firstName, 'Имя');
      if (firstNameError) {
        return res.status(400).json({ error: firstNameError });
      }
      req.body.firstName = req.body.firstName.trim();
    }

    if (req.body.lastName) {
      const lastNameError = validateName(req.body.lastName, 'Фамилия');
      if (lastNameError) {
        return res.status(400).json({ error: lastNameError });
      }
      req.body.lastName = req.body.lastName.trim();
    }

    if (req.body.middleName) {
      const middleNameError = validateName(req.body.middleName, 'Отчество');
      if (middleNameError) {
        return res.status(400).json({ error: middleNameError });
      }
      req.body.middleName = req.body.middleName.trim();
    }
    
    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      ...req.body,
      photo: '/images/default.jpg'
    };
    users.push(newUser);
    await writeJsonFile('users.json', users);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания пользователя' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const users = await readJsonFile('users.json');
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Валидация имени, фамилии, отчества (если они обновляются)
    if (req.body.firstName) {
      const firstNameError = validateName(req.body.firstName, 'Имя');
      if (firstNameError) {
        return res.status(400).json({ error: firstNameError });
      }
      req.body.firstName = req.body.firstName.trim();
    }

    if (req.body.lastName) {
      const lastNameError = validateName(req.body.lastName, 'Фамилия');
      if (lastNameError) {
        return res.status(400).json({ error: lastNameError });
      }
      req.body.lastName = req.body.lastName.trim();
    }

    if (req.body.middleName) {
      const middleNameError = validateName(req.body.middleName, 'Отчество');
      if (middleNameError) {
        return res.status(400).json({ error: middleNameError });
      }
      req.body.middleName = req.body.middleName.trim();
    }

    users[index] = { ...users[index], ...req.body, id: parseInt(req.params.id) };
    await writeJsonFile('users.json', users);
    res.json(users[index]);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления данных' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    let users = await readJsonFile('users.json');
    users = users.filter(u => u.id !== userId);
    await writeJsonFile('users.json', users);
    
    let friends = await readJsonFile('friends.json');
    friends = friends.filter(f => f.userId !== userId && f.friendId !== userId);
    await writeJsonFile('friends.json', friends);
    
    let news = await readJsonFile('news.json');
    news = news.filter(n => n.userId !== userId);
    await writeJsonFile('news.json', news);
    
    res.json({ success: true, message: 'Пользователь удалён' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления пользователя' });
  }
});

app.get('/api/friends/:userId', async (req, res) => {
  try {
    const friends = await readJsonFile('friends.json');
    const users = await readJsonFile('users.json');
    const userId = parseInt(req.params.userId);
    
    const userFriends = friends
      .filter(f => f.userId === userId)
      .map(f => users.find(u => u.id === f.friendId))
      .filter(u => u !== undefined);
    
    res.json(userFriends);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

app.post('/api/friends', async (req, res) => {
  try {
    const friends = await readJsonFile('friends.json');
    const { userId, friendId } = req.body;
    const userIdInt = parseInt(userId);
    const friendIdInt = parseInt(friendId);
    
    const exists = friends.some(f => 
      f.userId === userIdInt && f.friendId === friendIdInt
    );
    
    if (exists) {
      return res.status(400).json({ error: 'Этот пользователь уже в друзьях' });
    }
    
    friends.push({ userId: userIdInt, friendId: friendIdInt });
    friends.push({ userId: friendIdInt, friendId: userIdInt });
    
    await writeJsonFile('friends.json', friends);
    res.status(201).json({ userId: userIdInt, friendId: friendIdInt });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка добавления друга' });
  }
});

app.delete('/api/friends/:userId/:friendId', async (req, res) => {
  try {
    let friends = await readJsonFile('friends.json');
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);
    
    friends = friends.filter(f => 
      !(f.userId === userId && f.friendId === friendId) &&
      !(f.userId === friendId && f.friendId === userId)
    );
    
    await writeJsonFile('friends.json', friends);
    res.json({ success: true, message: 'Друг удалён' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления друга' });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const news = await readJsonFile('news.json');
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

// Создать новость
app.post('/api/news', async (req, res) => {
  try {
    const news = await readJsonFile('news.json');
    const users = await readJsonFile('users.json');
    const { userId, title, content } = req.body;

    const newNews = {
      id: Math.max(...news.map(n => n.id), 0) + 1,
      userId: parseInt(userId),
      title,
      content,
      date: new Date().toISOString(),
      status: 'active'
    };

    news.push(newNews);
    await writeJsonFile('news.json', news);
    
    // Добавляем автора в ответ
    const author = users.find(u => u.id === newNews.userId);
    res.status(201).json({ ...newNews, author });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания новости' });
  }
});

app.get('/api/news/user/:userId', async (req, res) => {
  try {
    const news = await readJsonFile('news.json');
    const friends = await readJsonFile('friends.json');
    const users = await readJsonFile('users.json');
    const userId = parseInt(req.params.userId);
    
    // Получаем ID друзей
    const friendIds = friends
      .filter(f => f.userId === userId)
      .map(f => f.friendId);
    
    const userNews = news
      .filter(n => {

        if (n.status !== 'active') return false;
        
 
        if (n.userId !== userId && !friendIds.includes(n.userId)) return false;
        
      
        const author = users.find(u => u.id === n.userId);
        if (!author || author.status === 'blocked') return false;
        
        return true;
      })
      .map(n => {
        const author = users.find(u => u.id === n.userId);
        const { password, ...authorWithoutPassword } = author || {};
        return { ...n, author: authorWithoutPassword };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(userNews);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

app.put('/api/news/:id', async (req, res) => {
  try {
    const news = await readJsonFile('news.json');
    const index = news.findIndex(n => n.id === parseInt(req.params.id));
    
    if (index !== -1) {
      news[index] = { ...news[index], ...req.body, id: parseInt(req.params.id) };
      await writeJsonFile('news.json', news);
      res.json(news[index]);
    } else {
      res.status(404).json({ error: 'Новость не найдена' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления данных' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.get('/users/:id', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'user-detail.html'));
});

app.get('/friends.html', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'friends.html'));
});

app.get('/news.html', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'news.html'));
});

async function startServer() {
  try {
    const options = {
      key: await readFile(join(__dirname, 'certs', 'server.key')),
      cert: await readFile(join(__dirname, 'certs', 'server.cert'))
    };

    https.createServer(options, app).listen(PORT, () => {
      console.log(`HTTPS сервер запущен на https://localhost:${PORT}`);
    });
  } catch (error) {
    console.log('Сертификаты не найдены, запускаем HTTP сервер');
    app.listen(PORT, () => {
      console.log(`HTTP сервер запущен на http://localhost:${PORT}`);
    });
  }
}

startServer();
