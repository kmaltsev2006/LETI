import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  email: string;
  photo?: string;
  role: string;
  status: string;
}

export interface News {
  id: number;
  userId: number;
  title: string;
  content: string;
  date: string;
  status: string;
  author?: User;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Используем proxy к API модуля администрирования (lab3)
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // Users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  loginUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/login`, { email, password });
  }

  registerUser(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/register`, userData);
  }

  updateUser(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, userData);
  }

  updateUserPhoto(userId: number, photo: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}/photo`, { photo });
  }

  // Friends
  getFriends(userId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/friends/${userId}`);
  }

  addFriend(userId: number, friendId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/friends`, { userId, friendId });
  }

  removeFriend(userId: number, friendId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/friends/${userId}/${friendId}`);
  }

  // News
  getNews(userId: number): Observable<News[]> {
    // Получаем новости пользователя и его друзей
    return this.http.get<News[]>(`${this.apiUrl}/news/user/${userId}`);
  }

  addNews(newsData: Partial<News>): Observable<News> {
    return this.http.post<News>(`${this.apiUrl}/news`, newsData);
  }
}
