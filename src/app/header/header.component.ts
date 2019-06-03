import { Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks/store/tasks.service';
import { AuthService } from '../auth/store/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private tasksService: TasksService,
              private authService: AuthService,
              private router: Router) { }

  isAuthenticated$: Observable<boolean>;

  ngOnInit() {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }

  onStoreTasks() {
    this.tasksService.storeTasksForOwnerId(this.authService.getCurrentUserUid());
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
