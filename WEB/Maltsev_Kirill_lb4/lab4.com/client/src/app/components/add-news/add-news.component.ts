import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-news',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="form-container">
        <h2>Добавить новость</h2>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title">Заголовок *</label>
            <input
              type="text"
              id="title"
              [(ngModel)]="formData.title"
              name="title"
              required
              placeholder="Введите заголовок новости"
            />
          </div>

          <div class="form-group">
            <label for="content">Содержание *</label>
            <textarea
              id="content"
              [(ngModel)]="formData.content"
              name="content"
              required
              placeholder="Расскажите что-нибудь интересное..."
            ></textarea>
          </div>

          <div *ngIf="errorMessage" class="message error">
            {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="message success">
            {{ successMessage }}
          </div>

          <div style="display: flex; gap: 10px;">
            <button type="submit" class="primary" [disabled]="loading">
              {{ loading ? 'Публикация...' : 'Опубликовать' }}
            </button>
            <button type="button" class="secondary" (click)="goBack()">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class AddNewsComponent {
  formData = {
    title: '',
    content: ''
  };
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.errorMessage = 'Необходимо авторизоваться';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const newsData = {
      ...this.formData,
      userId: currentUser.id
    };

    this.apiService.addNews(newsData).subscribe({
      next: (news) => {
        this.successMessage = 'Новость успешно опубликована!';
        setTimeout(() => {
          this.router.navigate(['/news']);
        }, 1000);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Ошибка публикации новости';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/news']);
  }
}

