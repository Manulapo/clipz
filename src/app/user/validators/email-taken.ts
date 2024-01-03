import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class EmailTaken implements AsyncValidator {
  constructor(private auth: AngularFireAuth) {}

  validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
    console.log('checking');
    return this.auth
      .fetchSignInMethodsForEmail(control.value)
      .then((response: any) => {
        console.log('checking 2', response);
        return response.length ? { emailTaken: true } : null;
      });
  };
}
