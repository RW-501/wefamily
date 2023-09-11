// firebase.js

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

// Get references to auth and firestore
const auth = firebase.auth();
const firestore = firebase.firestore();


     console.log(` auth `,auth);



// Check if Firebase is already loaded and Firestore is available
if (typeof firebase !== 'undefined' && typeof firebase.firestore === 'function') {
/*    // Initialize Firebase and get a reference to the Firestore database
    firebase.initializeApp(firebaseConfig);
    const firestore = firebase.firestore();

    // Access the necessary Firebase functions
    const auth = firebase.auth();
    const GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
    const createUserWithEmailAndPassword = firebase.auth().createUserWithEmailAndPassword;
    const signInWithPopup = firebase.auth().signInWithPopup;

    // Enable Firestore offline persistence if needed
    if (firebase.firestore().enablePersistence) {
        firebase.firestore().enablePersistence({ synchronizeTabs: false })
            .catch((err) => {
                console.error("Error enabling Firestore offline persistence:", err);
            });
    }*/

    console.log('Firebase found.');
} else {
    // If Firebase scripts are not loaded, dynamically load them
    console.log('Firebase scripts not found.');
/*
    const firebaseAppScript = document.createElement('script');
    firebaseAppScript.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js';

    const firestoreScript = document.createElement('script');
    firestoreScript.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js';

    const firebaseAuthScript = document.createElement('script');
    firebaseAuthScript.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js';

    // Append the script elements to the document's head
    document.head.appendChild(firebaseAppScript);
    document.head.appendChild(firestoreScript);
    document.head.appendChild(firebaseAuthScript);
*/
    // You may also want to listen for the 'load' event on these scripts
    // before initializing Firebase to ensure they are fully loaded.
}

// Function to check if a user is logged in
 function checkUserLogin(){
    const userLoggedIn = localStorage.getItem('userLoggedIn');
        console.log(` userLoggedIn `,userLoggedIn);

    if (userLoggedIn === "true") {
const user = auth.currentUser;
 const uid = user.uid;
    console.log('User UID:', uid);
        return auth.currentUser;
    }else{
    return null;
    }
}
