import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, User } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="form-container">
        <h2>Мой профиль</h2>

        <form *ngIf="currentUser" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="firstName">Имя *</label>
            <input
              type="text"
              id="firstName"
              [(ngModel)]="formData.firstName"
              name="firstName"
              required
            />
          </div>

          <div class="form-group">
            <label for="lastName">Фамилия *</label>
            <input
              type="text"
              id="lastName"
              [(ngModel)]="formData.lastName"
              name="lastName"
              required
            />
          </div>

          <div class="form-group">
            <label for="middleName">Отчество *</label>
            <input
              type="text"
              id="middleName"
              [(ngModel)]="formData.middleName"
              name="middleName"
              required
            />
          </div>

          <div class="form-group">
            <label for="birthDate">Дата рождения *</label>
            <input
              type="date"
              id="birthDate"
              [(ngModel)]="formData.birthDate"
              name="birthDate"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="formData.email"
              name="email"
              required
            />
          </div>

          <div class="form-group">
            <label>Роль</label>
            <input
              type="text"
              [value]="currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'"
              disabled
              style="background: #f5f5f5; cursor: not-allowed;"
            />
          </div>

          <div *ngIf="errorMessage" class="message error">
            {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="message success">
            {{ successMessage }}
          </div>

          <div style="display: flex; gap: 10px;">
            <button type="submit" class="primary" [disabled]="loading">
              {{ loading ? 'Сохранение...' : 'Сохранить изменения' }}
            </button>
            <button type="button" class="secondary" (click)="goBack()">
              Отмена
            </button>
          </div>
        </form>

        <div *ngIf="!currentUser" class="loading">
          <div class="spinner"></div>
          <p>Загрузка профиля...</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  formData = {
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    email: ''
  };
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.formData = {
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        middleName: this.currentUser.middleName,
        birthDate: this.currentUser.birthDate,
        email: this.currentUser.email
      };
    }
  }

  onSubmit(): void {
    if (!this.currentUser) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.updateUser(this.currentUser.id, this.formData).subscribe({
      next: (updatedUser) => {
        this.successMessage = 'Профиль успешно обновлён!';
        // Обновляем данные в AuthService
        this.authService.login(updatedUser);
        this.currentUser = updatedUser;
        this.loading = false;
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Ошибка обновления профиля';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/news']);
  }
}

