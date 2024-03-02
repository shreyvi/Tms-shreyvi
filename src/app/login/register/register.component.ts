import { Component } from '@angular/core';
import {FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { EncrptService } from '../../services/encrpt.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  errorMessage!: string;
  hidePassword = true;
  hideConfirmPassword = true;
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  contact = new FormControl('', [Validators.required]);
  location = new FormControl('', [Validators.required]);
  designation = new FormControl('', [Validators.required]);
  companyName = new FormControl('', [Validators.required]);
  companyEmail = new FormControl('', [Validators.required, Validators.email]);
  personalEmail = new FormControl('', [Validators.required, Validators.email]);
  confirmPassword = new FormControl('', [Validators.required, Validators.minLength(8)]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  loading: boolean = false;
  loadingMessage: string = "Sign Up";

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private encrptService: EncrptService
  ) {}

  getCompanyEmailErrorMessage() {
    if (this.companyEmail.hasError('required')) {
      return 'Email is Required';
    }
    return this.companyEmail.hasError('email') ? 'Not a valid email' : '';
  }

  getPersonalEmailErrorMessage() {
    if (this.personalEmail.hasError('required')) {
      return 'Email is Required';
    }
    return this.personalEmail.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password is required';
    }
    return this.password.hasError('minlength')
      ? 'Password should be at least 8 characters long'
      : '';
  }

  getConfirmPasswordErrorMessage() {
    if (this.confirmPassword.hasError('required')) {
      return 'Password is required';
    }
    if (this.confirmPassword.hasError('minlength')) {
      return 'Password should be at least 8 characters long';
    }
    if (this.password.value !== this.confirmPassword.value) {
      return 'Passwords do not match';
    }
    return '';
  }

  submit(){
    if (this.companyName.valid && this.companyEmail.valid && this.contact.valid 
      && this.location.valid && this.firstName.valid && this.lastName.valid 
      && this.personalEmail.valid && this.designation.valid && this.password.valid && this.confirmPassword.valid) {
      this.loading = true;
      this.loadingMessage = "Signing Up...";
      
      const registerData = {
        companyName: this.companyName.value, 
        companyEmail: this.companyEmail.value,
        contact: this.contact.value,
        location: this.location.value,
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        personalEmail: this.personalEmail.value,
        designation: this.designation.value,
        password: this.password.value,
      };

      this.authService.register(registerData).subscribe(
        () => {
          const personalEmail = registerData.personalEmail;
          this.redirectToRegVerify(personalEmail);
          this.snackBar.open('Registration successful!', 'Dismiss', {
            duration: 2000
          });
        },
        (error) => {
          this.snackBar.open(
            error.error.message || 'Registration failed. Please try again.',
            'Dismiss',
            { duration: 2000 }
          );
          this.errorMessage = error.error.message || '';
          this.loading = false;
          this.loadingMessage = "Sign Up";
        }
      );
    }
  }

  redirectToRegVerify(personalEmail: string | null) {
    if (personalEmail) {
       const encryptedEmail = this.encrptService.encryptData(personalEmail);
      const queryParams = {
        personalEmail: encryptedEmail 
      };
      const navigationExtras: NavigationExtras = {
        queryParams: queryParams
      };
      this.router.navigate(['/login/regVerify'], navigationExtras);
    } else {
      console.error('Personal email is null');
    }
  }
}
