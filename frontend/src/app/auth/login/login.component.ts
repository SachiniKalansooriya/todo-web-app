import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  error = '';
  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    
    const formValue = this.form.value;
    if (formValue.email && formValue.password) {
      this.auth.login({
        email: formValue.email,
        password: formValue.password
      }).subscribe({
        next: () => this.router.navigate(['/login']), // redirect after successful login
        error: err => this.error = err?.error?.message || 'Login failed'
      });
    }
  }
}