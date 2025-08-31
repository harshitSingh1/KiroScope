const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database connection (simplified)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'taskmanager',
  password: 'password',
  port: 5432,
});

// Routes
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/suggestions/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    
    // Call AI model service
    const aiResponse = await axios.post('http://localhost:5000/api/predict', {
      task_id: taskId
    });

    res.json(aiResponse.data.suggestions);
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    res.status(500).json({ error: 'Failed to get AI suggestions' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});