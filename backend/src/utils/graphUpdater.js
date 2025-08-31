const { parseSpec } = require('../parser/specParser');
const { buildGraphData } = require('../graph/graphBuilder');

let currentGraphData = { nodes: [], edges: [] };

/**
 * Updates the graph data by re-parsing the project
 */
async function updateGraph() {
  try {
    console.log('🔄 Updating graph data...');
    const projectPath = process.env.TARGET_PROJECT_PATH || '../target-project';
    const parsedData = await parseSpec(projectPath);
    currentGraphData = buildGraphData(parsedData);
    console.log('✅ Graph updated successfully');
    return currentGraphData;
  } catch (error) {
    console.error('❌ Error updating graph:', error);
    throw error;
  }
}

/**
 * Gets the current graph data
 */
function getCurrentGraphData() {
  return currentGraphData;
}

module.exports = { updateGraph, getCurrentGraphData };