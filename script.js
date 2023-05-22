"use strict";
import { calculateMembershipFee } from "/pay.js";
import { getTotalMembershipFee } from "/pay.js";
import { getAllResults } from "/pay.js";

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

// Get the content container element
var content = document.getElementById("content");

var oceanheading = document.getElementById("welcome-text");
oceanheading.style.display = "block";

var signIn = document.getElementById("signIn");
signIn.style.display = "block";

profilForm.style.display = "none";
// Function to handle the hashchange event

function handleHashChange(uid, name, email, stage, token) {
  const hash = window.location.hash;
  const welcome = document.getElementById("wText");
  const view = hash.substring(1);
  content.innerHTML = "";
  const text = document.getElementById("curUser");
  text.style.display = "none";

  if (view === "home") {
    welcome.innerHTML = "Delfinen profil side";
    text.style.display = "block";
    signIn.style.display = "none";
    content.innerHTML = `
      <form id="profilForm2">
        <select id="userType2">
          <option value="" disabled selected>Vælg din svømmekategori</option>
          <option value="exerciser">Butterfly</option>
          <option value="Crawl">Crawl</option>
          <option value="Backcrawl">Rygcrawl </option>
          <option value="breaststroke">Brystsvømning</option>
        </select>
        <br>
        <input type="text" id="tournament" name="tournament" placeholder="Skriv navnet på konkurrencen" />
        <br>
        <input type="number" id="time" name="time" placeholder="Skriv din tid i sekunder" />
        <button type="submit">Indsend resultat</button>
      </form>
    `;

    const signupForm2 = document.getElementById("profilForm2");
    signupForm2.addEventListener("submit", async (e) => {
      e.preventDefault();

      const date = new Date().toLocaleString("da-DK", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "Europe/Copenhagen",
      });

      const data = {
        swimmingdiscipline: signupForm2.userType2.value,
        tournament: signupForm2.tournament.value,
        name,
        email,
        stage,
        uid,
        time: signupForm2.time.value,
        date,
      };

      try {
        const response = await fetch(`${endpoint}/results.json?auth=${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const responseData = await response.json();
        console.log("Membership fee posted successfully:", responseData);
      } catch (error) {
        console.error("Error posting membership fee:", error);
      }
    });
  } else if (view === "about") {
    welcome.innerHTML = "Om os:";
  } else if (view === "user") {
    welcome.innerHTML = "Delfinen Svømmegruppe:";
  }
}

// Add event listener for hashchange event
window.addEventListener("hashchange", handleHashChange);

// Cache frequently used elements
var signInButton = document.getElementById("sign-in-button");
var emailInput = document.getElementById("email2");
var passwordInput = document.getElementById("password2");
var curUserElement = document.getElementById("curUser");
var signIn = document.getElementById("signIn");
var signupBtn = document.getElementById("signupBtn");

// Extract the logic into separate functions
const signInWithEmailAndPassword = (email, password) => firebase.auth().signInWithEmailAndPassword(email, password);


const displayUserInfo = async (user) => {
  const { uid } = user;
  const userData = await getProfile(uid);
  const name = userData?.name || "none";
  curUserElement.innerHTML = `Brugernavn: ${name}&nbsp;</br>Mail: ${user.email || "none"}`;
};

function handleSignIn(event) {
  event.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
      console.log(`Signed in as ${user.email}`);
      displayUserInfo(user);
      signIn.style.display = "none";
      signupBtn.style.display = "none";
    })
    .catch(console.error);
}

// Attach the optimized event listener
signInButton.addEventListener("click", handleSignIn);

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
    //console.log(values)
    const objWithName = values.find((obj) => obj.hasOwnProperty("name"));
    //console.log(objWithName)
    return objWithName;
  }
}

firebase.auth().onAuthStateChanged(async function (user) {
  if (user) {
    const signIn = document.getElementById("signIn");
    const signupBtn = document.getElementById("signupBtn");
    signIn.style.display = "none";
    signupBtn.style.display = "none";
    const uid = user.uid;
    console.log("logging in");

    var changeColor = document.getElementById("footer");
    var changeNav = document.getElementById("navBar");
    changeColor.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
    changeNav.style.backgroundColor = "rgba(255, 255, 255, 0.5)";

    const curUserElement = document.getElementById("curUser");
    const userData = await getProfile(uid);
    console.log("id", userData);

    if (userData && userData.age != null && userData.subscription != null && userData.stage != null) {
      curUserElement.innerHTML = `Brugernavn: ${userData.name || "none"}&nbsp;</br>Mail: ${userData.email || "none"}`;

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

      const subscriptionPrice = calculateMembershipFee(userData.age, userData.subscription, userData.stage, uid, id);
      curUserElement.innerHTML += ` <br> Til betaling i næste periode: ${subscriptionPrice} DKK&nbsp;`;
      console.log(user.uid);
    } else {
      curUserElement.innerHTML = `Brugernavn: none&nbsp;</br>Mail: ${user.email || "none"}`;
      console.log("User data is missing or incomplete");
    }

    const handleUser = async (role, message, action) => {
      if (userData && userData[role] != null && userData[role] === true) {
        try {
          const token = await user.getIdToken();
          await action(token);
          curUserElement.innerHTML += message;
        } catch (error) {
          console.error("Error obtaining authentication token:", error);
        }
      }
    };

    handleUser("admin", " <br>Samlet indkomst for alle aktive abbonomenter: ", getTotalMembershipFee);
    handleUser("cashier", " <br>Samlet indkomst for alle aktive abbonomenter: ", getTotalMembershipFee);
    handleUser("coach", " <br>Resultater", getAllResults);

    try {
      const token = await user.getIdToken();
      handleHashChange(uid, userData.name, userData.email, userData.stage, token);
    } catch (error) {
      console.error("Error obtaining authentication token:", error);
    }

    const logoutButton = document.getElementById("logoutButton");
    logoutButton.addEventListener("click", function () {
      firebase.auth().signOut().then(function () {
        location.reload();
        console.log("User logged out successfully.");
      }).catch(function (error) {
        console.log("Error logging out:", error);
      });
    });

    // Make the API call here
    // ...
  } else {
    console.log("logged out");
    const logoutButton = document.getElementById("logoutButton");
    logoutButton.style.display = "none";
  }
});
