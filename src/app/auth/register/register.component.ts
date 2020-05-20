import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from 'src/app/messages/store/messages.service';

import { AuthService } from '../store/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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

  onRegister() {
    this.authService.registerWithEmailAndPassword(this.email, this.password)
    .then(
      () => {
        this.messagesService.addInfo('New account registered successfully');
        this.router.navigateByUrl(this.returnUrl);
      }
    )
    .catch(
      (errorMessage: string) => {
        this.messagesService.addError(errorMessage);
      }
    );
  }
}
