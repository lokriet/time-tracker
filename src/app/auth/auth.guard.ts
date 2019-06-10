import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { MessagesService } from '../messages/store/messages.service';
import { AuthService } from './store/auth.service';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService,
              private router: Router,
              private messagesService: MessagesService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.initialAuthStateLoaded.then(() => {
      if (this.authService.isAuthenticatedNow()) {
        return true;
      } else {
console.log(state);
        this.messagesService.addError('User is not logged in');

        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
      }
    });
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(childRoute, state);
  }
}