const fs = require('fs').promises;
const path = require('path');

async function parseSpec(projectPath) {
  const specPath = path.join(projectPath, '.kiro', 'spec.md');
  let specContent;

  try {
    specContent = await fs.readFile(specPath, 'utf8');
  } catch (error) {
    console.warn('No .kiro/spec.md file found. Using fallback data.');
    // Fallback: crude analysis of the project structure
    return parseProjectStructure(projectPath);
  }

  // Very basic parsing logic for the hackathon.
  // This is a prime candidate for improvement with real NLP.
  const components = [];
  const lines = specContent.split('\n');

  for (const line of lines) {
    // Look for lines that seem to define components
    if (line.match(/(frontend|backend|api|database|model|service)/i)) {
      const nameMatch = line.match(/`([^`]+)`/) || line.match(/"([^"]+)"/);
      const name = nameMatch ? nameMatch[1] : line.trim();
      const type = line.match(/frontend/i) ? 'frontend' :
                   line.match(/backend/i) ? 'backend' :
                   line.match(/database/i) ? 'database' :
                   line.match(/(model|ai|ml)/i) ? 'ai-model' : 'service';

      components.push({ name, type });
    }
  }

  // If the spec was too vague, fall back to structure parsing
  if (components.length === 0) {
    return parseProjectStructure(projectPath);
  }

  return { components };
}

async function parseProjectStructure(projectPath) {
  // This is a fallback function that looks at folder names
  const items = await fs.readdir(projectPath, { withFileTypes: true });
  const components = [];

  for (const item of items) {
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
      let type;
      if (item.name.match(/(frontend|web|ui)/i)) type = 'frontend';
      else if (item.name.match(/(backend|api|server)/i)) type = 'backend';
      else if (item.name.match(/(model|ai|ml|data)/i)) type = 'ai-model';
      else if (item.name.match(/(db|database|storage)/i)) type = 'database';
      else type = 'service';

      components.push({ name: item.name, type });
    }
  }
  return { components };
}

module.exports = { parseSpec };