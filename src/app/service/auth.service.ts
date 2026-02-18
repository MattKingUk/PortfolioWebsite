import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'admin_token';
  isLoggedIn = signal(false);
  username = signal('');

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      this.verify().subscribe({
        next: () => {
          this.isLoggedIn.set(true);
        },
        error: () => {
          this.logout();
        },
      });
    }
  }

  login(username: string, password: string): Observable<{ token: string; username: string }> {
    return this.http.post<{ token: string; username: string }>('/api/auth/login', { username, password }).pipe(
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.isLoggedIn.set(true);
        this.username.set(res.username);
      })
    );
  }

  verify(): Observable<boolean> {
    return this.http.get<{ valid: boolean; username: string }>('/api/auth/verify').pipe(
      tap((res) => {
        this.username.set(res.username);
        this.isLoggedIn.set(true);
      }),
      map(() => true)
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>('/api/auth/password', { currentPassword, newPassword });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false);
    this.username.set('');
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
