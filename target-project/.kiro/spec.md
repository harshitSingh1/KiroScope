# Project: AI-Powered Task Manager

## Components

- **`react-frontend`**: A React.js frontend application. It will display tasks and use AI suggestions.
- **`node-backend`**: A Node.js/Express API backend. It handles business logic and talks to the database and AI model.
- **`postgres-db`**: A PostgreSQL database for storing users and tasks.
- **`ai-suggestion-model`**: A Python ML model (using PyTorch) that generates smart task suggestions.

## Data Flow

1. The `react-frontend` makes API calls to the `node-backend`.
2. The `node-backend` reads/writes from the `postgres-db`.
3. For certain requests, the `node-backend` calls the `ai-suggestion-model` and returns the result to the frontend.