CREATE DATABASE taskmanager;

\c taskmanager;

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, description) VALUES
('Complete hackathon project', 'Build Kiroscope with Kiro integration'),
('Learn Kiro spec development', 'Study the documentation and examples'),
('Prepare demo video', 'Record 3-minute demonstration for judges'),
('Test AI model integration', 'Ensure frontend can communicate with ML service');