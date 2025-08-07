import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TokenExpiryDialogComponent } from '../shared/token-expiry-dialog/token-expiry-dialog.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;
  
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.dialog.open(TokenExpiryDialogComponent, { disableClose: true }).afterClosed().pipe(
            switchMap(userWantsRenew => {
              if (userWantsRenew) {
                return this.authService.refreshToken().pipe(
                  switchMap(() => {
                    const newToken = this.authService.getToken();
                    const retried = req.clone({
                      setHeaders: { Authorization: `Bearer ${newToken}` }
                    });
                    return next.handle(retried);
                  })
                );
              } else {
                this.authService.logout();
                this.router.navigate(['/login']);
                return throwError(() => error);
              }
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
  
}
