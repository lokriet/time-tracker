import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { ProjectsService } from 'src/app/projects/store/projects.service';
import { TasksService } from 'src/app/tasks/store/tasks.service';

import { AuthQuery } from './auth.query';
import { AuthStore } from './auth.store';

@Injectable()
export class AuthService {
  initialAuthStateLoaded: Promise<void>;

  constructor(private authStore: AuthStore,
              private authQuery: AuthQuery,
              private firebaseAuth: AngularFireAuth,
              private projectsService: ProjectsService,
              private tasksService: TasksService) {

    this.initialAuthStateLoaded = new Promise((resolve, reject) => {
      console.log('setting initial auth state...');
      let resolved = false;

      this.firebaseAuth.auth.onIdTokenChanged((user) => {
        if (user) {
          const currentUser = this.getCurrentUserUid();
          const newUser = user.uid;
          this.authStore.update({uid: newUser});
          if (!newUser || newUser !== currentUser) {
            this.resetStoreCaches();
          }
          user.getIdToken()
            .then(token => {
              this.authStore.update({token});
              if (!resolved) {
                resolved = true;
                resolve();
                console.log('initial auth state loaded with current user data');
              }
            });
        } else {
          this.authStore.update({token: null, uid: null});
          if (!resolved) {
            resolved = true;
            resolve();
            console.log('initial auth state loaded with no user');
          }
        }
      });
    });
  }

  loginWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
        .then(user => resolve(user))
        .catch(error => {
          let errorMessage: string;

          switch (error.code) {
            case 'auth/wrong-password':
              errorMessage = 'Wrong password';
              break;
            case 'auth/user-not-found':
              errorMessage = "User with this e-mail doesn't exist";
              break;
            default:
              console.log(error);
              errorMessage = 'Unknown error';
          }
          reject(errorMessage);
        });
    });

  }

  registerWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(user => resolve(user))
        .catch(error => {
          let errorMessage: string;

          switch (error.code) {
            case 'auth/email-already-in-use':
              errorMessage = 'Account with this e-mail already exists';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Invalid e-mail';
              break;
            case 'auth/weak-password':
              errorMessage = 'Password is weak. Try picking a stronger one';
              break;
            default:
              console.log(error.code);
              errorMessage = 'Unknown error';
          }
          reject(errorMessage);
        });
    });
  }

  logout() {
    this.firebaseAuth.auth.signOut();
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

  private resetStoreCaches() {
    this.projectsService.resetStoreCache();
    this.tasksService.resetStoreCache();
  }
}
