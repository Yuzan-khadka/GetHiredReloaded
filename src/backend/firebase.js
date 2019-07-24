import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAk1d3d46iJsTipT0ipwBmkEv4O-qEEOP0",
    authDomain: "gethiredreloaded-62d29.firebaseapp.com",
    databaseURL: "https://gethiredreloaded-62d29.firebaseio.com",
    projectId: "gethiredreloaded-62d29",
    storageBucket: "gethiredreloaded-62d29.appspot.com",
    messagingSenderId: "37516044376",
    appId: "1:37516044376:web:98ad131910857cc4"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const f= firebase;
  export const database= firebase.database();
  export const auth= firebase.auth();
  export const storage= firebase.storage();
