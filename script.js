"use strict";


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

