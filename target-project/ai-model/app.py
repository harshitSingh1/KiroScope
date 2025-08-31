from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import numpy as np

app = Flask(__name__)
CORS(app)

# Mock AI model (simplified for demo)
class TaskSuggestionModel:
    def __init__(self):
        self.suggestions = [
            "Break this task into smaller subtasks",
            "Set a deadline for this task",
            "Delegate this task if possible",
            "This task might be urgent, prioritize it",
            "Consider automating this task"
        ]
    
    def predict(self, task_data):
        # Mock prediction - in real app, this would use real ML
        np.random.seed(hash(task_data.get('task_id', 0)) % 100)
        selected = np.random.choice(self.suggestions, 2, replace=False)
        return [{"id": i, "text": text} for i, text in enumerate(selected)]

model = TaskSuggestionModel()

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        suggestions = model.predict(data)
        return jsonify({"suggestions": suggestions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)