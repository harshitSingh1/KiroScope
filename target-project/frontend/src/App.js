import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const getAISuggestions = async (taskId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/suggestions/${taskId}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
    }
  };

  return (
    <div className="app">
      <h1>AI Task Manager</h1>
      <div className="tasks">
        {tasks.map(task => (
          <div key={task.id} className="task" onClick={() => getAISuggestions(task.id)}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
      <div className="suggestions">
        <h2>AI Suggestions</h2>
        {suggestions.map(suggestion => (
          <div key={suggestion.id} className="suggestion">
            <p>{suggestion.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;