from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        'message': 'Calculator API is running',
        'status': 'healthy'
    })

@app.route('/calculate', methods=['POST'])
def calculate():
    """
    Perform calculation based on the provided operation and operands
    Expected JSON payload:
    {
        "operation": "+|-|*|/",
        "operand1": number,
        "operand2": number
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        operation = data.get('operation')
        operand1 = data.get('operand1')
        operand2 = data.get('operand2')
        
        # Validate input
        if operation is None or operand1 is None or operand2 is None:
            return jsonify({'error': 'Missing required fields: operation, operand1, operand2'}), 400
        
        if operation not in ['+', '-', '*', '/']:
            return jsonify({'error': 'Invalid operation. Supported operations: +, -, *, /'}), 400
        
        try:
            operand1 = float(operand1)
            operand2 = float(operand2)
        except (ValueError, TypeError):
            return jsonify({'error': 'Operands must be valid numbers'}), 400
        
        # Perform calculation
        if operation == '+':
            result = operand1 + operand2
        elif operation == '-':
            result = operand1 - operand2
        elif operation == '*':
            result = operand1 * operand2
        elif operation == '/':
            if operand2 == 0:
                return jsonify({'error': 'Division by zero is not allowed'}), 400
            result = operand1 / operand2
        
        logger.info(f"Calculation: {operand1} {operation} {operand2} = {result}")
        
        return jsonify({
            'result': result,
            'operation': operation,
            'operand1': operand1,
            'operand2': operand2
        })
        
    except Exception as e:
        logger.error(f"Error in calculation: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/history', methods=['GET'])
def get_history():
    """
    Get calculation history (placeholder for future implementation)
    """
    return jsonify({
        'message': 'History feature not implemented yet',
        'history': []
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5005)
