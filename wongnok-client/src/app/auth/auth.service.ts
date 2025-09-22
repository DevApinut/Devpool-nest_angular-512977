import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { finalize, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = sessionStorage.getItem('accessToken');

  httpClient = inject(HttpClient);

  getAccessToken() {
    return this.accessToken;
  }

  login(loginDto: { username: string; password: string }) {
    return this.httpClient
      .post<{ accessToken: string }>(`/auth/login`, loginDto, {
        withCredentials: true,
      })
      .pipe(
        tap((tokens) => {
          this.accessToken = tokens.accessToken;
          sessionStorage.setItem('accessToken', tokens.accessToken);
        })
      );
  }

  keycloakRedirect() {
    return this.httpClient.get<{ url: string }>(`/keycloak/redirect-to-login`, {
      withCredentials: true,
    });
  }

  keycloakLogin(queryString: string) {
    return this.httpClient
      .get<{ accessToken: string }>(`/keycloak/login?${queryString}`, {
        withCredentials: true,
      })
      .pipe(
        tap((tokens) => {
          this.accessToken = tokens.accessToken;
          sessionStorage.setItem('accessToken', tokens.accessToken);
        })
      );
  }

  refreshToken() {
    return this.httpClient
      .post<{ accessToken: string }>('/auth/refresh-token', {})
      .pipe(
        tap((tokens) => {
          this.accessToken = tokens.accessToken;
          sessionStorage.setItem('accessToken', tokens.accessToken);
        }),
        map((tokens) => tokens.accessToken)
      );
  }

  logout() {
    return this.httpClient.post<any>(`/auth/logout`, {}).pipe(
      finalize(() => {
        sessionStorage.removeItem('accessToken');
        this.accessToken = null;
      })
    );
  }
}
