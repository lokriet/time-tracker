import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/store/auth.service';
import { MessagesService } from '../messages/store/messages.service';
import { TasksService } from '../tasks/store/tasks.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private tasksService: TasksService,
              private authService: AuthService,
              private router: Router,
              private messagesService: MessagesService) { }

  isAuthenticated$: Observable<boolean>;

  ngOnInit() {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }
  onLogout() {
    this.authService.logout();
    this.messagesService.addInfo('Logged out successfully');
    this.router.navigate(['/']);
  }
}
