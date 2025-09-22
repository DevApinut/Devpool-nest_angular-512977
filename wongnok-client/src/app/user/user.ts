import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ENV_CONFIG } from '../env.config';
import { JsonPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user',
  imports: [JsonPipe, RouterLink],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit {
  authService = inject(AuthService);

  httpClient = inject(HttpClient);
  envConfig = inject(ENV_CONFIG);
  router = inject(Router);

  user = signal({});

  ngOnInit(): void {
    this.onMe();
  }

  onMe() {
    this.httpClient.get(`/users/me`).subscribe((res) => {
      this.user.set(res);
    });
  }

  onLogout() {
    this.authService.logout().subscribe((res) => {
      if (res && res.logoutUrl) {
        window.location = res.logoutUrl;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
