import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    // firebase.initializeApp({
    //   apiKey: "AIzaSyBVS08HyXOwY-GN_TWdbJKG9fKx3vTHXZU",
    //   authDomain: "time-tracker-770a9.firebaseapp.com",
    //   projectId: "time-tracker-770a9"
    // });
  }
}
