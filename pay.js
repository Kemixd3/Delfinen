const endpoint = "https://javascriptgame-4e4c9-default-rtdb.europe-west1.firebasedatabase.app";

export function calculateMembershipFee(age, active, ageGroup, uid, id) {
    let membershipFee = 0;
    console.log(age, active, ageGroup)
    if (active) {
      if (ageGroup === 'junior' && age < 18) {
        membershipFee = 1000;
      } else if (ageGroup === 'senior' && age >= 18 && age < 60) {
        membershipFee = 1600;
      } else if (ageGroup === 'senior' && age >= 60) {
        membershipFee = 1600 * 0.75; // 25% discount for members over 60
      }
    } else {
      membershipFee = 500; // Passive membership fee
    }

    const data = {
      membershipFee: membershipFee
      
    };

    fetch(`${endpoint}/users/${uid}/${id}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Membership fee posted successfully:', data);
      })
      .catch(error => {
        console.error('Error posting membership fee:', error);
      });
  
    return membershipFee;
  }






  export async function getTotalMembershipFee(token) {
    try {
      const response = await fetch(`${endpoint}/users.json?auth=${token}`);
      
      const usersData = await response.json();
  
      let totalMembershipFee = 0;
  
      // Loop through each user and accumulate the membership fees
      for (const userId in usersData) {
        const id = Object.keys(usersData[userId])[0];
        const user = (usersData[userId])[id];

        
       if (user != null) {
        const membershipFee = user.membershipFee || 0;
        console.log(membershipFee)
        totalMembershipFee += membershipFee;
       }

      
      }
  
      console.log('Total Membership Fee:', totalMembershipFee);
      return totalMembershipFee;
    } catch (error) {
      console.error('Error fetching users:', error);
      return 0;
    }
  }
  