class UserDetailManager {
  constructor() {
    this.userId = null;
    this.user = null;
    this.friends = [];
    this.allUsers = [];
    this.addFriendModal = null;
    this.init();
  }

  async init() {
    const pathParts = window.location.pathname.split('/');
    this.userId = parseInt(pathParts[pathParts.length - 1]);

    if (!this.userId || isNaN(this.userId)) {
      alert('Неверный ID пользователя');
      window.location.href = '/';
      return;
    }

    this.addFriendModal = new bootstrap.Modal(document.getElementById('addFriendModal'));

    await this.loadData();
    this.setupEventListeners();
  }

  async loadData() {
    try {
      const userResponse = await fetch(`/api/users/${this.userId}`);
      if (!userResponse.ok) {
        throw new Error('Пользователь не найден');
      }
      this.user = await userResponse.json();

      const usersResponse = await fetch('/api/users');
      this.allUsers = await usersResponse.json();

      await this.loadFriends();

      this.renderUserInfo();
      this.renderFriends();
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      alert('Не удалось загрузить данные пользователя');
      window.location.href = '/';
    }
  }

  async loadFriends() {
    try {
      const response = await fetch(`/api/friends/${this.userId}`);
      this.friends = await response.json();
    } catch (error) {
      console.error('Ошибка загрузки друзей:', error);
      this.friends = [];
    }
  }

  renderUserInfo() {
    document.getElementById('userId').value = this.user.id;
    document.getElementById('firstName').value = this.user.firstName;
    document.getElementById('lastName').value = this.user.lastName;
    document.getElementById('middleName').value = this.user.middleName;
    document.getElementById('birthDate').value = this.user.birthDate;
    document.getElementById('email').value = this.user.email;
    document.getElementById('role').value = this.user.role;
    document.getElementById('status').value = this.user.status;
  }

  renderFriends() {
    const container = document.getElementById('friendsList');

    if (this.friends.length === 0) {
      container.innerHTML = '<div class="alert alert-info">У этого пользователя пока нет друзей</div>';
      return;
    }

    container.innerHTML = this.friends.map(friend => this.createFriendCard(friend)).join('');
  }

  createFriendCard(friend) {
    const statusClass = `status-${friend.status}`;
    const statusText = {
      'active': 'Активный',
      'blocked': 'Заблокированный',
      'pending': 'Не подтверждён'
    }[friend.status];

    return `
      <div class="card mb-2">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-1">
              <a href="/users/${friend.id}">${friend.lastName} ${friend.firstName} ${friend.middleName}</a>
            </h6>
            <small class="text-muted">${friend.email}</small>
            <span class="badge ${statusClass} ms-2">${statusText}</span>
          </div>
          <button class="btn btn-sm btn-danger remove-friend-btn" data-friend-id="${friend.id}">
            Удалить
          </button>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    document.getElementById('userForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.saveUser();
    });

    document.getElementById('deleteUserBtn').addEventListener('click', () => {
      this.deleteUser();
    });

    document.getElementById('friendsList').addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-friend-btn')) {
        const friendId = parseInt(e.target.dataset.friendId);
        this.removeFriend(friendId);
      }
    });

    document.getElementById('addFriendBtn').addEventListener('click', () => {
      this.openAddFriendModal();
    });

    document.getElementById('saveFriendBtn').addEventListener('click', () => {
      this.addFriend();
    });
  }

  async saveUser() {
    const userData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      middleName: document.getElementById('middleName').value,
      birthDate: document.getElementById('birthDate').value,
      email: document.getElementById('email').value,
      role: document.getElementById('role').value,
      status: document.getElementById('status').value
    };

    try {
      const response = await fetch(`/api/users/${this.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        this.user = await response.json();
        alert('Изменения сохранены');
      } else {
        throw new Error('Ошибка сохранения');
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить изменения');
    }
  }

  async deleteUser() {
    const confirmText = `Вы уверены, что хотите удалить пользователя ${this.user.lastName} ${this.user.firstName}?`;
    if (!confirm(confirmText)) return;

    try {
      const response = await fetch(`/api/users/${this.userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Пользователь удалён');
        window.location.href = '/';
      } else {
        throw new Error('Ошибка удаления');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Не удалось удалить пользователя');
    }
  }

  async removeFriend(friendId) {
    try {
      const response = await fetch(`/api/friends/${this.userId}/${friendId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await this.loadFriends();
        this.renderFriends();
      } else {
        throw new Error('Ошибка удаления друга');
      }
    } catch (error) {
      console.error('Ошибка удаления друга:', error);
      alert('Не удалось удалить друга');
    }
  }

  openAddFriendModal() {
    const select = document.getElementById('friendSelect');
    select.innerHTML = '<option value="">Выберите пользователя</option>';

    const friendIds = this.friends.map(f => f.id);
    const availableUsers = this.allUsers.filter(u => 
      u.id !== this.userId && !friendIds.includes(u.id)
    );

    if (availableUsers.length === 0) {
      select.innerHTML = '<option value="">Нет доступных пользователей</option>';
    } else {
      availableUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.lastName} ${user.firstName} ${user.middleName}`;
        select.appendChild(option);
      });
    }

    this.addFriendModal.show();
  }

  async addFriend() {
    const friendId = parseInt(document.getElementById('friendSelect').value);
    if (!friendId) {
      alert('Выберите пользователя');
      return;
    }

    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: this.userId,
          friendId: friendId
        })
      });

      if (response.ok) {
        await this.loadFriends();
        this.renderFriends();
        this.addFriendModal.hide();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка добавления друга');
      }
    } catch (error) {
      console.error('Ошибка добавления друга:', error);
      alert(error.message || 'Не удалось добавить друга');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new UserDetailManager();
});

