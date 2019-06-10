import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/store/auth.service';
import { ProjectsService } from '../projects/store/projects.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsResolverService implements Resolve<boolean> {
  constructor(private projectsService: ProjectsService,
              private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    return this.projectsService.initStoreCache(this.authService.getCurrentUserUid()).then(() => true);
  }

}