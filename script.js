"use strict";




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







var signInButton = document.getElementById('sign-in-button');
signInButton.addEventListener('click', function(event) {
  event.preventDefault();
  var email = document.getElementById('email2').value;
  var password = document.getElementById('password2').value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(userCredential) {
      // User signed in successfully
      var user = userCredential.user;
      console.log('Signed in as ' + user.email);
    })
    .catch(function(error) {
      // Handle sign-in error
      console.error(error);
    });
});






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
      signupForm.reset();
    })
    .catch((error) => {
      // If unsuccessful, update the message with the error
      signupMessage.innerHTML = `Error: ${error.message}`;
    });
});


function goToSignup() {
  window.location.href = "signup.html";
}
function goToMain() {
  window.location.href = "index.html";
}


var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("myHeader").style.top = "0";
  } else {
    document.getElementById("myHeader").style.top = "-150px"; // Hide the header when scrolling down
  }
  prevScrollpos = currentScrollPos;
}



//Initialize Firebase realtime database
window.addEventListener("load", init);




//========Function to display the products using FETCH GET request=======
async function init() {

}

//======Function to edit product data using PUT request========

