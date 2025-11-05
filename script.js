// ======= Local Storage Helpers =======
const getStudents = () => JSON.parse(localStorage.getItem('students')) || [];
const saveStudents = (data) => localStorage.setItem('students', JSON.stringify(data));
const getAttendance = () => JSON.parse(localStorage.getItem('attendance')) || {};
const saveAttendance = (data) => localStorage.setItem('attendance', JSON.stringify(data));

// ======= Elements =======
const form = document.getElementById('add-student-form');
const studentList = document.getElementById('students-list');
const webcam = document.getElementById('webcam');
const startBtn = document.getElementById('start-attendance');
const reportBtn = document.getElementById('view-report');
const reportSection = document.getElementById('report-section');
const reportList = document.getElementById('report-list');
const closeReport = document.getElementById('close-report');

// ======= Webcam Access =======
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => webcam.srcObject = stream)
  .catch(err => alert("Please enable camera access!"));

// ======= Display Students =======
function renderStudents() {
  const students = getStudents();
  studentList.innerHTML = '';
  if (students.length === 0) {
    studentList.innerHTML = '<li>No students added yet.</li>';
    return;
  }
  students.forEach((s, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<img src="${s.photo}" width="40" height="40" style="border-radius:50%; vertical-align:middle;"> 
                    <b>${s.name}</b>`;
    studentList.appendChild(li);
  });
}

// ======= Add Student =======
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('student-name').value.trim();
  const photoInput = document.getElementById('student-photo');
  const file = photoInput.files[0];

  if (!file || !name) return alert("Please provide both name and photo!");

  const reader = new FileReader();
  reader.onload = function () {
    const students = getStudents();
    students.push({ name, photo: reader.result });
    saveStudents(students);
    renderStudents();
    form.reset();
  };
  reader.readAsDataURL(file);
});

// ======= Take Attendance (Simulated Recognition) =======
startBtn.addEventListener('click', () => {
  const students = getStudents();
  if (students.length === 0) return alert("No students found!");

  let attendance = getAttendance();
  const today = new Date().toLocaleDateString();

  attendance[today] = attendance[today] || [];

  // Simulate random recognition
  const randomStudent = students[Math.floor(Math.random() * students.length)];
  if (!attendance[today].includes(randomStudent.name)) {
    attendance[today].push(randomStudent.name);
    alert(`✅ ${randomStudent.name} marked present!`);
  } else {
    alert(`${randomStudent.name} is already marked present.`);
  }

  saveAttendance(attendance);
});

// ======= View Report =======
reportBtn.addEventListener('click', () => {
  const attendance = getAttendance();
  const today = new Date().toLocaleDateString();
  const todayData = attendance[today] || [];
  reportList.innerHTML = '';

  if (todayData.length === 0) {
    reportList.innerHTML = `<li>No one marked present today.</li>`;
  } else {
    todayData.forEach(name => {
      const li = document.createElement('li');
      li.textContent = `✔️ ${name}`;
      reportList.appendChild(li);
    });
  }

  reportSection.classList.remove('hidden');
});

closeReport.addEventListener('click', () => {
  reportSection.classList.add('hidden');
});

// ======= Init =======
renderStudents();
