import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, User } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { HighlightDirective } from '../../directives/highlight.directive';
import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HighlightDirective, FadeInDirective],
  template: `
    <div class="container">
      <h2>Пользователи</h2>

      <div style="margin-bottom: 30px;">
        <h3>Мои друзья</h3>
        <div *ngIf="loadingFriends" class="loading">Загрузка...</div>
        
        <div *ngIf="!loadingFriends && friends.length === 0" class="empty-state">
          <p>У вас пока нет друзей</p>
        </div>

        <div class="user-list">
          <div *ngFor="let friend of friends" class="user-card" appFadeIn appHighlight>
            <img [src]="friend.photo || '/images/default.jpg'" [alt]="getUserName(friend)">
            <h3>{{ getUserName(friend) }}</h3>
            <p>{{ friend.email }}</p>
            <button class="danger" (click)="removeFriend(friend.id)">
              Удалить из друзей
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3>Все пользователи</h3>
        <div *ngIf="loadingUsers" class="loading">Загрузка...</div>

        <div class="user-list">
          <div *ngFor="let user of availableUsers" class="user-card" appFadeIn appHighlight>
            <img [src]="user.photo || '/images/default.jpg'" [alt]="getUserName(user)">
            <h3>{{ getUserName(user) }}</h3>
            <p>{{ user.email }}</p>
            <button class="primary" (click)="addFriend(user.id)" [disabled]="isAddingFriend">
              Добавить в друзья
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="message" [class]="'message ' + messageType">
        {{ message }}
      </div>
    </div>
  `,
  styles: []
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  friends: User[] = [];
  availableUsers: User[] = [];
  loadingUsers = true;
  loadingFriends = true;
  isAddingFriend = false;
  message = '';
  messageType = 'info';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadFriends();
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.apiService.getUsers().subscribe({
      next: (users) => {
        const currentUser = this.authService.currentUserValue;
        this.users = users.filter(u => u.id !== currentUser?.id);
        this.updateAvailableUsers();
        this.loadingUsers = false;
      },
      error: (error) => {
        console.error('Ошибка загрузки пользователей:', error);
        this.loadingUsers = false;
      }
    });
  }

  loadFriends(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    this.loadingFriends = true;
    this.apiService.getFriends(currentUser.id).subscribe({
      next: (friends) => {
        this.friends = friends;
        this.updateAvailableUsers();
        this.loadingFriends = false;
      },
      error: (error) => {
        console.error('Ошибка загрузки друзей:', error);
        this.loadingFriends = false;
      }
    });
  }

  updateAvailableUsers(): void {
    const friendIds = this.friends.map(f => f.id);
    this.availableUsers = this.users.filter(u => !friendIds.includes(u.id));
  }

  addFriend(friendId: number): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    this.isAddingFriend = true;
    this.apiService.addFriend(currentUser.id, friendId).subscribe({
      next: () => {
        this.showMessage('Друг добавлен!', 'success');
        this.loadFriends();
        this.isAddingFriend = false;
      },
      error: (error) => {
        this.showMessage(error.error?.error || 'Ошибка добавления друга', 'error');
        this.isAddingFriend = false;
      }
    });
  }

  removeFriend(friendId: number): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    this.apiService.removeFriend(currentUser.id, friendId).subscribe({
      next: () => {
        this.showMessage('Друг удален', 'info');
        this.loadFriends();
      },
      error: (error) => {
        this.showMessage('Ошибка удаления друга', 'error');
      }
    });
  }

  getUserName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  showMessage(text: string, type: string): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}

