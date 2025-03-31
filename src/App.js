import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [task, setTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save dark mode preference in localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Add or Update Task
  const addTask = () => {
    if (task.trim() !== "") {
      let updatedTasks = [...tasks];
      if (editIndex !== null) {
        updatedTasks[editIndex].text = task;
        setEditIndex(null);
      } else {
        updatedTasks.push({ text: task, completed: false });
      }
      setTasks(updatedTasks);
      setTask("");
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  // Toggle Task Completion
  const toggleTask = (index) => {
    let updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  // Delete Task
  const deleteTask = (index) => {
    let updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // Edit Task
  const editTask = (index) => {
    setTask(tasks[index].text);
    setEditIndex(index);
  };

  return (
    <div>
      <div className="header">
        <h1>🎯To-Do List</h1>
        <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="container">
        <div className="input-section">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown} // Enter press to add/update task
            placeholder="Enter a task..."
          />
          <button onClick={addTask}>{editIndex !== null ? "Update" : "Add"}</button>
        </div>

        <ul>
          {tasks.map((item, index) => (
            <li key={index} className={item.completed ? "completed fade-in" : "fade-in"}>
              {editIndex === index ? (
                <input
                  className="edit-input"
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              ) : (
                <span onClick={() => toggleTask(index)}>{item.text}</span>
              )}
              <div>
                {editIndex === index ? (
                  <button className="update-btn" onClick={addTask}>✔️</button>
                ) : (
                  <button className="edit-btn" onClick={() => editTask(index)}>✏️</button>
                )}
                <button className="delete-btn" onClick={() => deleteTask(index)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
