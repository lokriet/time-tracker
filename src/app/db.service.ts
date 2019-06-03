import * as firebase from 'firebase';

export class DatabaseService {
  public db: firebase.firestore.Firestore;

  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyBVS08HyXOwY-GN_TWdbJKG9fKx3vTHXZU",
      authDomain: "time-tracker-770a9.firebaseapp.com",
      projectId: "time-tracker-770a9"
    });

    this.db = firebase.firestore();

    console.log('initialized database service');
    console.log(this.db);
  }

}