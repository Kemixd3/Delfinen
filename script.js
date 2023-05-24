"use strict";
import { calculateMembershipFee } from "/pay.js";
import { getTotalMembershipFee } from "/pay.js";
import { getAllResults } from "/pay.js";
import { getUserId } from "/api.js";
import { getByTournament } from "/pay.js";
import { getTopSwimmersByDiscipline } from "/pay.js";
import { displayTopSwimmers } from "/pay.js";
import { getProfiles } from "/api.js";

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
const openButton = document.getElementById("open-dialog-button");
const closeButton = document.getElementById("close-dialog-button");
const dialog = document.getElementById("dialog");

openButton.addEventListener("click", () => {
  dialog.style.display = "block";
});

closeButton.addEventListener("click", () => {
  dialog.style.display = "none";
});
var oceanheading = document.getElementById("welcome-text");
oceanheading.style.display = "block";

var signIn = document.getElementById("signIn");
signIn.style.display = "block";

profilForm.style.display = "none";
// Function to handle the hashchange event
let title;
let totalFee;
let allRes;
let elevation;
let localtoken;

async function handleHashChange(uid, name, email, stage, token) {
  const hash = window.location.hash;
  const welcome = document.getElementById("wText");
  const view = hash.substring(1);

  content.innerHTML = "";
  const text = document.getElementById("curUser");
  const userDataContainer = document.getElementById("userDataContainer");
  const top5swimmers = document.getElementById("top5swimmers");
  userDataContainer.style.display = "none";
  top5swimmers.style.display = "none";
  text.style.display = "none";

  if (view === "home") {
    console.log("her", token);
    if (token != null) {
      welcome.innerHTML = "Delfinen profil side";
      text.style.display = "block";

      userDataContainer.style.display = "block";
      signIn.style.display = "none";
      content.innerHTML = `
      <h2 class="profile-heading">Indsend træningsresultat</h2>
      <form style="flex-direction: inherit" id="profilForm2">
      
        <select id="trainType" required>
          <option value="exerciser" disabled selected>Træning</option>
          <option value="competition">Konkurrence</option>
        </select>
        <br>
        <select id="userType2" required>
          <option value="" disabled selected>Vælg din svømmekategori</option>
          <option value="Butterfly">Butterfly</option>
          <option value="Crawl">Crawl</option>
          <option value="Backcrawl">Rygcrawl</option>
          <option value="breaststroke">Brystsvømning</option>
        </select>
        <br>
        <input type="text" id="tournament" name="tournament" placeholder="Indtast navnet på stævnet" style="display: none;" />
       
        <input type="text" id="placement" name="placement" placeholder="Stævne lokation" style="display: none;" />
        <input type="number" id="time" name="time" placeholder="Indtast din tid i sekunder" required />
        
        <button type="submit">Indsend resultat</button>
      </form>
      <table id='ARTable'></table>
    `;
      const trainTypeSelect = document.getElementById("trainType");
      const tournamentInput = document.getElementById("tournament");
      const placementInput = document.getElementById("placement");

      trainTypeSelect.addEventListener("change", function () {
        const selectedValue = this.value;
        console.log(selectedValue);
        if (selectedValue === "competition") {
          tournamentInput.style.display = "block";
          placementInput.style.display = "block";
        } else {
          tournamentInput.style.display = "none";
          placementInput.style.display = "none";
        }
      });

      if (title != null) {
        title = title.toLowerCase();
      }

      if ((title == "cashier" || title == "admin") && elevation) {
        content.innerHTML += `<div class="fees"><p>Samlet indkomst for perioden: ${totalFee} DKK</p> </div><br>`;
      }
      if ((title == "coach" || title == "admin") && elevation) {
        async function displayResults() {
          try {
            // Call the getAllResults function to retrieve the results data
            const results = await getAllResults(localtoken);

            const traintype = "competition";

            const results2 = await getByTournament(localtoken, traintype);

            const topswimmers = await getTopSwimmersByDiscipline(localtoken);
            top5swimmers.style.display = "block";

            displayTopSwimmers(topswimmers);
            console.log(results2);
            // Display the filtered results
          } catch (error) {
            console.error("Error displaying results:", error);
          }
        }

        // Call the displayResults function to show the initial results
        displayResults();
      }

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
          traintype: signupForm2.trainType.value,
          placement: signupForm2.placement.value,
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
          const response = await fetch(
            `${endpoint}/results.json?auth=${token}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          const responseData = await response.json();
          console.log("Membership fee posted successfully:", responseData);
        } catch (error) {
          console.error("Error posting membership fee:", error);
        }
      });
    }
  } else if (view === "about") {
    welcome.innerHTML = "Om os:";
  } else if (view === "user") {
    welcome.innerHTML = "Delfinen Svømmegruppens forside:";
    content.innerHTML = `<div class="newspaper">
    <h1>Nyheder:</h1>
    <img src="newspaper-image.jpg" alt="Newspaper Image">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dignissim convallis tempus.</p>
    </div>`;
  }
}

// Cache frequently used elements
var signInButton = document.getElementById("sign-in-button");
var emailInput = document.getElementById("email2");
var passwordInput = document.getElementById("password2");
var curUserElement = document.getElementById("curUser");
var signIn = document.getElementById("signIn");
var signupBtn = document.getElementById("signupBtn");

// Extract the logic into separate functions
const signInWithEmailAndPassword = (email, password) =>
  firebase.auth().signInWithEmailAndPassword(email, password);

const displayUserInfo = async (user) => {
  const { uid } = user;
  const userData = await getProfile(uid);
  const name = userData?.name || "none";
  curUserElement.innerHTML = `Brugernavn: ${name}&nbsp;</br>Mail: ${
    user.email || "none"
  }`;
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

    //if (userData && Object.keys(values[2])[0] != null) {
    //  const firstName = Object.keys(values[2])[0];
    //  title = firstName.toLowerCase();
    //}

    const objWithName = values.find((obj) => obj.hasOwnProperty("name"));
    //console.log(objWithName)
    return objWithName;
  }
}

firebase.auth().onAuthStateChanged(async function (user) {
  if (user) {
    const token = await user.getIdToken();

    async function displayUserData() {
      try {
        const user = firebase.auth().currentUser;
        const uid = user.uid;
        const id = await getUserId();
        console.log(uid, "FEJL");

        const endpoint =
          "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/users";

        const response = await fetch(`${endpoint}/${uid}/${id}.json`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const userData = await response.json();
        console.log(userData.email);
        // Populate the form fields with the user data
        const age = document.getElementById("age");

        const nameInput = document.getElementById("name");
        const phoneInput = document.getElementById("phone");
        const userTypeSelect = document.getElementById("userType");
        const genderSelect = document.getElementById("gender");
        const subscription = document.getElementById("subscription");
        // Set the form field values

        age.value = userData.age || "0";
        nameInput.value = userData.name || "0";
        phoneInput.value = userData.phone || "0";
        userTypeSelect.value = userData.userType || "0";
        genderSelect.value = userData.gender || "0";
        subscription.value = userData.subscription || "0";
      } catch (error) {
        console.error("Error displaying user data:", error);
        throw error;
      }
    }

    // Call the function to display the user data in the form
    displayUserData()
      .then(() => {
        console.log("User data displayed successfully");
      })
      .catch((error) => {
        // Handle the error
        console.error("Error:", error);
      });
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
    title = userData.name;
    window.addEventListener("hashchange", function () {
      // Code to be executed when the URL hash changes

      handleHashChange(
        uid,
        userData.name,
        userData.email,
        userData.stage,
        token,
        elevation
      );
    });
    if (
      userData &&
      userData.age != null &&
      userData.subscription != null &&
      userData.stage != null
    ) {
      curUserElement.innerHTML = `Brugernavn: ${
        userData.name || "none"
      }&nbsp;</br>Mail: ${userData.email || "none"}`;

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
      // Add event listener for hashchange event

      const subscriptionPrice = calculateMembershipFee(
        userData.age,
        userData.subscription,
        userData.stage,
        uid,
        id
      );
      curUserElement.innerHTML += ` <br> Til betaling i næste periode: ${subscriptionPrice} DKK&nbsp;`;
      console.log(user.uid);
    } else {
      curUserElement.innerHTML = `Brugernavn: ${
        userData.name || "none"
      } &nbsp;</br>Mail: ${user.email || "none"}`;
      console.log("User data is missing or incomplete");
    }
    if (userData && (userData.admin || userData.coach || userData.cashier)) {
      elevation = true;
      console.log(elevation);
      localtoken = token;
      totalFee = await getTotalMembershipFee(token);
      allRes = await getAllResults(token);
      const profiles = await getProfiles(localtoken, uid);
    }

    try {
      const token = await user.getIdToken();
      handleHashChange(
        uid,
        userData.name,
        userData.email,
        userData.stage,
        token,
        elevation
      );
    } catch (error) {
      console.error("Error obtaining authentication token:", error);
    }

    const logoutButton = document.getElementById("logoutButton");
    logoutButton.addEventListener("click", function () {
      firebase
        .auth()
        .signOut()
        .then(function () {
          location.reload();
          console.log("User logged out successfully.");
        })
        .catch(function (error) {
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
