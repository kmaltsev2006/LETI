import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header>
      <nav>
        <h1>Социальная сеть</h1>
        <ul *ngIf="currentUser">
          <li><a routerLink="/news" routerLinkActive="active">Новости</a></li>
          <li><a routerLink="/add-news" routerLinkActive="active">Добавить новость</a></li>
          <li><a routerLink="/users" routerLinkActive="active">Пользователи</a></li>
          <li><a routerLink="/profile" routerLinkActive="active">Мой профиль</a></li>
          <li *ngIf="isAdmin">
            <a href="https://localhost:3112" target="_blank">Админ-панель</a>
          </li>
          <li>
            <span style="margin-right: 10px;">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
            <button class="secondary" (click)="logout()">Выйти</button>
          </li>
        </ul>
      </nav>
    </header>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  currentUser = this.authService.currentUserValue;
  isAdmin = this.authService.isAdmin();

  constructor(private authService: AuthService) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = this.authService.isAdmin();
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/register';
  }
}

