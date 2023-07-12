function showGeneratingMessage() {
    alert('Resume is generating...');
  }
  
  function myChangeFunction(input1) {
    var input2 = document.getElementById('myInput2');
    input2.value = input1.value;
  }

 
  function addExperience() {
    const experienceSection = document.getElementById('experienceSection');
    const experienceDiv = document.createElement('div');
    experienceDiv.className = 'experience';
    experienceDiv.innerHTML = `
      <label for="CompanyNameInput">Company Name:</label>
      <input type="text" onchange="myChangeFunction(this)" placeholder="Company Name" name="CompanyName" required>
      <label for="StartYearInput">Start Year:</label>
      <input type="text" onchange="myChangeFunction(this)" placeholder="Start Year" name="StartYear1" required>
      <label for="EndYearInput">End Year:</label>
      <input type="text" onchange="myChangeFunction(this)" placeholder="End Year" name="EndYear1" required>
      <label for="DescriptionInput">Description:</label>
      <input type="text" onchange="myChangeFunction(this)" placeholder="Description" name="Description1" required>
      <button type="button" style="background-color:red" onclick="removeExperience(this)">Remove</button>
    `;
    experienceSection.appendChild(experienceDiv);
  }
  

  function addEducation() {
    const educationSection = document.getElementById('educationSection');
    const newEducationDiv = document.createElement('div');
    newEducationDiv.classList.add('education');
    newEducationDiv.innerHTML = `
    <input type="text" onchange="myChangeFunction(this)" placeholder="School Name" name="SchoolName" required>
    <input type="text" onchange="myChangeFunction(this)" placeholder="Start Year" name="StartYear" required>
    <input type="text" onchange="myChangeFunction(this)" placeholder="End Year" name="EndYear" required>
    <input type="text" onchange="myChangeFunction(this)" placeholder="Description" name="Description" required>
    <button type="button" style="background-color:red" onclick="removeEducation(this)">Remove</button>
      
    `;
    educationSection.appendChild(newEducationDiv);
    
  }
  function addAchievement() {
    const achievementsSection = document.getElementById('achievementsSection');
  
    const newAchievement = document.createElement('div');
    newAchievement.classList.add('achievement');
  
    newAchievement.innerHTML = `
    <input type="text"  onchange="myChangeFunction(this)" placeholder="Achievement Field"  name="AchievementType" required>       
    <input type="text"  onchange="myChangeFunction(this)" placeholder="Achievement Description" name="AchievementDescription" required>
      <button type="button" style="background-color:red" onclick="removeAchievement(this)">Remove</button>
    `;
  
    achievementsSection.appendChild(newAchievement);
  }
  
  function removeAchievement(button) {
    const achievement = button.parentElement;
    achievement.remove();
  }

  function removeEducation(button) {
    const education = button.parentElement;
    education.remove();
  }

  function removeExperience(button) {
    const experience = button.parentElement;
    experience.remove();
  }
  
  const form = document.getElementById('ResumeForm');
  const resultContainer = document.getElementById('resultContainer');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    alert("Please wait for 15 seconds & after the pop message in output check your folder.");

    
    const formData = new FormData(form);
    const Name = formData.get('Name');
    const LastName = formData.get('LastName');
    const JobTitle = formData.get('JobTitle');
    const EmailAddress = formData.get('EmailAddress');
    const PhoneNumber = formData.get('PhoneNumber');
    const LinkedIn = `<a href="${formData.get('LinkedIn')}">LinkedIn</a>`;
    const Summary = formData.get('Summary');
    const ContentBlock = `<img src=\"${formData.get('ContentBlock')}">`;
    const template_id = formData.get('template_id');
    const Skills = formData.get('Skills');
    const achievements = [];
    const educationData = [];
    const experienceData = [];

    const achievementTypes = formData.getAll('AchievementType');
    const achievementDescriptions = formData.getAll('AchievementDescription');

    for (let i = 0; i < achievementTypes.length; i++) {
      const achievement = {
        Type: achievementTypes[i],
        Description: achievementDescriptions[i]
      };

      achievements.push(achievement);
    }

   

    const schoolNames = formData.getAll('SchoolName');
    const startYears = formData.getAll('StartYear');
    const endYears = formData.getAll('EndYear');
    const descriptions = formData.getAll('Description');
    
    for (let i = 0; i < schoolNames.length; i++) {
      const education = {
        SchoolName: schoolNames[i],
        Year: `${startYears[i]} - ${endYears[i]}`,
        Description: descriptions[i]
      };
    
      educationData.push(education);
    }
    
    const companyNames = formData.getAll('CompanyName');
    const startYears1 = formData.getAll('StartYear1');
    const endYears1 = formData.getAll('EndYear1');
    const descriptions1 = formData.getAll('Description1');

    

    for (let i = 0; i < companyNames.length; i++) {
      const experience = {
        CompanyName: companyNames[i],
        Year: `${startYears1[i]} - ${endYears1[i]}`,
        Description: descriptions1[i]
      };

      experienceData.push(experience);
    }


    fetch('/resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Name,
        LastName,
        JobTitle,
        EmailAddress,
        PhoneNumber,
        LinkedIn,
        Summary,
        ContentBlock,
        template_id,
        Skills,
        Achievements: achievements,
        Education: educationData,
        Experience: experienceData
      })
    })
    .then(response => response.json())
    .then(data => {
      
      resultContainer.innerHTML = '<h3>Resume data saved successfully.</h3>'+'<img src="https://media.tenor.com/Hw7f-4l0zgEAAAAC/check-green.gif" alt="">';
     
       
    })
    .catch(error => {
      console.error('Error:', error);
      resultContainer.innerHTML = '<h3>Internal Server Error.</h3>';
    });
  });