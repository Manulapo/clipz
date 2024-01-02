import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../services/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private auth: AuthService) {}

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.email]),
    age: new FormControl<number | null>(null, [
      Validators.min(18),
      Validators.max(120),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
      ),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
  });

  showAlert: boolean = false;
  alertMessage: string = 'Please Wait! your account is being created';
  alertColor = 'blue';

  inSubmission: boolean = true;

  async register() {
    this.showAlert = true;
    this.alertMessage = 'Please Wait! your account is being created';
    this.alertColor = 'blue';

    try {
      await this.auth.createUser(this.registerForm.value as IUser);
      this.alertMessage = 'Success! Your Account Has been created.';
      this.alertColor = 'green';
    } catch (e) {
      this.alertMessage =
        'An unexpected error occurred. Please try again later';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }
  }
}
