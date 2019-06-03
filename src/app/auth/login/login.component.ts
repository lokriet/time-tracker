import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { faAngry } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from '../store/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  errorMessage: string;

  faBug = faAngry;

  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
  }

  onLogIn() {
      this.authService.loginWithEmailAndPassword(this.email, this.password)
      .then(
        () => {
          this.errorMessage = null;
          this.router.navigate(['/']);
        }
      )
      .catch(
        (error) => {
          switch (error.code) {
            case 'auth/wrong-password': 
              this.errorMessage = 'Wrong password';
              break;
            case 'auth/user-not-found':
              this.errorMessage = "User with this e-mail doesn't exist";
              break;
            default:
              this.errorMessage = error.message;
              console.log(error);
          }
        }
      );
  }
}
