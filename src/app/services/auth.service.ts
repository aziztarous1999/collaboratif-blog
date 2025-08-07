import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl+'/api'; // update if needed
  private tokenKey = 'auth_tkn';
  private userRole = new BehaviorSubject<string | null>(null);
  private userId = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userRole.next(decoded.role);
        this.userId.next(decoded.id);
      } catch (err) {
        console.error('Invalid token:', err);
        this.logout(); // optional: clear corrupted token
      }
    }
  }
  

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem(this.tokenKey, res.token);
        const decodedToken: any = jwtDecode(res.token);
        this.userRole.next(decodedToken.role);
        this.userId.next(decodedToken.id);
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.userRole.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): Observable<string | null> {
    return this.userRole.asObservable();
  }

  canEdit(articleOwner:string): boolean {
    console.log("this.userId.getValue():",this.userId.getValue());
    return (this.userRole.getValue() === 'admin' || this.userRole.getValue() === 'editor' || articleOwner ===this.userId.getValue());
  }
}
