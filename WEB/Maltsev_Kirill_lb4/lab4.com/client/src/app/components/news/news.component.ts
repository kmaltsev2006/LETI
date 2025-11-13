import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, News } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { HighlightDirective } from '../../directives/highlight.directive';
import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, HighlightDirective, FadeInDirective],
  template: `
    <div class="container">
      <div class="news-feed">
        <h2>Лента новостей</h2>

        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
          <p>Загрузка новостей...</p>
        </div>

        <div *ngIf="!loading && newsList.length === 0" class="empty-state">
          <h3>Новостей пока нет</h3>
          <p>Добавьте первую новость или подпишитесь на друзей!</p>
        </div>

        <div *ngFor="let news of newsList" class="news-item" appFadeIn appHighlight>
          <div class="author">
            <img [src]="news.author?.photo || '/images/default.jpg'" [alt]="getAuthorName(news)">
            <div class="author-info">
              <h4>{{ getAuthorName(news) }}</h4>
              <div class="date">{{ formatDate(news.date) }}</div>
            </div>
          </div>
          <h3>{{ news.title }}</h3>
          <p>{{ news.content }}</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class NewsComponent implements OnInit {
  newsList: News[] = [];
  loading = true;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    this.loading = true;
    this.apiService.getNews(currentUser.id).subscribe({
      next: (news) => {
        this.newsList = news;
        this.loading = false;
      },
      error: (error) => {
        console.error('Ошибка загрузки новостей:', error);
        this.loading = false;
      }
    });
  }

  getAuthorName(news: News): string {
    if (!news.author) return 'Неизвестный автор';
    return `${news.author.firstName} ${news.author.lastName}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

