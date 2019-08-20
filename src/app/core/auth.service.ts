import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';
import { stringify } from 'querystring';
import { User } from './data-types';
import { ThrowStmt } from '@angular/compiler';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      shareReplay(1),
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    // Get the auth state, then fetch the Firestore user document or return null
    // console.log('Checking if user is logged in');
    this.user$.subscribe(user => {
      if (user) {
        // this.user = user;
        // console.log('User is loggedin');
        // console.log(user);
        // localStorage.setItem('user', JSON.stringify(user));
      } else {
        // console.log('User is not loggedin');
        localStorage.setItem('user', null);
      }
    });
  }

  async emailPasswordSignin(email: string, password: string) {
    // const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    return this.updateUserData(credential.user);

    // const result = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    // this.router.navigate(['dashboard']);
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);

  }

  // async register(email: string, password: string) {
  //   var result = await this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  //   this.sendEmailVerification();
  // }

  async logout() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
    };

    return userRef.set(data, {merge: true});

  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }
}
