import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private auth: AngularFireAuth) {}

  showAlert: boolean = false;
  alertMessage: string = 'Veryfing Sign In';
  alertColor: string = 'blue';
  inSubmission: boolean = false;

  credentials = {
    email: '',
    password: '',
  };

  async login() {
    this.showAlert = true;
    this.alertMessage = 'Veryfing Sign In';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (error) {
      this.alertMessage = 'Something Went wrong, Try again later';
      this.alertColor = 'red';
      this.inSubmission = false;
      throw new Error('Login Failed');
    }

    this.alertMessage = 'Welcome Back!';
    this.alertColor = 'green';
  }
}
