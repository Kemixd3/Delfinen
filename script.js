"use strict";
import { calculateMembershipFee } from "/pay.js";
import { getTotalMembershipFee } from "/pay.js";

const endpoint =
  "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app";

var firebaseConfig = {
  apiKey: " AIzaSyBuWPU0zqYMOcDZqhBj6lYhJ1Clo8hoFfI",
  authDomain: "javascriptgame-4e4c9.firebaseapp.com",
  databaseURL:
    "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "javascriptgame-4e4c9",
  storageBucket: "javascriptgame-4e4c9.appspot.com",
  messagingSenderId: "929889109178",
  appId: "1:929889109178:web:b4b41c9bf29de88d7c6e83",
  measurementId: "G-P40H8CJHRK",
};

firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();

// Get the content container element
var content = document.getElementById("content");

var oceanheading = document.getElementById("welcome-text");
oceanheading.style.display = "block";

var signIn = document.getElementById("signIn");
signIn.style.display = "block";

profilForm.style.display = "none";
// Function to handle the hashchange event
function handleHashChange(uid, name, email, stage, token) {
  // Get the hash value from the URL

  var hash = window.location.hash;
  var welcome = document.getElementById("wText");

  // Remove the '#' character from the hash
  var view = hash.substring(1);

  // Clear the content container
  content.innerHTML = "";

  // Load the appropriate content based on the view
  if (view === "home") {
    welcome.innerHTML = "Delfinen profil side";
    signIn.style.display = "none";
    content.innerHTML = `
    <button id="logoutButton">Log ud</button>
      <form id="profilForm2">
        <select id="userType2">
          <option value="" disabled selected>Vælg din svømmekategori</option>
          <option value="exerciser">Butterfly</option>
          <option value="Crawl">Crawl</option>
          <option value="Backcrawl">Rygcrawl </option>
          <option value="breaststroke">Brystsvømning</option>
        </select>
        <br>
        <input type="tournament" id="tournament" name="tournament" placeholder="Skriv navnet på konkurrencen" />
        <br>
        <input type="number" id="time" name="time" placeholder="Skriv din tid i sekunder" />
        <button type="submit">Indsend resultat</button>
      </form>
    `;

    const signupForm = document.getElementById("profilForm2");
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      date = new date();
      var options1 = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "Europe/Copenhagen",
      };
      var formattedDate = date.toLocaleString("da-DK", options1);
      const data = {
        swimmingdiscipline: signupForm.userType2.value,
        tournament: signupForm.tournament.value,
        name: name,
        email: email,
        stage: stage,
        uid: uid,
        time: time,
        date: formattedDate,
      };

      fetch(`${endpoint}/results.json?auth=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Membership fee posted successfully:", data);
        })
        .catch((error) => {
          console.error("Error posting membership fee:", error);
        });
    });

  } else if (view === "about") {
    welcome.innerHTML = "Om os:";
  } else if (view === "user") {
    welcome.innerHTML = "Delfinen Svømmegruppe:";
  }
}

// Add event listener for hashchange event
window.addEventListener("hashchange", handleHashChange);

// Initial page load - call the handleHashChange function

var signInButton = document.getElementById("sign-in-button");
signInButton.addEventListener("click", function (event) {
  event.preventDefault();
  var email = document.getElementById("email2").value;
  var password = document.getElementById("password2").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(async function (userCredential) {
      // User signed in successfully
      var user = userCredential.user;
      const uid = user.uid;
      var curUserElement = document.getElementById("curUser");

      // Append the variable to the existing string
      //curUserElement.innerHTML = "Bruger: " + user.email + "&nbsp;";

      console.log("Signed in as " + user.email);

      const userData = await getProfile(uid);

      if (userData != null && userData.name != null) {
        curUserElement.innerHTML =
          "Brugernavn: " +
          userData.name +
          "&nbsp;" +
          "</br>" +
          "Mail: " +
          (user.email || "none");
      } else {
        curUserElement.innerHTML =
          "Brugernavn: " +
          (userData.name || "none") +
          "&nbsp;" +
          "</br>" +
          "Mail: " +
          (user.email || "none");
      }
      //const data = JSON.parse(userData);
      var signIn = document.getElementById("signIn");

      var signupBtn = document.getElementById("signupBtn");
      signIn.style.display = "none";
      signupBtn.style.display = "none";
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
};

//Initialize Firebase realtime database
//window.addEventListener("load", init);

//========Function to display the products using FETCH GET request=======
//async function init() {

//}

//======Function to edit product data using PUT request========

async function getProfile(uid) {
  //console.log("PROF", uid)
  const response = await fetch(`${endpoint}/users/${uid}.json`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const userData = await response.json();

  if (userData != null) {
    const values = Object.values(userData);
    console.log(userData,"here");
    const objWithName = values.find((obj) => obj.hasOwnProperty("name"));
    //console.log(objWithName)
    return objWithName;
  }
}

firebase.auth().onAuthStateChanged(async function (user) {
  if (user) {
    var signIn = document.getElementById("signIn");
    
    var signupBtn = document.getElementById("signupBtn");
    signIn.style.display = "none";
    signupBtn.style.display = "none";
    // User is signed in, you can proceed with accessing the protected resources
    const uid = user.uid;
    console.log("logging in");
    
    const header = document.getElementById('pageFill');
    const footer = document.getElementById('footer');
    header.style.height = '100vh';
    footer.style.backgroundColor = 'white';

    var curUserElement = document.getElementById("curUser");

    const userData = await getProfile(uid);
    console.log("id", userData);
    console.log("id", userData);

    if (
      userData &&
      userData.age != null &&
      userData.subscription != null &&
      userData.stage != null
    ) {
      curUserElement.innerHTML =
        "Brugernavn: " +
        (userData.name || "none") +
        "&nbsp;" +
        "</br>" +
        "Mail: " +
        (userData.email || "none");

      const response = await fetch(`${endpoint}/users/${uid}.json`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const userdate2 = await response.json();
      const id = Object.keys(userdate2)[0];
      console.log(id);

      const subscriptionPrice = calculateMembershipFee(
        userData.age,
        userData.subscription,
        userData.stage,
        uid,
        id
      );
      curUserElement.innerHTML +=
        " <br> Til betaling i næste periode: " +
        subscriptionPrice +
        " DKK" +
        "&nbsp;";
      console.log(user.uid);
    } else {
      curUserElement.innerHTML =
        "Brugernavn: " +
        "none" +
        "&nbsp;" +
        "</br>" +
        "Mail: " +
        (user.email || "none");
      // Handle the case when userData is undefined or missing required properties
      console.log("User data is missing or incomplete");
    }

    if (userData.admin != null && userData.admin == true) {
      user
        .getIdToken()
        .then(async function (token) {
          const totalMemberShopFees = await getTotalMembershipFee(token);
          curUserElement.innerHTML +=
            " <br>Samlet indkomst for alle aktive abbonomenter: " +
            totalMemberShopFees +
            " DKK" +
            "&nbsp;";
          console.log("Admin signed in");
        })
        .catch(function (error) {
          console.error("Error obtaining authentication token:", error);
        });
    }
    if (userData.cashier != null && userData.cashier == true) {
      user

        .getIdToken()
        .then(async function (token) {
          const totalMemberShopFees = await getTotalMembershipFee(token);
          curUserElement.innerHTML +=
            " <br>Samlet indkomst for alle aktive abbonomenter: " +
            totalMemberShopFees +
            " DKK" +
            "&nbsp;";
          console.log("Cashier signed in");
        })
        .catch(function (error) {
          console.error("Error obtaining authentication token:", error);
        });
    }
    if (userData.coach != null && userData.coach == true) {
      console.log("coach signed in");
    }

    user
      .getIdToken()
      .then(async function (token) {
        const totalMemberShopFees = await handleHashChange(
          uid,
          userData.name,
          userData.email,
          userData.stage,

          token
        );
      })
      .catch(function (error) {
        console.error("Error obtaining authentication token:", error);
      });

    var logoutButton = document.getElementById("logoutButton");
    logoutButton.style.display = "block";
    // Add a click event listener to the logout button
    logoutButton.addEventListener("click", function () {
      // Call the signOut method to log out the user
      firebase
        .auth()
        .signOut()

        .then(function () {
          location.reload();
          // Logout successful
          console.log("User logged out successfully.");
          // You can redirect to a different page or update UI as needed
        })
        .catch(function (error) {
          // An error occurred
          console.log("Error logging out:", error);
        });
    });

    // Make the API call here
    // ...
  } else {
    console.log("logged out");
    var logoutButton = document.getElementById("logoutButton");
    logoutButton.style.display = "none";
    // User is signed out
    // Handle sign-out case if needed
  }
});
