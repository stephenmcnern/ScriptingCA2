// I could get neither the image or the arrow keys to work without breaking my displayStudent() function.

let studentsByCourse = { Computing: [], Applied: [], Games: [] };
let courseName = "";

// Event Listeners for buttons
let addButton = document.getElementById("addStudentButton");
addButton.addEventListener("click", addStudent);
let removeButton = document.getElementById("removeStudentButton");
removeButton.addEventListener("click", removeStudent);

function isValidName(name) {
  let nameCheck = /^[A-Za-z]+(?: [A-Za-z]+)?$/;
  return nameCheck.test(name);
}
function isValidEmail(email) {
  let emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailCheck.test(email);
}
function isValidCAO(caoNumber) {
  let caoCheck = /^L\d{8}$/;
  return caoCheck.test(caoNumber);
}
function isDuplicateCAO(caoNumber) {
  for (let [, students] of Object.entries(studentsByCourse)) {
    if (students.some((student) => student.caoNumber == caoNumber)) {
      return true;
    }
  }
  return false;
}

function addStudent() {
  console.log("Start addStudent");

  // Retrieve values
  let firstNameInput = document.getElementById("firstName");
  let lastNameInput = document.getElementById("lastName");
  let emailInput = document.getElementById("email");
  let caoInput = document.getElementById("caoNumber");
  let genderInput = document.getElementById("gender");
  let courseInput = document.querySelector('input[name="course"]:checked');
  let termsInput = document.getElementById("terms");
  let dobInput = document.getElementById("dob");

  if (!termsInput.checked) {
    alert("You must agree with the terms and conditions");
    return;
  }

  // Validate Input
  let isValidFirstName = isValidName(firstNameInput.value);
  let isValidLastName = isValidName(lastNameInput.value);
  let isValidEmailString = isValidEmail(emailInput.value);
  let isValidCAOString = isValidCAO(caoInput.value);
  let isValidGender = genderInput.value !== "";
  let isValidCourse = courseInput !== null;

  // Change CSS colours depending on validation results
  firstNameInput.classList.toggle("invalid", !isValidFirstName);
  lastNameInput.classList.toggle("invalid", !isValidLastName);
  emailInput.classList.toggle("invalid", !isValidEmailString);
  caoInput.classList.toggle("invalid", !isValidCAOString);
  genderInput.classList.toggle("invalid", !isValidGender);

  if (
    isValidFirstName &&
    isValidLastName &&
    isValidEmailString &&
    isValidCAOString &&
    isValidGender &&
    termsInput.checked &&
    isValidCourse
  ) {
    let caoNumber = caoInput.value.trim();
    if (isDuplicateCAO(caoNumber)) {
      alert("Duplicate CAO number");
    } else {
      // Combine the separate details into a student profile
      let fullName = `${firstNameInput.value
        .charAt(0)
        .toUpperCase()}${firstNameInput.value
        .slice(1)
        .toLowerCase()} ${lastNameInput.value
        .charAt(0)
        .toUpperCase()}${lastNameInput.value.slice(1).toLowerCase()}`;

      courseName = courseInput.value;

      studentsByCourse[courseName].push({
        fullName,
        email: emailInput.value,
        caoNumber,
        dob: dobInput.value,
        gender: genderInput.value,
      });

      // Update the right-side panel
      displayStudents();
    }
  } else {
    alert("Please Fill In All Fields Correctly");
  }
  console.log("End addStudent");
}

// Find which course a CAO number is registered to. Required for my removeStudent function
function getCourseByCAO(caoNumber) {
  for (let course in studentsByCourse) {
    let studentsInCourse = studentsByCourse[course];
    if (studentsInCourse.some((student) => student.caoNumber == caoNumber)) {
      return course;
    }
  }
}


function removeStudent() {
  let caoToRemove = prompt("Enter the CAO of the student to remove");
  if (!caoToRemove) {
    alert("Field cannot be empty");
    return;
  }
  let courseTitle = getCourseByCAO(caoToRemove);
  if (!courseTitle) {
    alert("Student not found");
    return;
  }

  let indexToRemove = studentsByCourse[courseTitle].findIndex(
    (student) => student.caoNumber == caoToRemove
  );
  if (indexToRemove !== -1) {
    studentsByCourse[courseTitle].splice(indexToRemove, 1);
    alert(`Student ${caoToRemove} removed from ${courseTitle} database. `);
    displayStudents(); // Update the right-side panel
  } else {
    alert("Student not found");
  }
}

function displayStudents() {
  // Get the course divs
  let computingStudentsDiv = document.getElementById("computing-students");
  let appliedStudentsDiv = document.getElementById("applied-students");
  let gamesStudentsDiv = document.getElementById("games-students");

  // Clear content
  computingStudentsDiv.querySelector("ul").innerHTML = "";
  appliedStudentsDiv.querySelector("ul").innerHTML = "";
  gamesStudentsDiv.querySelector("ul").innerHTML = "";

  // Display Student on right panel
  for (let [course, students] of Object.entries(studentsByCourse)) {
    let courseStudentsList = document.createElement("ul");

    students.forEach((student) => {
      studentListItem = document.createElement("li");
      studentListItem.textContent = student.fullName;
      studentListItem.addEventListener("click", () =>
        displayStudentDetails(student)
      );
      courseStudentsList.appendChild(studentListItem);
    });

    // Updte the list
    switch (course) {
      case "Computing":
        computingStudentsDiv
          .querySelector("ul")
          .appendChild(courseStudentsList);
        break;
      case "Applied":
        appliedStudentsDiv.querySelector("ul").appendChild(courseStudentsList);
        break;
      case "Games":
        gamesStudentsDiv.querySelector("ul").appendChild(courseStudentsList);
        break;
      default:
        break;
    }
  }
}
// Display student details in the lower-left
function displayStudentDetails(student) {
  let detailsDiv = document.getElementById("student-details");
  detailsDiv.innerHTML = `
      <h3>Student Details</h3>
      <p><strong>Name:</strong> ${student.fullName}</p>
      <p><strong>Email:</strong> ${student.email}</p>
      <p><strong>CAO Number:</strong> ${student.caoNumber}</p>
      <p><strong>DOB:</strong> ${student.dob}</p>
      <p><strong>Gender:</strong> ${student.gender}</p>
  `;
}
