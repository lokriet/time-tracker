import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessagesService } from '../../messages/store/messages.service';
import { AuthService } from '../store/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  returnUrl: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private messagesService: MessagesService) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
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
