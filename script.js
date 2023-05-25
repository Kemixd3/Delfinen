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

var oceanheading = document.getElementById("welcome-text");
oceanheading.style.display = "block";
var signIn = document.getElementById("signIn");
signIn.style.display = "block";
//elements
var signInButton = document.getElementById("sign-in-button");
var emailInput = document.getElementById("email2");
var passwordInput = document.getElementById("password2");
var curUserElement = document.getElementById("curUser");
var signIn = document.getElementById("signIn");
var signupBtn = document.getElementById("signupBtn");

//handle the hashchange event
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
  top5swimmers.style.display = "none";
  userDataContainer.style.display = "none";

  text.style.display = "none";

  if (view === "home") {
    console.log("her", token);
    if (token != null) {
      welcome.innerHTML = "Delfinen profil side";
      text.style.display = "block";
      userDataContainer.style.display = "block";
      signIn.style.display = "none";
      //form for sending in training results
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
      //Checking if the user has the role of "cashier" or "admin" and if elevation is true
      //Display the total fee if true
      if ((title == "cashier" || title == "admin") && elevation) {
        content.innerHTML += `<div class="fees"><p>Samlet indkomst for perioden: ${totalFee} DKK</p> </div><br>`;
      }
      if ((title == "coach" || title == "admin") && elevation) {
        async function displayResults() {
          try {
            //getAllResults function to retrieve the results data
            const results = await getAllResults(localtoken);

            const traintype = "competition";
            //results by tournament and store them in results2
            const results2 = await getByTournament(localtoken, traintype);
            //top swimmers by discipline and store them in topswimmers
            const topswimmers = await getTopSwimmersByDiscipline(localtoken);
            //top5swimmers.style.display = "block";

            displayTopSwimmers(topswimmers);
            console.log(results2);
          } catch (error) {
            console.error("Error displaying results:", error);
          }
        }

        //displayResults function to show the initial results
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
        //POST request to the results endpoint with the form data
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
          window.alert("Resultat er indsendt");
        } catch (error) {
          window.alert("Resultat blev ikke indsendt");
        }
      });
    }
    // Handle different views based on the hash value in the URL
  } else if (view === "about") {
    welcome.innerHTML = "Om os:";

    // Create animated elements
    const aboutSection = document.createElement("section");
    aboutSection.classList.add("about-section");

    const title = document.createElement("h2");
    title.textContent = "Velkommen til vores team";
    aboutSection.appendChild(title);

    const teamMembers = [
      { name: "Jesus. C", position: "Klubformand" },
      { name: "Nikolai. B", position: "Kasserer" },
      { name: "Silas. S", position: "Træner" },
    ];

    teamMembers.forEach((member) => {
      const memberCard = document.createElement("div");
      memberCard.classList.add(
        "member-card",
        "animate__animated",
        "animate__fadeInUp"
      );

      const memberPosition = document.createElement("p");
      memberPosition.classList.add("member-position");
      memberPosition.textContent = member.position;
      memberCard.appendChild(memberPosition);

      const memberName = document.createElement("h3");
      memberName.classList.add("member-name");
      memberName.textContent = member.name;
      memberCard.appendChild(memberName);

      aboutSection.appendChild(memberCard);
    });

    // Append the animated elements to the DOM
    welcome.appendChild(aboutSection);
  } else if (view === "user") {
    welcome.innerHTML = "Delfinen Svømmegruppens forside:";
    content.innerHTML = `
    <div class="container">
   
      <div class="newspaper">
        <img src="images/svømmer2.jpg" style="width: 20vw;"><br>
        <h1><br>Delfinens Svømmegruppe afholder vellykket velgørenhedssvømning til fordel for klimaprojekter:</h1>
        <p>14. maj 2023 <br>
        Delfinens Svømmegruppe, en af byens førende svømmeklubber, har netop afholdt en vellykket velgørenhedssvømning til fordel for klimaprojekter. Den spændende begivenhed fandt sted i det lokale svømmecenter og tiltrak både deltagere og støttere fra lokalsamfundet.

      </div>
      <div class="newspaper">
      <img src="images/svømmer.jpg" style="width: 20vw;">
      <h1><br>Delfinens Svømmegruppe: Jens vinder førstepladsen i stævne og sætter rekord:</h1>
      <p>24. maj 2023 <br>
      I en imponerende præstation har Jens, medlem af Delfinens Svømmegruppe, erobret førstepladsen og sat en ny rekord ved det prestigefyld
      te svømmestævne, der blev afholdt i går. Jens' utrolige præstation er nu at finde på forsiden som et stærk
      t bevis på klubbens talent og dedikation.
      </p>
    </div>
      <div class="newspaper">
        <img src="images/svømmer3.jpg" style="width: 20vw;"><br>
        <h1><br>Delfinens Svømmegruppe lancerer initiativ til at lære børn vandtilvænning og svømning:</h1>
        <p>15. maj 2023 <br>
        Delfinens Svømmegruppe har netop annonceret lanceringen af et spændende initiativ, der sigter mod at lære børn vandtilvænning og svømning. Klubben ønsker at øge bevidstheden om vigtigheden af ​​vandsikkerhed og give børn muligheden for at lære essentielle svømmefærdigheder.        </p>
      </div>
    </div>
  `;
  }
}

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
      //console.log(`User ${user.email}`);
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
  } else {
  }
  prevScrollpos = currentScrollPos;
};

async function getProfile(uid) {
  //console.log("uid", uid)
  //get request to get profile data store in firebase
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
        //getting the data inside of uid and id which is private profile data. Firebase is setup with rules so you need uid to GET and POST data
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
        //console.log(userData.email);
        //form fields with the user data
        const age = document.getElementById("age");

        const nameInput = document.getElementById("name");
        const phoneInput = document.getElementById("phone");
        const userTypeSelect = document.getElementById("userType");
        const genderSelect = document.getElementById("gender");
        const subscription = document.getElementById("subscription");
        //setting the form field values

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

    //function to display the user data in the form
    displayUserData()
      .then(() => {
        console.log("User data displayed successfully");
      })
      .catch((error) => {
        //error handle
        console.error("Error:", error);
      });

    //handle more ui elements on login
    const signIn = document.getElementById("signIn");
    const signupBtn = document.getElementById("signupBtn");
    signIn.style.display = "none";
    signupBtn.style.display = "none";

    const uid = user.uid;
    console.log("logging in");

    const demoContainer = document.getElementById("demo-container");
    demoContainer.style.display = "none";

    var changeColor = document.getElementById("footer");
    var changeNav = document.getElementById("navBar");
    changeColor.style.backgroundColor = "rgba(230, 230, 250)";
    changeNav.style.backgroundColor = "rgba(230, 230, 250)";

    const curUserElement = document.getElementById("curUser");
    const userData = await getProfile(uid);
    window.location.href = "#user";
    //console.log("id", userData);
    title = userData.name;
    //do stuff on window url switch
    window.addEventListener("hashchange", function () {
      //to be executed when the URL hash changes

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
      //display users data when logged in
      const response = await fetch(`${endpoint}/users/${uid}.json`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const userdate2 = await response.json();
      const id = Object.keys(userdate2)[0];
      //console.log(id);
      // Add event listener for hashchange event
      //calculate the MemberShipFee when logging in or page reload
      const subscriptionPrice = calculateMembershipFee(
        userData.age,
        userData.subscription,
        userData.stage,
        uid,
        id
      );
      //showing current membership fee for next period
      curUserElement.innerHTML += ` <br> Til betaling i næste periode: ${subscriptionPrice} DKK&nbsp;`;
    } else {
      curUserElement.innerHTML = `Brugernavn: ${
        userData.name || "none"
      } &nbsp;</br>Mail: ${user.email || "none"}`;
      console.log("User data is missing or incomplete");
    }
    //if people with higher elevation log in
    if (userData && (userData.admin || userData.coach || userData.cashier)) {
      elevation = true;
      //console.log(elevation);
      localtoken = token;
      totalFee = await getTotalMembershipFee(token);
      allRes = await getAllResults(token);
      const profiles = await getProfiles(localtoken, uid);
      //handle their elements
      const openButton = document.getElementById("open-dialog-button");
      openButton.style.display = "block";
      const closeButton = document.getElementById("close-dialog-button");
      const dialog = document.getElementById("dialog");

      openButton.addEventListener("click", () => {
        dialog.style.display = "block";
      });

      closeButton.addEventListener("click", () => {
        dialog.style.display = "none";
      });
    } else {
      const openButton = document.getElementById("open-dialog-button");
      openButton.style.display = "none";
    }
    //sending elevation along in handleHashChange
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
    logoutButton.style.display = "block";
    //handle what happens when signing out
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

    //when no one is logged in yet
  } else {
    console.log("logged out");
    const logoutButton = document.getElementById("logoutButton");
    logoutButton.style.display = "none";
    const openButton = document.getElementById("open-dialog-button");
    openButton.style.display = "none";

    demoContainer.style.display = "block";
    const demoContainer = document.createElement("div");
    demoContainer.classList.add("demo-container");
  }
});
