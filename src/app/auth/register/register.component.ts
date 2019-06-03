import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../store/auth.service';
import { MessagesService } from 'src/app/messages/store/messages.service';

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
      (error) => {
        switch (error.code) {
          case 'auth/email-already-in-use': 
            this.messagesService.addError('Account with this e-mail already exists');
            break;
          case 'auth/invalid-email':
            this.messagesService.addError("Invalid e-mail");
            break;
          case 'auth/weak-password':
              this.messagesService.addError("Password is weak. Try picking a stronger one");
              break;
          default:
            this.messagesService.addError(error.message);
            console.log(error);
        }
      }
    );
  }
}
