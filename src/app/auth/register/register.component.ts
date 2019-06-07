import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesService } from 'src/app/messages/store/messages.service';

import { AuthService } from '../store/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string;
  password: string;

  constructor(private router: Router,
              private authService: AuthService,
              private messagesService: MessagesService) { }

  ngOnInit() {
  }

  onRegister() {
    this.authService.registerWithEmailAndPassword(this.email, this.password)
    .then(
      () => {
        this.messagesService.addInfo('New account registered successfully')
        this.router.navigate(['/']);
      }
    )
    .catch(
      (errorMessage: string) => {
        this.messagesService.addError(errorMessage);
      }
    );
  }
}
