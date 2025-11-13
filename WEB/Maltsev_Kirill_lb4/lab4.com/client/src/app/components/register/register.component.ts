import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService, User } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="form-container">
        <h2>{{ showRegisterForm ? 'Регистрация' : 'Вход в систему' }}</h2>

        <form *ngIf="!showRegisterForm" (ngSubmit)="onLogin()">
          <div class="form-group">
            <label for="loginEmail">Email</label>
            <input
              type="email"
              id="loginEmail"
              [(ngModel)]="loginData.email"
              name="loginEmail"
              required
              placeholder="Введите email"
            />
          </div>

          <div class="form-group">
            <label for="loginPassword">Пароль</label>
            <input
              type="password"
              id="loginPassword"
              [(ngModel)]="loginData.password"
              name="loginPassword"
              required
              placeholder="Введите пароль"
            />
          </div>

          <div *ngIf="errorMessage" class="message error">
            {{ errorMessage }}
          </div>

          <button type="submit" class="primary" [disabled]="loading">
            {{ loading ? 'Вход...' : 'Войти' }}
          </button>

          <p style="margin-top: 20px; text-align: center;">
            Нет аккаунта?
            <a href="#" (click)="showRegisterForm = true; errorMessage = ''; $event.preventDefault()">
              Зарегистрироваться
            </a>
          </p>

          <div style="margin-top: 30px; padding: 15px; background: #f5f7fa; border-radius: 6px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Тестовые аккаунты:</strong><br>
              Admin: petrova&#64;example.com / admin<br>
              User: test&#64;example.com / test
            </p>
          </div>
        </form>

        <form *ngIf="showRegisterForm" (ngSubmit)="onSubmit()">
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
            <label for="password">Пароль * (минимум 4 символа)</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="formData.password"
              name="password"
              required
              minlength="4"
            />
          </div>

          <div *ngIf="errorMessage" class="message error">
            {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="message success">
            {{ successMessage }}
          </div>

          <button type="submit" class="primary" [disabled]="loading">
            {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>

          <p style="margin-top: 20px; text-align: center;">
            <a href="#" (click)="showRegisterForm = false; $event.preventDefault()">
              Войти как существующий пользователь
            </a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    select {
      width: 100%;
      padding: 10px;
      border: 1px solid #d1d5da;
      border-radius: 6px;
      font-size: 14px;
    }
  `]
})
export class RegisterComponent {
  loginData = {
    email: '',
    password: ''
  };
  
  formData = {
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    email: '',
    password: ''
  };
  loading = false;
  errorMessage = '';
  successMessage = '';
  showRegisterForm = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {

    if (this.authService.currentUserValue) {
      this.router.navigate(['/news']);
    }
  }

  onLogin(): void {
    this.loading = true;
    this.errorMessage = '';

    this.apiService.loginUser(this.loginData.email, this.loginData.password).subscribe({
      next: (user) => {
        this.authService.login(user);
        this.router.navigate(['/news']);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Ошибка входа';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.registerUser(this.formData).subscribe({
      next: (user) => {
        this.successMessage = 'Регистрация успешна! Перенаправление...';
        this.authService.login(user);
        setTimeout(() => {
          this.router.navigate(['/news']);
        }, 1000);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Ошибка регистрации';
        this.loading = false;
      }
    });
  }
}

