const endpoint =
  "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app";

export function calculateMembershipFee(age, active, ageGroup, uid, id) {
  let membershipFee = 0;
  //console.log(age, active, ageGroup);
  if (active) {
    if (ageGroup === "junior" && age < 18) {
      membershipFee = 1000;
    } else if (ageGroup === "senior" && age >= 18 && age < 60) {
      membershipFee = 1600;
    } else if (ageGroup === "senior" && age >= 60) {
      //25% discount for members over 60
      membershipFee = 1600 * 0.75;
    }
  } else {
    //passive membership fee
    membershipFee = 500;
  }

  const data = {
    membershipFee: membershipFee,
  };
  //PATCH request to update profile data

  return membershipFee;
}

export async function getTotalMembershipFee(token) {
  try {
    const response = await fetch(`${endpoint}/users.json?auth=${token}`);

    const usersData = await response.json();

    let totalMembershipFee = 0;

    //loop each user and calculate the membership fees
    for (const userId in usersData) {
      const id = Object.keys(usersData[userId])[0];
      const user = usersData[userId][id];

      if (user != null) {
        const membershipFee = user.membershipFee || 0;
        //console.log(membershipFee);
        totalMembershipFee += membershipFee;
      }
    }
    //console.log("Total Membership Fee:", totalMembershipFee);
    return totalMembershipFee;
  } catch (error) {
    console.error("Error fetching users:", error);
    return 0;
  }
}
//get all results
export async function getAllResults(token) {
  try {
    const response = await fetch(`${endpoint}/results.json?auth=${token}`);

    const usersResults = await response.json();
    let totalMembershipFee = [];

    for (const userId in usersResults) {
      //const id = Object.keys(usersResults[userId])[0];

      const user = usersResults[userId];

      if (user != null) {
        totalMembershipFee.push(user);
      }
    }

    return totalMembershipFee;
  } catch (error) {
    console.error("Error fetching users:", error);
    return "error in getting user results";
  }
}
//get by tournament will only get by senior og junior results
export async function getByTournament(token, traintype) {
  try {
    const response = await fetch(
      `${endpoint}/results.json?auth=${token}&orderBy="traintype"&equalTo="${traintype}"`
    );

    console.log(response);
    const usersResults = await response.json();
    //const id = Object.keys(usersResults)[0];
    //console.log("ID:", id);
    const filteredResults = Object.values(usersResults).filter(
      (result) => result.traintype.toLowerCase() === traintype.toLowerCase()
    );
    console.log(filteredResults);

    return filteredResults;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
}

export async function getTopSwimmersByDiscipline(token) {
  try {
    const response = await fetch(`${endpoint}/results.json?auth=${token}`);
    const usersResults = await response.json();

    //object to store top swimmers by discipline and category
    const topSwimmers = {
      junior: {
        butterfly: [],
        crawl: [],
        backstroke: [],
        breaststroke: [],
      },
      senior: {
        butterfly: [],
        crawl: [],
        backstroke: [],
        breaststroke: [],
      },
      tournament: [],
    };

    //tterate over the users results and categorize them by discipline and category
    Object.values(usersResults).forEach((result) => {
      const {
        swimmingdiscipline,
        stage,
        time,
        name,
        email,
        tournament,
        placement,
      } = result;
      const discipline = swimmingdiscipline.toLowerCase();
      const category = stage;
      const swimmer = { name, time, email, tournament, placement, stage };

      if (topSwimmers[category] && topSwimmers[category][discipline]) {
        topSwimmers[category][discipline].push(swimmer);
      }

      if (tournament !== null) {
        topSwimmers.tournament.push(swimmer);
      }
    });

    //sort the top swimmers by time in each discipline and category
    Object.keys(topSwimmers).forEach((category) => {
      if (category !== "tournament") {
        Object.keys(topSwimmers[category]).forEach((discipline) => {
          topSwimmers[category][discipline].sort(
            (swimmer1, swimmer2) => swimmer1.time - swimmer2.time
          );

          //keeping only the top 5 swimmers
          topSwimmers[category][discipline] = topSwimmers[category][
            discipline
          ].slice(0, 5);
        });
      }
    });

    console.log(topSwimmers);
    return topSwimmers;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
}
export function displayTopSwimmers(topSwimmers) {
  const juniorColumn = document.getElementById("junior-column");
  const seniorColumn = document.getElementById("senior-column");
  const tournamentColumn = document.getElementById("tournament-column");

  // Clear the existing content in the columns
  juniorColumn.innerHTML = "";
  seniorColumn.innerHTML = "";
  tournamentColumn.innerHTML = "";

  // Top swimmers for each discipline in the junior category
  Object.entries(topSwimmers.junior).forEach(([discipline, swimmers]) => {
    const disciplineSection = document.createElement("div");
    disciplineSection.classList.add("discipline-section");

    const disciplineHeader = document.createElement("h3");
    disciplineHeader.textContent = discipline.toUpperCase() + " Junior";
    disciplineSection.appendChild(disciplineHeader);

    swimmers.forEach((swimmer) => {
      const swimmerElement = document.createElement("div");
      swimmerElement.classList.add("swimmer");
      swimmerElement.textContent = `Navn: ${swimmer.name}, Email: ${swimmer.email}, (${swimmer.time} Sekunder)`;
      disciplineSection.appendChild(swimmerElement);
    });

    juniorColumn.appendChild(disciplineSection);
  });

  // Top swimmers for each discipline in the senior category
  Object.entries(topSwimmers.senior).forEach(([discipline, swimmers]) => {
    const disciplineSection = document.createElement("div");
    disciplineSection.classList.add("discipline-section");

    const disciplineHeader = document.createElement("h3");
    disciplineHeader.textContent = discipline.toUpperCase() + " Senior";
    disciplineSection.appendChild(disciplineHeader);

    swimmers.forEach((swimmer) => {
      const swimmerElement = document.createElement("div");
      swimmerElement.classList.add("swimmer");
      swimmerElement.textContent = `Navn: ${swimmer.name}, Email: ${swimmer.email}, (${swimmer.time} Sekunder)`;
      disciplineSection.appendChild(swimmerElement);
    });

    seniorColumn.appendChild(disciplineSection);
  });

  // Swimmers with tournament information
  const tournamentHeader = document.createElement("h2");
  tournamentHeader.textContent = "Turneringsresultater";
  tournamentColumn.appendChild(tournamentHeader);

  const tournamentSwimmers = topSwimmers.tournament;
  if (tournamentSwimmers) {
    tournamentSwimmers.forEach((swimmer) => {
      const swimmerElement = document.createElement("div");
      swimmerElement.classList.add("swimmer");
      swimmerElement.textContent = `Navn: ${swimmer.name}, Email: ${swimmer.email}, Gruppe: ${swimmer.stage},  (${swimmer.time} Sekunder)`;
      swimmerElement.textContent += ` ${swimmer.tournament},  ${swimmer.placement}`;
      tournamentColumn.appendChild(swimmerElement);
    });
  }
}
