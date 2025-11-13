class NewsManager {
  constructor() {
    this.users = [];
    this.news = [];
    this.currentUserId = null;
    this.init();
  }

  async init() {
    await Promise.all([
      this.loadUsers(),
      this.loadNews()
    ]);
    this.setupEventListeners();
  }

  async loadUsers() {
    try {
      const response = await fetch('/api/users');
      this.users = await response.json();
      this.populateUserSelect();
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
  }

  async loadNews(userId = null) {
    try {
      const url = userId 
        ? `/api/news/user/${userId}`
        : '/api/news';
      
      const response = await fetch(url);
      this.news = await response.json();
      this.renderNews();
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
      this.showError('Не удалось загрузить новости');
    }
  }

  populateUserSelect() {
    const select = document.getElementById('userSelect');
    select.innerHTML = '<option value="">Все новости</option>';
    
    this.users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = `${user.lastName} ${user.firstName}`;
      select.appendChild(option);
    });
  }

  setupEventListeners() {
    document.getElementById('userSelect').addEventListener('change', (e) => {
      const userId = e.target.value ? parseInt(e.target.value) : null;
      this.currentUserId = userId;
      this.loadNews(userId);
    });

    document.getElementById('newsList').addEventListener('click', async (e) => {
      if (e.target.classList.contains('toggle-status-btn')) {
        const newsId = parseInt(e.target.dataset.id);
        const currentStatus = e.target.dataset.status;
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        await this.toggleNewsStatus(newsId, newStatus);
      }
    });
  }

  async toggleNewsStatus(newsId, newStatus) {
    try {
      const response = await fetch(`/api/news/${newsId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await this.loadNews(this.currentUserId);
      } else {
        throw new Error('Ошибка обновления статуса');
      }
    } catch (error) {
      console.error('Ошибка изменения статуса новости:', error);
      alert('Не удалось изменить статус новости');
    }
  }

  renderNews() {
    const container = document.getElementById('newsList');
    
    if (this.news.length === 0) {
      container.innerHTML = '<div class="alert alert-info">Новостей не найдено</div>';
      return;
    }

    container.innerHTML = this.news.map(item => this.createNewsCard(item)).join('');
  }

  createNewsCard(newsItem) {
    const author = this.users.find(u => u.id === newsItem.userId);
    const authorName = author 
      ? `${author.lastName} ${author.firstName}`
      : 'Неизвестный пользователь';

    const isBlocked = newsItem.status === 'blocked';
    const blockedClass = isBlocked ? 'blocked' : '';
    const buttonText = isBlocked ? 'Активировать' : 'Заблокировать';
    const buttonClass = isBlocked ? 'btn-success' : 'btn-danger';

    return `
      <div class="news-card ${blockedClass}">
        <div class="news-header">
          <h4>${newsItem.title}</h4>
          <div class="news-actions">
            <button 
              class="btn btn-sm ${buttonClass} toggle-status-btn" 
              data-id="${newsItem.id}"
              data-status="${newsItem.status}">
              ${buttonText}
            </button>
          </div>
        </div>
        <div class="news-meta">
          Автор: ${authorName} | ${this.formatDate(newsItem.date)}
        </div>
        <div class="news-content">
          ${newsItem.content}
        </div>
        ${isBlocked ? '<div class="badge bg-danger mt-2">Заблокировано</div>' : ''}
      </div>
    `;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  showError(message) {
    const container = document.getElementById('newsList');
    container.innerHTML = `<div class="alert alert-danger">${message}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new NewsManager();
});

