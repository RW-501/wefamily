// firebase.js

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

  const firebaseConfig = {
    apiKey: "AIzaSyCt2g6HmhffcrVvsH3urZynlJq_fLL0_A8",
    authDomain: "wefamily-44c0b.firebaseapp.com",
    projectId: "wefamily-44c0b",
    storageBucket: "wefamily-44c0b.appspot.com",
    messagingSenderId: "469288138698",
    appId: "1:469288138698:web:773a2e1f17f2f392f38133",
    measurementId: "G-XNM9BJZ3F7"
  };

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
