const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// In-memory "database"
let tasks = [
  { id: 1, text: "Build CI/CD Pipeline", done: false },
  { id: 2, text: "Deploy to Azure", done: false },
];

// *** NEW: A counter to ensure unique IDs ***
// Using tasks.length + 1 is unreliable if tasks are deleted.
let nextTaskId = 3;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Get all tasks
app.get('/', (req, res) => {
  res.render('index', { tasks: tasks });
});

// Add a new task
app.post('/add', (req, res) => {
  const newTask = {
    id: nextTaskId++, // Use the incrementing counter for a unique ID
    text: req.body.taskText,
    done: false
  };
  tasks.push(newTask);
  res.redirect('/');
});

// *** NEW: Delete a task ***
app.post('/delete', (req, res) => {
  // Get the ID from the hidden input in the form
  const taskIdToDelete = parseInt(req.body.taskId, 10);
  
  // Filter the tasks array, keeping only the tasks that DO NOT match the ID
  tasks = tasks.filter(task => task.id !== taskIdToDelete);
  
  // Redirect back to the home page
  res.redirect('/');
});


app.listen(port, () => {
  console.log(`To-Do app listening on port ${port}`);
});