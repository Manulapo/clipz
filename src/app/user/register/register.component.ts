import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../services/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private auth: AuthService, private emailTaken: EmailTaken) {}

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl(
    '',
    [Validators.required, Validators.email],
    [this.emailTaken.validate]
  );
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirmPassword = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(13),
  ]);

  registerForm = new FormGroup(
    {
      name: this.name,
      email: this.email,
      age: this.age,
      password: this.password,
      confirmPassword: this.confirmPassword,
      phoneNumber: this.phoneNumber,
    },
    [RegisterValidators.match('password', 'confirmPassword')]
  );

  showAlert: boolean = false;
  inSubmission: boolean = false;

  alertMessage: string = 'Please Wait! your account is being created';
  alertColor = 'blue';

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
