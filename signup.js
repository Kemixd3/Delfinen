
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
console.log(new Date())
// Add a listener to the signup form for when it's submitted
signupForm.addEventListener('submit', (e) => {
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




  // Call Firebase auth to create a new user with the email and password
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // If successful, update the message and clear the form
      signupMessage.innerHTML = `User created with email: ${userCredential.user.email}`;
      
firebase.auth().onAuthStateChanged(function(user) {
  console.log("HEY")
 
  if (user) {
    // User is signed in
    const endpoint = "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/users";
    const user = firebase.auth().currentUser;
    const uid = user.uid;
    const email = user.email;
   

    var date = new Date();

    var birthdate = new Date(age);
    var age1 = date.getFullYear() - birthdate.getFullYear();
    
    if (
      date.getMonth() < birthdate.getMonth() ||
      (date.getMonth() === birthdate.getMonth() && date.getDate() < birthdate.getDate())
    ) {
       age1--;
    }
    console.log(age1);






    var options1 = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'Europe/Copenhagen' };
    var formattedDate = date.toLocaleString('da-DK', options1);
    var stage = "none"
    if (age1 >= 18){
      stage = "senior"
    } else {
      stage = "junior"
    }
    const userData = {
      uid: uid,
      email: email,
      oprettet: formattedDate,
      name: name,
      age: age1,
      userType: userType,
      subscription: subscription,
      stage: stage,
      gender: gender,
      phone: phone
    };
    
    
    fetch(`${endpoint}/${uid}.json`, {
      method: 'POST',
      body: JSON.stringify(userData)
    })
      .then((response) => {
        if (response.ok) {
          console.log('User with custom ID created successfully');
        } else {
          throw new Error('Failed to create user with custom ID');
        }
      })
      .catch((error) => {
        console.error('Error creating user with custom ID:', error);
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
