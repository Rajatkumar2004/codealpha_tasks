let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  checkReminders(); // Check for reminders every minute
  setInterval(checkReminders, 60000); // Check every minute
});

function addTask() {
  const input = document.getElementById("taskInput");
  const reminderTime = document.getElementById("reminderTime");
  const errorMsg = document.getElementById("errorMsg");
  const addBtn = document.getElementById("addBtn");
  const taskText = input.value.trim();
  const reminder = reminderTime.value;

  if (taskText === "") {
    input.classList.add("error");
    errorMsg.classList.add("show");
    return;
  } else {
    input.classList.remove("error");
    errorMsg.classList.remove("show");
  }

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const timestamp = new Date().toLocaleString();
  
  // Add task with reminder time
  tasks.push({ 
    text: taskText, 
    completed: false, 
    timestamp,
    reminderTime: reminder ? new Date(reminder).toISOString() : null // Store reminder time
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  input.value = "";
  reminderTime.value = ""; // Clear reminder time
  renderTasks(currentFilter);
}

function renderTasks(filter = "all") {
  currentFilter = filter;
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const list = document.getElementById("taskList");
  const noTasksMessage = document.getElementById("noTasksMessage");
  list.innerHTML = "";

  const filtered = tasks.map((task, i) => ({ ...task, originalIndex: i }))
    .filter(task => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    });

  if (filtered.length === 0) {
    noTasksMessage.style.display = "block";
    setTimeout(() => noTasksMessage.style.display = "none", 2000);
    return;
  }

  noTasksMessage.style.display = "none";
  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = ` 
      <span>${task.text} <small>(Created: ${task.timestamp})</small></span>
      <button onclick="toggleComplete(${task.originalIndex})">${task.completed ? "Undo" : "Done"}</button>
      <button onclick="deleteTask(${task.originalIndex})">Delete</button>
      ${task.reminderTime ? `<br><small>Reminder set for: ${new Date(task.reminderTime).toLocaleString()}</small>` : ""}
    `;
    list.appendChild(li);
  });
}

function toggleComplete(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (tasks[index]) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks(currentFilter);
  }
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (tasks[index]) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks(currentFilter);
  }
}

function filterTasks(filter) {
  renderTasks(filter);
}

// Function to check if any reminders match the current time
function checkReminders() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const currentTime = new Date().toISOString();

  tasks.forEach((task, i) => {
    if (task.reminderTime && task.reminderTime <= currentTime && !task.completed) {
      alert(`Reminder: ${task.text}`);
      // Optional: Mark the task as completed when reminder goes off
      task.completed = true;
      tasks[i] = task; // Update task in array
    }
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}
