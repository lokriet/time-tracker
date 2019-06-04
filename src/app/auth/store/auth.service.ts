import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';

import { AuthStore } from './auth.store';
import { AuthQuery } from './auth.query';
import { Observable } from 'rxjs';
import { ProjectsService } from 'src/app/projects/store/projects.service';
import { TasksService } from 'src/app/tasks/store/tasks.service';

@Injectable()
export class AuthService {
  constructor(private authStore: AuthStore,
              private authQuery: AuthQuery,
              private firebaseAuth: AngularFireAuth,
              private projectsService: ProjectsService,
              private tasksService: TasksService) {}

  loginWithEmailAndPassword(email: string, password: string):Promise<firebase.auth.UserCredential> {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
        .then(result => {
          this.firebaseAuth.auth.currentUser.getIdToken().then(token => { this.authStore.update({token}); });
          this.authStore.update({uid: this.firebaseAuth.auth.currentUser.uid});
          this.initStoreCaches();
          this.firebaseAuth.auth.onIdTokenChanged((user) => {
            if (user) {
              this.firebaseAuth.auth.currentUser.getIdToken()
                .then(token => { this.authStore.update({token}); });
              this.authStore.update({uid: this.firebaseAuth.auth.currentUser.uid});
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
      this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(result => {
          this.firebaseAuth.auth.currentUser.getIdToken().then(token => { this.authStore.update({token}); });
          this.authStore.update({uid: this.firebaseAuth.auth.currentUser.uid});
          this.initStoreCaches();
          this.firebaseAuth.auth.onIdTokenChanged((user) => {
            if (user) {
              this.firebaseAuth.auth.currentUser.getIdToken()
                .then((token) => { this.authStore.update({token}); });
              this.authStore.update({uid: this.firebaseAuth.auth.currentUser.uid});
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
    this.firebaseAuth.auth.signOut().then(
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

  private initStoreCaches() {
    this.projectsService.initStoreCache(this.getCurrentUserUid());
    this.tasksService.initStoreCache(this.getCurrentUserUid());
  }
}