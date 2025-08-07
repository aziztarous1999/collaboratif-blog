import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toastr.error('Please fill in all required fields correctly.');
      return;
    };
  
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.toastr.success('Login successful');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const msg = err.error?.error || err.error || 'Login failed';
        this.toastr.error(msg);
      }
    });
  }
}
