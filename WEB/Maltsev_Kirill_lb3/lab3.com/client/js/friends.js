class FriendsManager {
  constructor() {
    this.users = [];
    this.currentUserId = null;
    this.init();
  }

  async init() {
    await this.loadUsers();
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

  populateUserSelect() {
    const select = document.getElementById('userSelect');
    select.innerHTML = '<option value="">Выберите пользователя</option>';
    
    this.users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = `${user.lastName} ${user.firstName}`;
      select.appendChild(option);
    });
  }

  setupEventListeners() {
    document.getElementById('userSelect').addEventListener('change', (e) => {
      const userId = parseInt(e.target.value);
      if (userId) {
        this.loadFriends(userId);
      } else {
        this.clearFriends();
      }
    });
  }

  async loadFriends(userId) {
    this.currentUserId = userId;
    
    try {
      const response = await fetch(`/api/friends/${userId}`);
      const friends = await response.json();
      this.renderFriends(friends);
    } catch (error) {
      console.error('Ошибка загрузки друзей:', error);
      this.showError('Не удалось загрузить список друзей');
    }
  }

  renderFriends(friends) {
    const container = document.getElementById('friendsList');
    
    if (friends.length === 0) {
      container.innerHTML = '<div class="alert alert-info">У этого пользователя пока нет друзей</div>';
      return;
    }

    container.innerHTML = friends.map(friend => this.createFriendCard(friend)).join('');
  }

  createFriendCard(friend) {
    const statusText = {
      'active': 'Активный',
      'blocked': 'Заблокированный',
      'pending': 'Не подтверждён'
    }[friend.status];

    const statusClass = `status-${friend.status}`;

    return `
      <div class="col-md-6 col-lg-4">
        <div class="friend-card">
          <div class="friend-info">
            <h5>${friend.lastName} ${friend.firstName}</h5>
            <div class="friend-details">
              <p><strong>Email:</strong> ${friend.email}</p>
              <p><strong>Дата рождения:</strong> ${this.formatDate(friend.birthDate)}</p>
              <p><span class="badge ${statusClass}">${statusText}</span></p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  }

  clearFriends() {
    document.getElementById('friendsList').innerHTML = '';
  }

  showError(message) {
    const container = document.getElementById('friendsList');
    container.innerHTML = `<div class="alert alert-danger">${message}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new FriendsManager();
});

