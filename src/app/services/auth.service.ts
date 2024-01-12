import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { IUser } from './models/user.model';
import {
  Observable,
  delay,
  map,
  filter,
  switchMap,
  of,
  tap,
  BehaviorSubject,
} from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  public redirect: boolean = false;
  public user: IUser | undefined = undefined;

  // Observable for user information
  private userInfoSubject = new BehaviorSubject<IUser | undefined>(undefined);
  public userInfo$: Observable<IUser | undefined> =
    this.userInfoSubject.asObservable();

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map((user: any) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));

    // subsription to router events and filter the Navigation end one then taking the data value to get router data passed
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this.route.firstChild),
        switchMap((route) => route?.data ?? of({ authOnly: false }))
      )
      .subscribe((data) => {
        this.redirect = data.authOnly ?? false;
      });

    // Initialize user information
    this.initUserInfo();
  }

  private initUserInfo() {
    this.auth.user.subscribe((user: any) => {
      if (user) {
        const userInfo = {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          age: user.age,
          phoneNumber: user.phoneNumber,
        } as IUser;
        this.user = userInfo;
        this.userInfoSubject.next(userInfo);
      } else {
        this.userInfoSubject.next(undefined);
      }
    });
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

  public async logOut(ev?: Event) {
    if (ev) {
      ev?.preventDefault();
    }
    await this.auth.signOut();

    // force to HP after logout
    if (this.redirect) {
      this.router.navigateByUrl('/');
    }
  }
}
