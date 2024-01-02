import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup } from '@angular/forms';
import { IUser } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {}

  public async createUser(userData: IUser) {
    if(!userData.password){
      throw new Error("Password not Provided")
    }
    const { email, password, age, phoneNumber, name } = userData;

    const userCredential = await this.auth.createUserWithEmailAndPassword(
      email as string,
      password as string
    );

    console.log('New Registration: ', userCredential);

    await this.db.collection<IUser>('users').add({
      name: name,
      age: age,
      email: email,
      phoneNumber: phoneNumber,
    });
  }
}
