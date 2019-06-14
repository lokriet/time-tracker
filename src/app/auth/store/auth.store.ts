import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface AuthState {
  token: string;
  uid: string;
}

function createInitialState() {
  return {
    token: null,
    uid: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({name: 'auth'})
export class AuthStore extends Store<AuthState> {

  constructor() {
    super(createInitialState());
  }
}
