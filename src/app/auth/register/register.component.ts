import { Component, OnInit } from '@angular/core';
import { faAngry } from '@fortawesome/free-solid-svg-icons';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { AuthService } from '../store/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  faBug = faAngry;

  email: string;
  password: string;

  errorMessage: string = null;

  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
  }

  onRegister() {
    this.authService.registerWithEmailAndPassword(this.email, this.password)
    .then(
      () => {
        this.errorMessage = null;
        this.router.navigate(['/']);
      }
    )
    .catch(
      (error) => {
        switch (error.code) {
          case 'auth/email-already-in-use': 
            this.errorMessage = 'Account with this e-mail already exists';
            break;
          case 'auth/invalid-email':
            this.errorMessage = "Invalid e-mail";
            break;
          case 'auth/weak-password':
              this.errorMessage = "Password is weak. Try picking a stronger one";
              break;
          default:
            this.errorMessage = error.message;
            console.log(error);
        }
      }
    );
  }
}
