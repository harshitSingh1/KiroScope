# 🗺️ Kiroscope - A Map for your Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Kiro](https://img.shields.io/badge/Built_with-Kiro-8B5CF6.svg)](https://kiro.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Stop guessing how your project fits together. Start seeing it.** Kiroscope is an intelligent architecture visualization platform that transforms your project specification into an interactive, real-time graph—like Google Maps for your codebase.

<img width="1909" height="918" alt="Screenshot 2025-09-09 202438" src="https://github.com/user-attachments/assets/b5623370-1618-426f-9052-20017593e400" />


## ✨ Features

- **🧠 AI-Powered Visualization:** Automatically generate an interactive architecture graph from a simple markdown spec.
- **🔍 Smart Search:** Instantly find components and understand dependencies across your entire project.
- **🎨 Multiple Layouts:** Visualize your architecture in Grid, Hierarchy, or Radial views for different perspectives.
- **💡 Integration Guidance:** Click any node to get detailed instructions, code examples, and best practices.
- **⚡ Real-Time Updates:** See your architecture graph update live as you edit the project spec (powered by WebSockets).
- **🌙 Dark/Light Theme:** Full theme support for comfortable viewing in any environment.
- **📱 Fully Responsive:** Works seamlessly on desktop, tablet, and mobile devices.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshitSingh1/KiroScope.git
   cd kiroscope
   ```
2. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```bash
   PORT=3001
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

3. **Install dependencies and start project**
   ```bash
   # Install backend dependencies
    cd backend
    npm install
    npm start

    # Install frontend dependencies in another terminal  
    cd frontend
    npm install
    npm run dev
    ```
4. **Open your browser**
   Navigate to `http://localhost:5173` to see Kiroscope in action!

## 📁 Project Structure
```bash
kiroscope/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── index.js        # Express server & WebSocket setup
│   │   ├── parser/         # Spec parsing logic
│   │   └── graph/          # Graph data structure generation
│   ├── package.json
│   └── .env.example
├── frontend/               # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── SimpleGraph.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── AboutPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── target-project/         # Example project to demonstrate Kiroscope
│   └── .kiro/
│       └── spec.md         # Example project specification
├── .kiro/                  # Kiro configuration and specs
│   ├── spec.md            # Main project specification
│   └── hooks/             # Kiro Agent Hooks
├── .gitignore
├── LICENSE
└── README.md
```

## 📋 Creating Your Project Spec
Kiroscope uses a simple markdown format to understand your architecture. Create a `.kiro/spec.md` file in your project and place your project inside `target-project` folder:
```bash
# Project: Your Awesome Project

## Components

- **`react-frontend`**: A React.js frontend application. Connects to backend APIs.
- **`node-backend`**: A Node.js/Express API server. Handles business logic.
- **`postgres-db`**: PostgreSQL database for data storage.
- **`redis-cache`**: Redis instance for caching frequently accessed data.
- **`auth-service`**: Authentication microservice using JWT.

## Data Flow

1. The `react-frontend` makes API calls to the `node-backend`.
2. The `node-backend` reads/writes from the `postgres-db`.
3. The `node-backend` uses `redis-cache` for session storage.
4. All authentication requests are routed through the `auth-service`.
```

## 🤖 How We Used Kiro
Kiro was fundamental to our development process, acting as a true AI partner:

### 🏗️ Spec-Driven Development
We started by writing a detailed .kiro/spec.md that described our vision. Kiro helped us translate this spec into actual code structure and architecture.

###  Agent Hooks Automation
We created Kiro Agent Hooks that:
- Watch for changes to the project spec
- Automatically trigger graph updates
- Push real-time updates to all connected clients
- File: `/.kiro/hooks/spec-update-hook.js`

### 💻 Impressive Code Generation
The most impressive code Kiro helped with was the complete real-time WebSocket synchronization system between our React frontend and Node.js backend, including error handling and connection management.


## 🛠️ Technology Stack
**Frontend:** React, Vite, CSS3, SVG, Socket.io Client
**Backend:** Node.js, Express.js, Socket.io
**Real-Time Communication:** WebSockets via Socket.io
**AI Development:** Kiro AI
**Build Tools:** Vite, npm scripts
**Version Control:** Git, GitHub

## 🤝 Contributing
We love contributions! Please read our Contributing Guide for details on our code of conduct and the process for submitting pull requests.
- Fork the project
- Create your feature branch (`git checkout -b feature/Feature`)
- Commit your changes (`git commit -m 'Add some Feature'`)
 Push to the branch (`git push origin feature/Feature`)
- Open a Pull Request

📄 License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/harshitSingh1/KiroScope/blob/bb6e4b4aaf819d160094fcf8f69dba30048e89af/LICENSE) file for details.
