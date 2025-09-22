import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ENV_CONFIG } from './env.config';
import { AuthService } from './auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

// keep track of failed refresh attempts
let refreshFailCount = 0;

export const appInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const envConfig = inject(ENV_CONFIG);

  const accessToken = authService.getAccessToken();

  // prepend base URL
  req = req.clone({
    url: `${envConfig.apiUrl}${req.url}`,
  });

  // attach token if available
  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {

        // only try to refresh a few times
        if (refreshFailCount >= 3) {
          authService.logout();
          return throwError(() => error);
        }

        return authService.refreshToken().pipe(
          switchMap((newToken) => {
            refreshFailCount = 0; // reset counter if refresh works
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            refreshFailCount++;
            if (refreshFailCount >= 3) {
              authService.logout();
            }
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
