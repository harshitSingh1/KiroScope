import React, { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SimpleGraph = ({ searchTerm }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState('integration');
  const [nodePositions, setNodePositions] = useState({});
  const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragNode, setDragNode] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [graphLayout, setGraphLayout] = useState('Default');
  const [showLayoutDropdown, setShowLayoutDropdown] = useState(false);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  const initializeNodePositions = useCallback(() => {
    const positions = {
      'react-frontend': { x: 300, y: 150 },
      'node-backend': { x: 300, y: 300 },
      'postgres-db': { x: 150, y: 400 },
      'ai-suggestion-model': { x: 450, y: 400 }
    };
    setNodePositions(positions);
    setCurrentOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    fetchGraphData();
    setupWebSocket();
    initializeNodePositions();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLayoutDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [initializeNodePositions]);

  const filteredNodes = nodes.filter(node =>
    node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.data.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchGraphData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/graph');
      const data = await response.json();
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch graph:', error);
      setNodes([
        { data: { id: 'react-frontend', label: 'React Frontend', type: 'frontend' } },
        { data: { id: 'node-backend', label: 'Node Backend', type: 'backend' } },
        { data: { id: 'postgres-db', label: 'PostgreSQL DB', type: 'database' } },
        { data: { id: 'ai-suggestion-model', label: 'AI Model', type: 'ai-model' } }
      ]);
      setEdges([
        { data: { id: 'edge1', source: 'react-frontend', target: 'node-backend', label: 'REST API' } },
        { data: { id: 'edge2', source: 'node-backend', target: 'postgres-db', label: 'Database Queries' } },
        { data: { id: 'edge3', source: 'node-backend', target: 'ai-suggestion-model', label: 'Model Inference' } }
      ]);
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    const socket = io('http://localhost:3001');
    socket.on('graph-update', (newGraphData) => {
      setNodes(newGraphData.nodes || []);
      setEdges(newGraphData.edges || []);
    });
  };

  const getNodeColor = (type) => {
    const colors = {
      frontend: '#10b981',
      backend: '#f59e0b',
      database: '#ef4444',
      'ai-model': '#8b5cf6',
      default: '#6366f1'
    };
    return colors[type] || colors.default;
  };

  const getEdgePath = (source, target) => {
    const sourcePos = nodePositions[source] || { x: 0, y: 0 };
    const targetPos = nodePositions[target] || { x: 0, y: 0 };

    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;

    const startX = sourcePos.x + unitX * 35;
    const startY = sourcePos.y + unitY * 35;
    const endX = targetPos.x - unitX * 35;
    const endY = targetPos.y - unitY * 35;

    return `M${startX},${startY} L${endX},${endY}`;
  };

  const getEdgeTextPosition = (source, target) => {
    const sourcePos = nodePositions[source] || { x: 0, y: 0 };
    const targetPos = nodePositions[target] || { x: 0, y: 0 };

    return {
      x: (sourcePos.x + targetPos.x) / 2,
      y: (sourcePos.y + targetPos.y) / 2,
      angle: Math.atan2(targetPos.y - sourcePos.y, targetPos.x - sourcePos.x) * (180 / Math.PI)
    };
  };

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'circle') {
      const nodeId = e.target.parentNode.__data__.id;
      setDragging(true);
      setDragNode(nodeId);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else {
      setPanning(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (panning) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setCurrentOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (dragging && dragNode) {
      const dx = (e.clientX - dragStart.x) / zoom;
      const dy = (e.clientY - dragStart.y) / zoom;

      setNodePositions(prev => ({
        ...prev,
        [dragNode]: {
          x: (prev[dragNode]?.x || 0) + dx,
          y: (prev[dragNode]?.y || 0) + dy
        }
      }));

      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setPanning(false);
    setDragging(false);
    setDragNode(null);
  };

  const handleMouseLeave = () => {
    setPanning(false);
    setDragging(false);
    setDragNode(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(Math.max(prev * scale, 0.3), 3));
  };

  const resetView = () => {
    setZoom(1);
    setCurrentOffset({ x: 0, y: 0 });
    initializeNodePositions();
  };

  const changeLayout = (layout) => {
    setGraphLayout(layout);
    setShowLayoutDropdown(false);
    
    const nodeIds = nodes.map(node => node.data.id);
    if (layout === 'grid') {
      const gridPositions = {};
      const cols = Math.ceil(Math.sqrt(nodeIds.length));
      const spacing = 250;
      
      nodeIds.forEach((id, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        gridPositions[id] = {
          x: 200 + col * spacing,
          y: 150 + row * spacing
        };
      });
      setNodePositions(gridPositions);
    } else if (layout === 'hierarchy') {
      const hierarchyPositions = {
        'react-frontend': { x: 300, y: 100 },
        'node-backend': { x: 300, y: 250 },
        'postgres-db': { x: 150, y: 400 },
        'ai-suggestion-model': { x: 450, y: 400 }
      };
      setNodePositions(hierarchyPositions);
    } else if (layout === 'radial') {
      const centerX = 300;
      const centerY = 250;
      const radius = 200;
      
      const radialPositions = {};
      nodeIds.forEach((id, index) => {
        const angle = (index / nodeIds.length) * 2 * Math.PI;
        radialPositions[id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      });
      setNodePositions(radialPositions);
    }
  };


  const getNodeDetails = (node) => {
    const details = {
      frontend: {
        integration: `Connect to backend APIs using axios/fetch. Use environment variables for API endpoints. Implement proper error handling and loading states.`,
        warnings: `Never expose API keys or secrets in frontend code. Always validate user input. Avoid direct database connections.`,
        examples: `// API call with axios\nconst response = await axios.get('/api/data');\n\n// State management\nconst [data, setData] = useState([]);\nconst [loading, setLoading] = useState(false);`,
        boilerplate: `{\n "dependencies": {\n "react": "^18.2.0",\n "axios": "^1.4.0",\n "react-dom": "^18.2.0"\n }\n}`,
        connections: ['node-backend'],
        bestPractices: [
          'Use environment variables for configuration',
          'Implement proper error boundaries',
          'Add loading states for better UX',
          'Use React hooks for state management'
        ]
      },
      backend: {
        integration: `Create RESTful APIs with Express.js. Connect to database and external services. Implement authentication middleware.`,
        warnings: `Always validate and sanitize user input. Use environment variables for secrets. Implement rate limiting.`,
        examples: `// Express route with error handling\napp.get('/api/data', async (req, res) => {\n try {\n const data = await fetchData();\n res.json(data);\n } catch (error) {\n res.status(500).json({ error: error.message });\n }\n});`,
        boilerplate: `{\n "dependencies": {\n "express": "^4.18.2",\n "cors": "^2.8.5",\n "pg": "^8.11.0"\n }\n}`,
        connections: ['react-frontend', 'postgres-db', 'ai-suggestion-model'],
        bestPractices: [
          'Use middleware for authentication',
          'Implement proper error handling',
          'Add request validation',
          'Use connection pooling for databases'
        ]
      },
      database: {
        integration: `Use PostgreSQL with proper connection pooling. Implement migrations and seeding scripts.`,
        warnings: `Always use parameterized queries to prevent SQL injection. Implement proper indexing.`,
        examples: `-- Create table\nCREATE TABLE users (\n id SERIAL PRIMARY KEY,\n email VARCHAR(255) UNIQUE NOT NULL\n);\n\n-- Query with parameters\nSELECT * FROM users WHERE email = $1;`,
        boilerplate: `{\n "dependencies": {\n "pg": "^8.11.0",\n "pg-pool": "^3.6.0"\n }\n}`,
        connections: ['node-backend'],
        bestPractices: [
          'Use migrations for schema changes',
          'Implement proper indexing',
          'Use connection pooling',
          'Regularly backup data'
        ]
      },
      'ai-model': {
        integration: `Expose machine learning models as REST APIs using Flask/FastAPI. Standardize input/output formats.`,
        warnings: `Validate input data types and ranges. Handle model loading errors gracefully.`,
        examples: `# Flask prediction endpoint\n@app.route('/predict', methods=['POST'])\ndef predict():\n data = request.get_json()\n prediction = model.predict([data['features']])\n return jsonify({'prediction': prediction[0]})`,
        boilerplate: `# requirements.txt\nflask==2.3.2\nnumpy==1.24.3\ntorch==2.0.1\npython-dotenv==1.0.0`,
        connections: ['node-backend'],
        bestPractices: [
          'Use standard input/output formats',
          'Implement model versioning',
          'Add input validation',
          'Monitor model performance'
        ]
      }
    };

    return details[node.type] || {};
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading architecture visualization...</p>
      </div>
    );
  }

  const nodeDetails = selectedNode ? getNodeDetails(selectedNode) : {};

  return (
    <div className="graph-layout">
      {/* Left Panel - Graph */}
      <div className="graph-panel">
        <div className="graph-controls">
          <div className="control-group">
            <button className="control-btn" onClick={() => setZoom(z => Math.min(z * 1.2, 3))}>
              <span className="btn-icon">➕</span>
              Zoom In
            </button>
            <button className="control-btn" onClick={() => setZoom(z => Math.max(z * 0.8, 0.3))}>
              <span className="btn-icon">➖</span>
              Zoom Out
            </button>
            <button className="control-btn" onClick={resetView}>
              <span className="btn-icon">🔄</span>
              Reset View
            </button>
            
            {/* Layout Dropdown */}
            <div className="layout-dropdown-container" ref={dropdownRef}>
              <button 
                className="control-btn"
                onClick={() => setShowLayoutDropdown(!showLayoutDropdown)}
              >
                <span className="btn-icon">📊</span>
                Layout: {graphLayout}
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {showLayoutDropdown && (
                <div className="layout-dropdown-menu">
                  <button 
                    className={graphLayout === 'grid' ? 'active' : ''}
                    onClick={() => changeLayout('grid')}
                  >
                    Grid Layout
                  </button>
                  <button 
                    className={graphLayout === 'hierarchy' ? 'active' : ''}
                    onClick={() => changeLayout('hierarchy')}
                  >
                    Hierarchy Layout
                  </button>
                  <button 
                    className={graphLayout === 'radial' ? 'active' : ''}
                    onClick={() => changeLayout('radial')}
                  >
                    Radial Layout
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="zoom-display">
            Zoom: {Math.round(zoom * 100)}%
          </div>
        </div>

        <div
          ref={containerRef}
          className="graph-container"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: panning ? 'grabbing' : dragging ? 'grabbing' : 'grab' }}
        >
          <div className="graph-svg-container">
            <svg
              ref={svgRef}
              className="graph-svg"
              viewBox="0 0 800 600"
              style={{
                transform: `translate(${currentOffset.x}px, ${currentOffset.y}px) scale(${zoom})`,
                transformOrigin: 'center'
              }}
            >
              {/* Draw edges */}
              {edges.map((edge, index) => {
                const textPos = getEdgeTextPosition(edge.data.source, edge.data.target);

                return (
                  <g key={edge.data.id} className="edge-group">
                    <path
                      d={getEdgePath(edge.data.source, edge.data.target)}
                      className="edge-path"
                      strokeDasharray="1000"
                      strokeDashoffset="1000"
                      style={{
                        animation: `drawLine 0.8s ease-out ${index * 0.1}s forwards`
                      }}
                    />
                    <text
                      x={textPos.x}
                      y={textPos.y}
                      textAnchor="middle"
                      className="edge-label"
                      transform={`rotate(${textPos.angle}, ${textPos.x}, ${textPos.y})`}
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.5s ease-out ${index * 0.1 + 0.4}s forwards`
                      }}
                    >
                      {edge.data.label}
                    </text>
                  </g>
                );
              })}

              {/* Draw nodes */}
              {filteredNodes.map((node, index) => {
                const position = nodePositions[node.data.id] || { x: 100, y: 100 };
                const color = getNodeColor(node.data.type);
                const isSelected = selectedNode?.id === node.data.id;
                const isSearchResult = searchTerm && (
                  node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  node.data.type.toLowerCase().includes(searchTerm.toLowerCase())
                );

                return (
                  <g
                    key={node.data.id}
                    className="node-group"
                    style={{
                      opacity: 0,
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`
                    }}
                  >
                    {/* Glow effect for selected node */}
                    {isSelected && (
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r="45"
                        fill={color}
                        opacity="0.2"
                        className="node-glow"
                      />
                    )}
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r="35"
                      fill={color}
                      stroke={isSelected ? "white" : isSearchResult ? "#ffd700" : "rgba(255, 255, 255, 0.8)"}
                      strokeWidth={isSelected ? "3" : isSearchResult ? "3" : "2"}
                      className={`node ${isSelected ? 'node-selected' : ''}`}
                      onMouseDown={(e) => handleMouseDown(e)}
                      onClick={() => setSelectedNode(node.data)}
                      style={{
                        cursor: 'move',
                        filter: isSelected ? `drop-shadow(0 0 8px ${color})` : 'none'
                      }}
                    />
                    <text
                      x={position.x}
                      y={position.y}
                      textAnchor="middle"
                      dy=".3em"
                      fill="white"
                      fontSize="11"
                      fontWeight="600"
                      className="node-label"
                      style={{ 
                        pointerEvents: 'none',
                        filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.7))'
                      }}
                    >
                      {node.data.label.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" className="arrowhead-fill" />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Legend at bottom left corner */}
          <div className="graph-legend">
            <div className="legend-title">Component Types</div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
              <span className="legend-label">Frontend</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
              <span className="legend-label">Backend</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="legend-label">Database</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
              <span className="legend-label">AI Model</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Node Details */}
      <div className="details-panel">
        <div className="panel-header">
          <h2>{selectedNode ? selectedNode.label : 'Node Details'}</h2>
          {selectedNode && (
            <div
              className="node-type-badge"
              style={{ backgroundColor: getNodeColor(selectedNode.type) }}
            >
              {selectedNode.type}
            </div>
          )}
        </div>

        {selectedNode ? (
          <div className="details-content">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'integration' ? 'active' : ''}`}
                onClick={() => setActiveTab('integration')}
              >
                🔗 Integration
              </button>
              <button
                className={`tab ${activeTab === 'warnings' ? 'active' : ''}`}
                onClick={() => setActiveTab('warnings')}
              >
                ⚠️ Warnings
              </button>
              <button
                className={`tab ${activeTab === 'examples' ? 'active' : ''}`}
                onClick={() => setActiveTab('examples')}
              >
                💡 Examples
              </button>
              <button
                className={`tab ${activeTab === 'boilerplate' ? 'active' : ''}`}
                onClick={() => setActiveTab('boilerplate')}
              >
                📦 Boilerplate
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'integration' && (
                <div className="content-section">
                  <h4>Integration Instructions</h4>
                  <p>{nodeDetails.integration}</p>

                  <h4>Best Practices</h4>
                  <div className="best-practices">
                    {nodeDetails.bestPractices?.map((practice, index) => (
                      <div key={index} className="practice-item">
                        <span className="practice-check">✅</span>
                        {practice}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'warnings' && (
                <div className="content-section warning-section">
                  <h4>Important Warnings</h4>
                  <p>{nodeDetails.warnings}</p>

                  <div className="warning-list">
                    <div className="warning-item">
                      <span className="warning-icon">🚫</span>
                      <span>Never expose sensitive data in client-side code</span>
                    </div>
                    <div className="warning-item">
                      <span className="warning-icon">🔒</span>
                      <span>Always validate and sanitize user input</span>
                    </div>
                    <div className="warning-item">
                      <span className="warning-icon">⚡</span>
                      <span>Implement proper error handling and logging</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'examples' && (
                <div className="content-section">
                  <h4>Code Examples</h4>
                  <div className="code-block">
                    <pre>{nodeDetails.examples}</pre>
                  </div>

                  <h4>Usage</h4>
                  <p>Copy and adapt these examples for your implementation. Remember to handle errors appropriately.</p>
                </div>
              )}

              {activeTab === 'boilerplate' && (
                <div className="content-section">
                  <h4>Boilerplate Code</h4>
                  <div className="code-block">
                    <pre>{nodeDetails.boilerplate}</pre>
                  </div>

                  <h4>Installation</h4>
                  <p>Use package managers like npm, yarn, or pip to install the required dependencies.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="welcome-message">
            <div className="welcome-icon">👆</div>
            <h3>Select a Node</h3>
            <p>Click on any node in the graph to view detailed information about that component.</p>

            {searchTerm && (
              <div className="search-results-info">
                <p>Showing {filteredNodes.length} nodes matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleGraph;