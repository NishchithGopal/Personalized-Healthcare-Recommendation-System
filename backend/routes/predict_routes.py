from flask import Blueprint, request, jsonify
from ml.disease_prediction_model import predict_disease

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/disease', methods=['POST'])
def disease_prediction():
    data = request.get_json()
    
    if not data:
        return jsonify({"message": "No data provided"}), 400
        
    required_fields = ['age', 'blood_pressure', 'glucose_level', 'heart_rate']
    missing = [field for field in required_fields if field not in data]
    
    if missing:
        return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400
        
    try:
        # Extract fields
        health_data = {
            'age': float(data['age']),
            'blood_pressure': float(data['blood_pressure']),
            'glucose_level': float(data['glucose_level']),
            'heart_rate': float(data['heart_rate'])
        }
        
        # Make prediction
        prediction = predict_disease(health_data)
        
        return jsonify({
            "message": "Prediction successful",
            "prediction": prediction
        }), 200
        
    except FileNotFoundError as e:
        return jsonify({"message": "Model not found", "error": str(e)}), 503
    except ValueError as e:
        return jsonify({"message": "Invalid input data types", "error": str(e)}), 400
    except Exception as e:
        return jsonify({"message": "Error occurred during prediction", "error": str(e)}), 500
