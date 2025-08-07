import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.toastr.error(this.errorMessage);
      return;
    };

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.toastr.success('Registration successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg = err.error?.error || 'Registration failed';
        this.errorMessage = msg;
        this.toastr.error(msg);
      }
    });
  }
}
