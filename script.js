"use strict";

const endpoint = "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app";
const signupForm2 = document.querySelector('#signup-form');
const modalContent = document.querySelector('.mailUsed');
const signupContent = document.querySelector('#modal-signup');




var firebaseConfig = {
  apiKey: "AIzaSyBuWPU0zqYMOcDZqhBj6lYhJ1Clo8hoFfI",
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






const usersEndpoint = `${endpoint}/users.json`;

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;
  const bio = signupForm['signup-bio'].value;
  const niveau = signupForm['signup-option'].value;

  
  var date = new Date();
  var options1 = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'Europe/Copenhagen' };
  var formattedDate = date.toLocaleString('da-DK', options1);
  // create user object
  const user = {
    email: email,
    password: password,
    bio: bio,
    niveau: niveau,
    dato: formattedDate,
  }
 
  // check if email already exists
  fetch(usersEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const existingUser = Object.values(data).find(user => user.email === email);
      if (existingUser) {
        modalContent.innerHTML = '<h1>Emailen er allerede i brug</h1>';
        throw new Error('This email is already registered');
        
        
      } else {
        // send POST request to Firebase Realtime Database
        return fetch(usersEndpoint, {
          method: 'POST',
          body: JSON.stringify(user),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('User created successfully!');
      const modal = document.querySelector('#modal-signup');
      goToMain()
      
      signupForm.querySelector('.error').innerHTML = ''
    })
    .catch(error => {
      console.error('There was an error creating the user:', error);
      //signupForm.querySelector('.error').innerHTML = error.message;
    });
});

  
    



//========Function to display the products using FETCH GET request=======
async function init() {

}

//======Function to edit product data using PUT request========

