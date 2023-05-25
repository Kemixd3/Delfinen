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

// Get a reference to the signup form and signup message
const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signup-message");
console.log(new Date());
// Add a listener to the signup form for when it's submitted
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get the email and password input values
  const email = signupForm.email.value;
  const password = signupForm.password.value;
  const name = signupForm.name.value;
  const age = signupForm.birthdate.value;
  const userType = signupForm.userType.value;
  const subscription = signupForm.subscription.value;
  const gender = signupForm.gender.value;
  const phone = signupForm.phone.value;
  const payed = signupForm.toggleButton.value;

  // Call Firebase auth to create a new user with the email and password
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      //successful, update the message and clear the form
      signupMessage.innerHTML = `User created with email: ${userCredential.user.email}`;

      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          //user is signed in
          const endpoint =
            "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/users";
          const user = firebase.auth().currentUser;
          const uid = user.uid;
          const email = user.email;

          var date = new Date();

          var birthdate = new Date(age);
          var age1 = date.getFullYear() - birthdate.getFullYear();

          if (
            date.getMonth() < birthdate.getMonth() ||
            (date.getMonth() === birthdate.getMonth() &&
              date.getDate() < birthdate.getDate())
          ) {
            age1--;
          }

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
          var stage = "none";
          if (age1 >= 18) {
            stage = "senior";
          } else {
            stage = "junior";
          }
          const userData = {
            uid: uid,
            email: email,
            oprettet: formattedDate,
            billingdate: formattedDate,
            name: name,
            age: age1,
            userType: userType,
            subscription: subscription,
            stage: stage,
            gender: gender,
            phone: phone,
            payed: payed,
          };

          fetch(`${endpoint}/${uid}.json`, {
            method: "POST",
            body: JSON.stringify(userData),
          })
            .then((response) => {
              if (response.ok) {
                console.log("User with custom ID created successfully");
              } else {
                window.alert("Error creating user with custom ID:", error);
              }
            })
            .catch((error) => {
              window.alert("Error creating user with custom ID:", error);
              console.error("Error creating user with custom ID:", error);
            });
        }
      });
      signupForm.reset();
    })
    .catch((error) => {
      //errorhandle
      signupMessage.innerHTML = `Error: ${error.message}`;
    });
});

function goToMain() {
  window.location.href = "index.html";
}

const FormFee = document.getElementById("FormFee");
//event listener to the form submission
signupForm.addEventListener("change", function (event) {
  event.preventDefault(); // Prevent form submission

  //user input values
  const age = calculateAge(document.getElementById("birthdate").value);
  const active = document.getElementById("subscription").value === "active";
  const ageGroup = getAgeGroup(age);

  //calculate membership fee
  const membershipFee = calculateMembershipFee(age, active, ageGroup);

  //the membership fee
  //console.log("Expected Membership Fee:", membershipFee);
  FormFee.innerHTML = ` <br> Prisen for dit abbonoment: ${membershipFee}`;
});

//calculate age based on birthdate input
function calculateAge(birthdate) {
  const today = new Date();
  const birthdateObj = new Date(birthdate);
  let age = today.getFullYear() - birthdateObj.getFullYear();
  const monthDiff = today.getMonth() - birthdateObj.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthdateObj.getDate())
  ) {
    age--;
  }
  return age;
}

//to determine the age group based on age
function getAgeGroup(age) {
  if (age < 18) {
    return "junior";
  } else {
    return "senior";
  }
}

//to calculate the membership fee
function calculateMembershipFee(age, active, ageGroup) {
  let membershipFee = 0;
  if (active) {
    if (ageGroup === "junior") {
      membershipFee = 1000;
    } else if (ageGroup === "senior" && age < 60) {
      membershipFee = 1600;
    } else if (ageGroup === "senior" && age >= 60) {
      membershipFee = 1600 * 0.75; //25% discount for members over 60
    }
  } else {
    //passive membership fee
    membershipFee = 500;
  }
  return membershipFee;
}
