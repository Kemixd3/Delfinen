
const endpoint = "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app";

var firebaseConfig = {
  apiKey: " AIzaSyBuWPU0zqYMOcDZqhBj6lYhJ1Clo8hoFfI",
  authDomain: "javascriptgame-4e4c9.firebaseapp.com",
  databaseURL: "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "javascriptgame-4e4c9",
  storageBucket: "javascriptgame-4e4c9.appspot.com",
  messagingSenderId: "929889109178",
  appId: "1:929889109178:web:b4b41c9bf29de88d7c6e83",
  measurementId: "G-P40H8CJHRK"
};
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();


// Get a reference to the signup form and signup message
const signupForm = document.getElementById('signup-form');
const signupMessage = document.getElementById('signup-message');

// Add a listener to the signup form for when it's submitted
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get the email and password input values
  const email = signupForm.email.value;
  const password = signupForm.password.value;
  
  // Call Firebase auth to create a new user with the email and password
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // If successful, update the message and clear the form
      signupMessage.innerHTML = `User created with email: ${userCredential.user.email}`;
      
firebase.auth().onAuthStateChanged(function(user) {
  console.log("HEY")
  if (user) {
    // User is signed in
    const endpoint = "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/users.json";
    const user = firebase.auth().currentUser;
    const uid = user.uid;
    const email = user.email;
    
    const userData = {
      uid: uid,
      email: email,
      name: "",
      age: "",
      country: ""
    };
    
    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    .then(response => {
      console.log('Profile created successfully:', response);
    })
    .catch(error => {
      console.error('Error creating profile:', error);
    });
    
  }
});
      signupForm.reset();
    })
    .catch((error) => {
      // If unsuccessful, update the message with the error
      signupMessage.innerHTML = `Error: ${error.message}`;
    });
});


function goToMain() {
  window.location.href = "index.html";
}
