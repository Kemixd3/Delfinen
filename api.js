async function deleteData(id, type) {
  // delete item globally
  const url = `${endpoint}/${type}/${id}.json`;
  const response = await fetch(url, { method: "DELETE" });
  if (response.ok) {
    //delete locally
    document.querySelector(`#${id}`).remove();
    //show user message
    response_message("SUCCESS! DATA SLETTET");
  } else if (!response.ok) {
    response_message("ERROR: DATA IKKE SLETTET");
  }
}
//getting a specific user with the uid from auth

export async function getUserId() {
  try {
    const user = await firebase.auth().currentUser;
    const uid = await user.uid;

    const endpoint =
      "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app";
    const response = await fetch(`${endpoint}/users/${uid}.json`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const userData = await response.json();
    const id = Object.keys(userData)[0];

    return id;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    throw error;
  }
}
//smart way of getting all ids inside user => uid => (id)
export async function getAllUserIds(token) {
  try {
    const endpoint =
      "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/users.json";
    const response = await fetch(`${endpoint}?auth=${token}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching user IDs.");
    }

    const usersData = await response.json();
    const userIds = Object.keys(usersData).map((userId) => usersData[userId]);

    const userData = userIds.filter((user) => typeof user === "object");

    return userData.map((user) => Object.values(user)[0]);
  } catch (error) {
    console.error("Error fetching user IDs:", error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const userDataForm = document.getElementById("userDataForm");

  userDataForm.addEventListener("submit", async function (e) {
    //console.log("works");
    e.preventDefault();

    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const userType = document.getElementById("userType").value;

    const gender = document.getElementById("gender").value;
    const phone = document.getElementById("phone").value;
    //const payed = document.getElementById("payed").checked;

    const user = firebase.auth().currentUser;
    const uid = user.uid;

    const userData = {
      name: name,
      age: age,
      userType: userType,

      gender: gender,
      phone: phone,
      //payed: payed,
    };
    //PATCH private data inside uid/id
    const id = await getUserId();
    console.log(await getUserId());
    const endpoint = `https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}/${id}.json`;

    fetch(endpoint, {
      method: "PATCH",
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("User data updated successfully");
        } else {
          throw new Error("Failed to update user data");
        }
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  });
});

async function displayUserData() {
  try {
    const user = firebase.auth().currentUser;
    const uid = user.uid;
    const id = await getUserId();
    //console.log("works");

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
    //the form fields with the user data
    const age = document.getElementById("age");

    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const userTypeSelect = document.getElementById("userType");
    const genderSelect = document.getElementById("gender");

    //set the form field values

    age.value = userData.age || "0";
    nameInput.value = userData.name || "0";
    phoneInput.value = userData.phone || "0";
    userTypeSelect.value = userData.userType || "0";
    genderSelect.value = userData.gender || "0";
  } catch (error) {
    console.error("Error displaying user data:", error);
    throw error;
  }
}

//getting all profiles with auth token
export async function getProfiles(token, uid) {
  console.log(token);
  const endpoint =
    "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/users";
  const response = await fetch(`${endpoint}.json?auth=${token}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching user profiles.");
  }
  const users = await getAllUserIds(token);
  console.log("works", users);
  const users1 = await response.json();

  const tableContainer = document.getElementById("table-container");

  //clear existing table content
  tableContainer.innerHTML = "";

  //create new table
  const table = document.createElement("table");
  table.classList.add("user-profiles");

  //create table header
  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = [
    "Navn",
    "Alder",
    "Email",
    "Køn",
    "Gruppe",
    "Abonnement",
    "Betalingsdato",
    "Abonnementspris",
    "Restance",
    "Opdater bruger",
  ];

  headers.forEach((headerText) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = headerText;
    headerCell.classList.add("header-cell"); // Add the CSS class
    headerRow.appendChild(headerCell);
  });

  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  //create the table body
  const tableBody = document.createElement("tbody");

  Object.entries(users).forEach(([userId, user]) => {
    const userRow = document.createElement("tr");

    //name
    const nameCell = document.createElement("td");
    nameCell.textContent = user.name;
    nameCell.classList.add("table-cell");
    userRow.appendChild(nameCell);

    //age
    const ageCell = document.createElement("td");
    ageCell.textContent = user.age;
    ageCell.classList.add("table-cell");
    userRow.appendChild(ageCell);

    //email
    const emailCell = document.createElement("td");
    emailCell.textContent = user.email;
    emailCell.classList.add("table-cell");
    userRow.appendChild(emailCell);

    //gender
    const genderCell = document.createElement("td");
    genderCell.textContent = user.gender;
    genderCell.classList.add("table-cell");
    userRow.appendChild(genderCell);

    //stage
    const stageCell = document.createElement("td");
    stageCell.textContent = user.stage;
    stageCell.classList.add("table-cell");
    userRow.appendChild(stageCell);

    //subscription
    const subscriptionCell = document.createElement("td");
    subscriptionCell.textContent = user.subscription;
    subscriptionCell.classList.add("table-cell");
    userRow.appendChild(subscriptionCell);

    //billingdateCell
    const billingdateCell = document.createElement("td");
    billingdateCell.textContent = user.billingdate;
    billingdateCell.classList.add("table-cell");
    userRow.appendChild(billingdateCell);

    //membershipFee
    const membershipFee = document.createElement("td");
    membershipFee.textContent = user.membershipFee;
    membershipFee.classList.add("table-cell");
    userRow.appendChild(membershipFee);

    //payed
    const payed = document.createElement("td");
    payed.textContent = user.payed;
    payed.classList.add("table-cell");
    userRow.appendChild(payed);

    //updatebutton
    const updateCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Slet bruger";

    const updateButton = document.createElement("button");
    updateButton.textContent = "Opdater data";
    updateButton.addEventListener("click", () => {
      updateButton.textContent = user.uid;
    });
    deleteButton.addEventListener("click", () => {
      //update button click for the specific user in the table
      console.log("userid", user);
      deleteButton.textContent = user.uid;

      //email is not null
      if (user.email !== null) {
        //confirmation popup
        const confirmed = confirm(
          "Er du sikker på at du vil slette denne bruger?"
        );
        //delete request til at slette bruger ud fra deres uid
        if (confirmed) {
          try {
            const endpoint =
              "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app/users";
            const response = fetch(`${endpoint}/${user.uid}.json`, {
              method: "DELETE",
            });

            if (response.ok) {
              console.log("User deleted successfully");
            } else {
              throw new Error("OK");
            }
          } catch (error) {
            console.error("Error deleting user:", error);
            //error message in a confirm view
            window.alert("Bruger er nu tom men google auth er stadig aktiv");
          }
        }
      } else {
        console.log("Cannot delete user with null email");
        //error message or handle the case when email is null
        window.alert(
          "Kan ikke slette allerede tom bruger eller bruger med høj status"
        );
      }
      location.reload();
    });

    updateButton.classList.add("update-button");
    updateCell.appendChild(updateButton);

    deleteButton.classList.add("delete-button");
    updateCell.appendChild(deleteButton);

    userRow.appendChild(updateCell);

    tableBody.appendChild(userRow);
  });

  table.appendChild(tableBody);
  tableContainer.appendChild(table);
}
