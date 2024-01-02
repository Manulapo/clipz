import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { IUser } from './models/user.model';
import { Observable, delay, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map((user: any) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    );
  }

  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error('Password not Provided');
    }
    const { email, password, age, phoneNumber, name } = userData;
    console.log('userData:', userData);

    const userCredential = await this.auth.createUserWithEmailAndPassword(
      email as string,
      password as string
    );

    console.log('New Registration: ', userCredential);

    if (!userCredential.user) {
      throw new Error("User Can't be found!");
    }

    await this.usersCollection.doc(userCredential.user.uid).set({
      name: name,
      age: age,
      email: email,
      phoneNumber: phoneNumber,
    });

    userCredential.user.updateProfile({
      displayName: name,
    });
  }
}
