class UserManager {
  constructor() {
    this.users = [];
    this.modal = null;
    this.currentUserId = null;
    this.init();
  }

  async init() {
    this.modal = new bootstrap.Modal(document.getElementById('editModal'));
    await this.loadUsers();
    this.setupEventListeners();
  }

  async loadUsers() {
    try {
      const response = await fetch('/api/users');
      this.users = await response.json();
      this.renderUsers();
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      this.showError('Не удалось загрузить список пользователей');
    }
  }

  renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    this.users.forEach(user => {
      const row = this.createUserRow(user);
      tbody.appendChild(row);
    });
  }

  createUserRow(user) {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    
    const fullName = `${user.lastName} ${user.firstName} ${user.middleName}`;
    const roleClass = user.role === 'admin' ? 'role-admin' : 'role-user';
    const statusClass = `status-${user.status}`;
    
    const roleText = user.role === 'admin' ? 'Администратор' : 'Пользователь';
    const statusText = {
      'active': 'Активный',
      'blocked': 'Заблокированный',
      'pending': 'Не подтверждён'
    }[user.status];

    tr.innerHTML = `
      <td class="user-row" data-id="${user.id}">${fullName}</td>
      <td class="user-row" data-id="${user.id}">${this.formatDate(user.birthDate)}</td>
      <td class="user-row" data-id="${user.id}">${user.email}</td>
      <td class="user-row" data-id="${user.id}"><span class="badge ${roleClass}">${roleText}</span></td>
      <td class="user-row" data-id="${user.id}"><span class="badge ${statusClass}">${statusText}</span></td>
      <td>
        <button class="btn btn-sm btn-primary edit-btn" data-id="${user.id}">
          Редактировать
        </button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${user.id}">
          Удалить
        </button>
      </td>
    `;

    return tr;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  }

  setupEventListeners() {
    document.getElementById('usersTableBody').addEventListener('click', (e) => {
      if (e.target.classList.contains('user-row')) {
        const userId = e.target.dataset.id;
        window.location.href = `/users/${userId}`;
      } else if (e.target.classList.contains('edit-btn')) {
        const userId = parseInt(e.target.dataset.id);
        this.openEditModal(userId);
      } else if (e.target.classList.contains('delete-btn')) {
        const userId = parseInt(e.target.dataset.id);
        this.deleteUser(userId);
      }
    });

    document.getElementById('addUserBtn').addEventListener('click', () => {
      this.openAddModal();
    });

    document.getElementById('saveUserBtn').addEventListener('click', () => {
      this.saveUser();
    });
  }

  openAddModal() {
    this.currentUserId = null;
    document.getElementById('editUserId').value = '';
    document.getElementById('editFirstName').value = '';
    document.getElementById('editLastName').value = '';
    document.getElementById('editMiddleName').value = '';
    document.getElementById('editBirthDate').value = '';
    document.getElementById('editEmail').value = '';
    document.getElementById('editPassword').value = '';
    document.getElementById('editRole').value = 'user';
    document.getElementById('editStatus').value = 'pending';
    
    document.querySelector('.modal-title').textContent = 'Добавить пользователя';
    this.modal.show();
  }

  openEditModal(userId) {
    this.currentUserId = userId;
    const user = this.users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('editUserId').value = user.id;
    document.getElementById('editFirstName').value = user.firstName;
    document.getElementById('editLastName').value = user.lastName;
    document.getElementById('editMiddleName').value = user.middleName;
    document.getElementById('editBirthDate').value = user.birthDate;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editPassword').value = user.password;
    document.getElementById('editRole').value = user.role;
    document.getElementById('editStatus').value = user.status;

    document.querySelector('.modal-title').textContent = 'Редактировать пользователя';
    this.modal.show();
  }

  async saveUser() {
    const userData = {
      firstName: document.getElementById('editFirstName').value,
      lastName: document.getElementById('editLastName').value,
      middleName: document.getElementById('editMiddleName').value,
      birthDate: document.getElementById('editBirthDate').value,
      email: document.getElementById('editEmail').value,
      password: document.getElementById('editPassword').value,
      role: document.getElementById('editRole').value,
      status: document.getElementById('editStatus').value
    };

    try {
      let response;
      if (this.currentUserId) {
        response = await fetch(`/api/users/${this.currentUserId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
      } else {
        response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
      }

      if (response.ok) {
        await this.loadUsers();
        this.modal.hide();
        this.showSuccess(this.currentUserId ? 'Данные обновлены' : 'Пользователь добавлен');
      } else {
        throw new Error('Ошибка сохранения');
      }
    } catch (error) {
      console.error('Ошибка сохранения пользователя:', error);
      this.showError('Не удалось сохранить изменения');
    }
  }

  async deleteUser(userId) {
    const user = this.users.find(u => u.id === userId);
    if (!user) return;

    const confirmText = `Вы уверены, что хотите удалить пользователя ${user.lastName} ${user.firstName}?`;
    if (!confirm(confirmText)) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await this.loadUsers();
        this.showSuccess('Пользователь удалён');
      } else {
        throw new Error('Ошибка удаления');
      }
    } catch (error) {
      console.error('Ошибка удаления пользователя:', error);
      this.showError('Не удалось удалить пользователя');
    }
  }

  showSuccess(message) {
    alert(message);
  }

  showError(message) {
    alert(message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new UserManager();
});
