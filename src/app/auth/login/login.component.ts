import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesService } from 'src/app/messages/store/messages.service';

import { AuthService } from '../store/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  alreadyLoggedIn: boolean = false;

  constructor(private router: Router,
              private authService: AuthService,
              private messagesService: MessagesService) { }

  ngOnInit() {
    if (this.authService.isAuthenticatedNow()) {
      this.alreadyLoggedIn = true;
    }
  }

  onLogIn() {
    this.authService.loginWithEmailAndPassword(this.email, this.password)
    .then(
      () => {
        this.messagesService.addInfo('Logged in successfully');
        this.router.navigate(['/']);
      }
    )
    .catch(
      (errorMessage) => {
        this.messagesService.addError(errorMessage);
      }
    );
  }
}
