import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../store/auth.service';
import { MessagesService } from 'src/app/messages/store/messages.service';

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
      (error) => {
        switch (error.code) {
          case 'auth/wrong-password': 
            this.messagesService.addError( 'Wrong password');
            break;
          case 'auth/user-not-found':
            this.messagesService.addError("User with this e-mail doesn't exist");
            break;
          default:
            this.messagesService.addError(error.message);
            console.log(error);
        }
      }
    );
  }
}
