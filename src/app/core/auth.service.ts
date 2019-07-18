import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { stringify } from 'querystring';

export interface User {
  uid: string;
  email: string;

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    // Get the auth state, then fetch the Firestore user document or return null
    console.log('Checking if user is logged in');
    // this.afAuth.authState.subscribe(user => {
    //   if (user) {
    //     this.user = user;
    //     console.log('User is loggedin')
    //     console.log(user)
    //     localStorage.setItem('user', JSON.stringify(this.user));
    //   } else {
    //     console.log('User is not loggedin')
    //     localStorage.setItem('user', null);
    //   }
    // })
  }

  async emailPasswordSignin(email: string, password: string) {
    const result = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    this.router.navigate(['dashboard']);
  }

  // async googleSignin() {

  // }

  // async register(email: string, password: string) {
  //   var result = await this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  //   this.sendEmailVerification();
  // }

  async logout() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }
}
