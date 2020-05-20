import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/store/auth.service';
import { ProjectsService } from '../projects/store/projects.service';
import { TasksService } from './store/tasks.service';

@Injectable({
  providedIn: 'root'
})
export class TasksResolverService implements Resolve<boolean> {
  constructor(private tasksService: TasksService,
              private projectsService: ProjectsService,
              private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    return this.projectsService.initStoreCache(this.authService.getCurrentUserUid())
           .then(() => {
             return this.tasksService.initStoreCache(this.authService.getCurrentUserUid());
            })
           .then(() => {
             return true;
            });
  }

}
