import { Injectable } from '@angular/core';

import { QueryConfig, Query } from '@datorama/akita';

import { AuthState, AuthStore } from './auth.store';

@Injectable({
  providedIn: 'root'
})
@QueryConfig({})
export class AuthQuery extends Query<AuthState>{
  isAuthenticated$ = this.select(state => !!state.token);
  selectToken$ = this.select('token');

  constructor(protected store: AuthStore) {
    super(store);
  }
}