import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { MessagesService } from '../../messages/store/messages.service';
import { AuthService } from '../store/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  returnUrl: string;
  isLoggedIn: Observable<boolean>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private messagesService: MessagesService) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  onLogIn() {
    this.authService.loginWithEmailAndPassword(this.email, this.password)
    .then(
      () => {
        this.messagesService.addInfo('Logged in successfully');
        this.router.navigateByUrl(this.returnUrl);
      }
    )
    .catch(
      (errorMessage) => {
        this.messagesService.addError(errorMessage);
      }
    );
  }
}
