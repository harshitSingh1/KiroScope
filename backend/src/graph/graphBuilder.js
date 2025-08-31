function buildGraphData(parsedData) {
  const nodes = [];
  const edges = [];
  const uniqueNodes = new Set();
  const edgeSet = new Set();

  parsedData.components.forEach((component) => {
    if (!uniqueNodes.has(component.name)) {
      uniqueNodes.add(component.name);
      nodes.push({
        data: {
          id: component.name,
          label: component.name,
          type: component.type,
        }
      });
    }
  });

  const addEdgeIfUnique = (source, target, label) => {
    const edgeKey = `${source}-${target}`;
    const reverseEdgeKey = `${target}-${source}`;
    
    if (!edgeSet.has(edgeKey) && !edgeSet.has(reverseEdgeKey)) {
      edgeSet.add(edgeKey);
      edges.push({
        data: {
          id: `edge-${edgeKey}`,
          source: source,
          target: target,
          label: label
        }
      });
      return true;
    }
    return false;
  };

  const componentNames = parsedData.components.map(c => c.name);
  
  for (let i = 1; i < componentNames.length; i++) {
    const source = componentNames[i - 1];
    const target = componentNames[i];
    
    if (source !== target && uniqueNodes.has(source) && uniqueNodes.has(target)) {
      addEdgeIfUnique(source, target, 'communicates with');
    }
  }

  const frontend = nodes.find(n => n.data.type === 'frontend');
  const backend = nodes.find(n => n.data.type === 'backend');
  const database = nodes.find(n => n.data.type === 'database');
  const aiModel = nodes.find(n => n.data.type === 'ai-model');
  if (frontend && backend) {
    const edgeKey = `${frontend.data.id}-${backend.data.id}`;
    const reverseEdgeKey = `${backend.data.id}-${frontend.data.id}`;
    
    const edgeIndex = edges.findIndex(e => 
      e.data.id === `edge-${edgeKey}` || e.data.id === `edge-${reverseEdgeKey}`
    );
    
    if (edgeIndex !== -1) {
      edges.splice(edgeIndex, 1);
    }
    
    edges.push({
      data: {
        id: 'edge-fe-be',
        source: frontend.data.id,
        target: backend.data.id,
        label: 'API calls'
      }
    });
  }

  if (backend && database) {
    const edgeKey = `${backend.data.id}-${database.data.id}`;
    const reverseEdgeKey = `${database.data.id}-${backend.data.id}`;
    
    const edgeIndex = edges.findIndex(e => 
      e.data.id === `edge-${edgeKey}` || e.data.id === `edge-${reverseEdgeKey}`
    );
    
    if (edgeIndex !== -1) {
      edges.splice(edgeIndex, 1);
    }
    edges.push({
      data: {
        id: 'edge-be-db',
        source: backend.data.id,
        target: database.data.id,
        label: 'database queries'
      }
    });
  }

  if (backend && aiModel) {
    const edgeKey = `${backend.data.id}-${aiModel.data.id}`;
    const reverseEdgeKey = `${aiModel.data.id}-${backend.data.id}`;
    const edgeIndex = edges.findIndex(e => 
      e.data.id === `edge-${edgeKey}` || e.data.id === `edge-${reverseEdgeKey}`
    );
    
    if (edgeIndex !== -1) {
      edges.splice(edgeIndex, 1);
    }
    
    edges.push({
      data: {
        id: 'edge-be-ai',
        source: backend.data.id,
        target: aiModel.data.id,
        label: 'AI predictions'
      }
    });
  }

  return { nodes, edges };
}

module.exports = { buildGraphData };