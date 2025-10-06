import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  error = '';
  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    
    const formValue = this.form.value;
    if (formValue.name && formValue.email && formValue.password) {
      this.auth.register({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password
      }).subscribe({
        next: () => this.router.navigate(['/login']),
        error: err => this.error = err?.error?.message || 'Registration failed'
      });
    }
  }
}