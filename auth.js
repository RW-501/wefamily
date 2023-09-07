/*
// Function to log in with email and password
 const loginWithEmailPassword = async (email, password) => {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    return true;
  } catch (error) {
    console.error('Login failed:', error.message);
    return false;
  }
};
*/

// Function to log out the user
 const logout = async () => {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.error('Logout failed:', error.message);
  }
};
/*
// Function to register a new user with email and password
 const registerWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    // Create a user document in Firestore
    await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
      email: email,
      // Add more user-related data here
    });
    return true;
  } catch (error) {
    console.error('Registration failed:', error.message);
    return false;
  }
};
*/
// Function to check if a user is logged in
 var checkUserLogin = () => {
  return firebase.auth().currentUser;
};
