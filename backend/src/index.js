const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const chokidar = require('chokidar');
const path = require('path');
const { handleKiroWebhook } = require('./kiro-hooks/webhookHandler');
const { updateGraph, getCurrentGraphData } = require('./utils/graphUpdater');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Serve static files from target project for demo purposes
app.use('/project', express.static(path.join(__dirname, '../../target-project')));

// Watch for changes in the target project
const targetProjectPath = path.resolve(__dirname, process.env.TARGET_PROJECT_PATH);
const watcher = chokidar.watch(targetProjectPath, {
  ignored: /(^|[\/\\])\../,
  persistent: true,
  ignoreInitial: false
});

watcher
  .on('add', path => {
    console.log(`📁 File added: ${path}`);
    updateGraphAndEmit();
  })
  .on('change', path => {
    console.log(`📝 File changed: ${path}`);
    updateGraphAndEmit();
  })
  .on('unlink', path => {
    console.log(`🗑️ File removed: ${path}`);
    updateGraphAndEmit();
  });

// Function to update graph and emit to clients
async function updateGraphAndEmit() {
  try {
    await updateGraph();
    const graphData = getCurrentGraphData();
    io.emit('graph-update', graphData);
  } catch (error) {
    console.error('Error in updateGraphAndEmit:', error);
  }
}

// API Endpoints
app.get('/api/graph', (req, res) => {
  res.json(getCurrentGraphData());
});

app.get('/api/project/files', async (req, res) => {
  try {
    const fs = require('fs').promises;
    const files = await getProjectFileStructure(targetProjectPath);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Kiro Webhook Endpoint
app.post('/api/kiro-hook', async (req, res) => {
  try {
    const result = await handleKiroWebhook(req.body);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Helper function to get project file structure
async function getProjectFileStructure(dir, baseDir = dir) {
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    const structure = [];

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const relativePath = path.relative(baseDir, fullPath);

      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        structure.push({
          name: item.name,
          path: relativePath,
          type: 'directory',
          children: await getProjectFileStructure(fullPath, baseDir)
        });
      } else if (item.isFile() && !item.name.startsWith('.')) {
        structure.push({
          name: item.name,
          path: relativePath,
          type: 'file',
          extension: path.extname(item.name)
        });
      }
    }

    return structure;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

// Test endpoint with simple fixed data
app.get('/api/graph-test', (req, res) => {
    const testData = {
      nodes: [
        { data: { id: 'frontend', label: 'React Frontend', type: 'frontend' } },
        { data: { id: 'backend', label: 'Node.js Backend', type: 'backend' } },
        { data: { id: 'database', label: 'PostgreSQL DB', type: 'database' } },
        { data: { id: 'ai-model', label: 'AI Service', type: 'ai-model' } }
      ],
      edges: [
        { data: { id: 'edge1', source: 'frontend', target: 'backend', label: 'API calls' } },
        { data: { id: 'edge2', source: 'backend', target: 'database', label: 'queries' } },
        { data: { id: 'edge3', source: 'backend', target: 'ai-model', label: 'predictions' } }
      ]
    };
    res.json(testData);
  });

// Initialize the graph when the server starts
updateGraphAndEmit().then(() => {
  console.log('✅ Initial graph data loaded');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Kiroscope backend running on port ${PORT}`);
  console.log(`📁 Watching project: ${targetProjectPath}`);
});