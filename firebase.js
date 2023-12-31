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
var userID = "";
function checkUserLogin() {
    return new Promise((resolve, reject) => {
        const userLoggedIn = localStorage.getItem('userLoggedIn');
        console.log('userLoggedIn', userLoggedIn);
            const auth = firebase.auth();

        if (userLoggedIn === 'true' && auth ) {

            const unsubscribe = auth.onAuthStateChanged((user) => {
                unsubscribe(); // Unsubscribe to avoid memory leaks

                if (user) {
    localStorage.setItem('userLoggedIn', 'true');
                    // User is logged in
                     userID = user.uid;
                    console.log('User is logged in with UID:', userID);
                    resolve(userID);
                    // You can also perform actions here when the user is logged in.
                } 
 
            });
        } else {

		    localStorage.setItem('userLoggedIn', 'false');
                    // User is logged out
                    console.error('No user is signed in');
                    resolve(null);
                    // You can also perform actions here when the user is logged out.
           window.location.href = '/wefamily';
                

        }
    });
}



function logoutUser() {
    localStorage.setItem('userLoggedIn', 'false');
    // Optionally, sign the user out from Firebase if needed
    firebase.auth().signOut().then(() => {
	        window.location.href = '/wefamily/'; // Replace 'login.html' with your login page URL

        console.log('User logged out successfully.');
    }).catch((error) => {
        console.error('Error logging out:', error);
    });
}




  const badWords = ['shit', 's h i t', 'queer', 'q u e e r', 'gay', 'pussy', 'dick', 'nigger', 'n i g g e r', 'nigga', 'damn', 'd a m n', 'God damn', 'fucking','fuck', 'f u c k', 'b i t c h', 'bitch', 'cum'];

function filterContent(content) {
  if (content == null) {
    return '';
  }

  // Convert content to a string if it's not already
let  trimmedStr = String(content);
 content = trimmedStr.trim();

  // Perform case-insensitive matching for bad words
  const caseInsensitiveBadWords = badWords.map((word) => word.toLowerCase());

  // Replace bad words with asterisks
  caseInsensitiveBadWords.forEach((word) => {
    const regex = new RegExp(`\\b(${escapeRegExp(word)})\\b`, 'gi');
    content = content.replace(regex, '***');
  });

  // Regular expression for matching contact information
  const contactInfoRegex = /\b(?:\d{10}|\d{3}[-.\s]\d{3}[-.\s]\d{4}|(?:\+\d{1,2}\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})\b/g;

  // Replace contact information with asterisks
  content = content.replace(contactInfoRegex, '***');

content = sanitizeHTMLscript(content);

  // Sanitize HTML content to remove potentially harmful elements and attributes
  content = sanitizeHTML(content);

  return content;
}

// Sample HTML sanitizer function (replace with a more robust library in your implementation)
function sanitizeHTML(content) {
 const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const sanitizedContent = doc.body.textContent || doc.body.innerText;
  return content;
}
function sanitizeHTMLscript(html) {
  const cleanHTML = DOMPurify.sanitize(html);
  return cleanHTML;
}
/*
// Example usage:
const dirtyHTML = "<script>alert('XSS attack!')</script>";
console.log(sanitizedHTML);
*/

// Helper function to escape special characters in the word
function escapeRegExp(word) {
  return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/*
// Example usage:
const userInput = "Hello, this is a muthafucking malicious <script>alert('Gotcha hoe ass!');</script> Bitch content!";
const filteredContent = filterContent(userInput);
console.log("filteredContent   "   +filteredContent);

*/

function input(text){

	let userInput = filterContent(text);
	return userInput;
}



function showMainMessage(message) {
  const messageBox = document.getElementById('mainMessageBox');
  const messageText = document.getElementById('mainMessageText');

  messageText.innerHTML = message;

  // Show the message box by setting 'top' to 0
      messageBox.style.display = 'block'; 
  messageBox.style.top = '0';

  // Add a click event listener to the close button
  const closeButton = document.getElementById('mainCloseButton');
  closeButton.addEventListener('click', () => {
    // Hide the message box by moving it back above the viewport
    messageBox.style.top = '-300px';
      messageBox.style.display = 'none'; 

  });
}

// Example usage:
//showMainMessage("Thank you for rating the quiz!");


function formatDateToMonthDay(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return 'Invalid date';
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [year, month, day] = dateString.split('-').map(Number);

  if (isNaN(year) || isNaN(month) || isNaN(day) ||
      month < 1 || month > 12 || day < 1 || day > 31) {
    return 'Invalid date';
  }

  const formattedDate = `${months[month - 1]} ${day}`;
  return formattedDate || "";
}
