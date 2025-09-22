import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ENV_CONFIG } from '../env.config';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  router = inject(Router);
  envConfig = inject(ENV_CONFIG);

  authService = inject(AuthService);

  readonly loggedInPath = '/users/me';

  username = signal('');
  password = signal('');

  loginDto = computed(() => ({
    username: this.username(),
    password: this.password(),
  }));

  ngOnInit(): void {
    const queryString = this.router.url.split('?')[1];
    if (queryString?.includes('state=') && queryString?.includes('code=')) {
      this.authService
        .keycloakLogin(queryString)
        .subscribe(() => this.router.navigate([this.loggedInPath]));
    }
  }

  onLogin() {
    this.authService
      .login(this.loginDto())
      .subscribe(() => this.router.navigate([this.loggedInPath]));
  }

  onKeycloakLogin() {
    this.authService
      .keycloakRedirect()
      .subscribe((res) => (window.location.href = res.url));
  }
}
