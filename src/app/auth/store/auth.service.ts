import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { AuthStore } from './auth.store';
import { AuthQuery } from './auth.query';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private authStore: AuthStore,
              private authQuery: AuthQuery) {}

  loginWithEmailAndPassword(email: string, password: string):Promise<firebase.auth.UserCredential> {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(result => {
          firebase.auth().currentUser.getIdToken().then(token => { this.authStore.update({token}); });
          this.authStore.update({uid: firebase.auth().currentUser.uid});
          firebase.auth().onIdTokenChanged((user) => {
            if (user) {
              firebase.auth().currentUser.getIdToken()
                .then(token => { this.authStore.update({token}); });
              this.authStore.update({uid: firebase.auth().currentUser.uid});
            } else {
              this.authStore.update({token: null, uid: null});
            }
          });
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  registerWithEmailAndPassword(email: string, password: string):Promise<firebase.auth.UserCredential> {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(result => {
          firebase.auth().currentUser.getIdToken().then(token => { this.authStore.update({token}); });
          firebase.auth().onIdTokenChanged((user) => {
            if (user) {
              firebase.auth().currentUser.getIdToken()
                .then((token) => { this.authStore.update({token}); });
              this.authStore.update({uid: firebase.auth().currentUser.uid});
            } else {
              this.authStore.update({token: null, uid: null});
            }
          });
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    })
  }

  logout() {
    firebase.auth().signOut().then(
      () => {
        this.authStore.update({token: null, uid: null});
      }
    );
  }

  getToken(): Observable<string> {
    return this.authQuery.selectToken$;
  }

  getTokenNow(): string {
    return this.authQuery.getValue().token;
  }

  isAuthenticated(): Observable<boolean> {
    return this.authQuery.isAuthenticated$;
  }

  isAuthenticatedNow(): boolean {
    return !!this.authQuery.getValue().token;
  }

  getCurrentUserUid(): string {
    return this.authQuery.getValue().uid;
  }
}