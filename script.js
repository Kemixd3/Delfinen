"use strict";
import { calculateMembershipFee } from '/pay.js';

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



// Get the content container element
var content = document.getElementById('content');
var signIn = document.getElementById('signIn');
signIn.style.display = 'block';
// Function to handle the hashchange event
function handleHashChange() {
  // Get the hash value from the URL
  var hash = window.location.hash;
  
  // Remove the '#' character from the hash
  var view = hash.substring(1);
  
  // Clear the content container
  content.innerHTML = '';
  
  // Load the appropriate content based on the view
  if (view === 'home') {
    
    signIn.style.display = 'none';
    content.innerHTML = '<h1 class="center-text">Delfinen Home page</h1>';
  } else if (view === 'news') {
    content.innerHTML = '<h1 class="center-text">Latest News</h1><p>Here are the latest news articles...</p>';
  } else if (view === 'about') {
    content.innerHTML = '<h1 class="center-text">About Us</h1><p>Learn more about our company...</p>';
  } else if (view === 'contact') {
    content.innerHTML = '<h1 class="center-text">Kontakt info</h1><p class="center-text cool-text">Tlf: xxxxxxxx </br> Mail: xxxxx@klubben.dk</p>';
    //var welcome = document.getElementById('welcome-text');
    //welcome.style.display = 'none';
  }
}

// Add event listener for hashchange event
window.addEventListener('hashchange', handleHashChange);

// Initial page load - call the handleHashChange function
handleHashChange();



var signInButton = document.getElementById('sign-in-button');
signInButton.addEventListener('click', function (event) {
  event.preventDefault();
  var email = document.getElementById('email2').value;
  var password = document.getElementById('password2').value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(async function (userCredential) {
      // User signed in successfully
      var user = userCredential.user;
      const uid = user.uid;
      var curUserElement = document.getElementById("curUser");

      // Append the variable to the existing string
      //curUserElement.innerHTML = "Bruger: " + user.email + "&nbsp;";

      console.log('Signed in as ' + user.email);
     
      const userData = await getProfile(uid)
   
      if (userData != null) {
        curUserElement.innerHTML = "Brugernavn: " + userData.name + "&nbsp;" + "</br>" + "Mail: " + (user.email || "none" );
    
       

      } else {
        curUserElement.innerHTML = "Brugernavn: " + (userData.name || "none") + "&nbsp;" + "</br>" + "Mail: " + (user.email || "none");
      }
      //const data = JSON.parse(userData);
      var signIn = document.getElementById('signIn');
      
      var signupBtn = document.getElementById('signupBtn');
      signIn.style.display = 'none';
      signupBtn.style.display = 'none';
    })
    .catch(function (error) {
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
//window.addEventListener("load", init);

//========Function to display the products using FETCH GET request=======
//async function init() {

//}

//======Function to edit product data using PUT request========




async function getProfile(uid) {

  //console.log("PROF", uid)
  const response = await fetch(`${endpoint}/users/${uid}.json`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  const userData = await response.json();
  if (userData != null) {
    const values = Object.values(userData);
    //console.log(values)
    const objWithName = values.find(obj => obj.hasOwnProperty('name'));
    //console.log(objWithName)
    return objWithName
  }
 
}




firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    var signIn = document.getElementById('signIn');
    
    var signupBtn = document.getElementById('signupBtn');
    signIn.style.display = 'none';
    signupBtn.style.display = 'none';
    // User is signed in, you can proceed with accessing the protected resources
    const uid = user.uid;
    console.log("logged in")
    var curUserElement = document.getElementById("curUser");
    curUserElement.innerHTML = "Brugernavn: " + (name || "none") + "&nbsp;" + "</br>" + "Mail: " + (user.email || "none");

    const userData = await getProfile(uid);
    if (userData && userData.age != null && userData.subscription != null && userData.stage != null) {
      const subscriptionPrice = calculateMembershipFee(userData.age, userData.subscription, userData.stage, uid);
      curUserElement.innerHTML += " <br> Til betaling i næste periode: " + subscriptionPrice + " DKK" + "&nbsp;";
      console.log(user.uid);
    } else {
      // Handle the case when userData is undefined or missing required properties
      console.log("User data is missing or incomplete");
    }
    
  

    
    var logoutButton = document.getElementById('logoutButton');
    logoutButton.style.display = 'block'
// Add a click event listener to the logout button
logoutButton.addEventListener('click', function() {
  // Call the signOut method to log out the user
  firebase.auth().signOut()
  
    .then(function() {
      location.reload();
      // Logout successful
      console.log('User logged out successfully.');
      // You can redirect to a different page or update UI as needed
    })
    .catch(function(error) {
      // An error occurred
      console.log('Error logging out:', error);
    });
});


    // Make the API call here
    // ...
  } else {
    
    console.log("logged out")
    var logoutButton = document.getElementById('logoutButton');
    logoutButton.style.display = 'none'
    // User is signed out
    // Handle sign-out case if needed
  }
});
