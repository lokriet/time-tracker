import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from './can-deactivate.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {

  canDeactivate(component: ComponentCanDeactivate,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (!component.canDeactivate()) {
      if (confirm('You have unsaved changes! If you leave, your changes will be lost.')) {
          return true;
      } else {
          return false;
      }
    }
    return true;
  }
}
