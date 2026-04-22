from flask import Blueprint, request, jsonify
from ml.medicine_recommendation import get_medicine_recommendations

recommend_bp = Blueprint('recommend', __name__)

@recommend_bp.route('/medicine', methods=['GET'])
def recommend_medicine():
    # Expecting: /api/recommend/medicine?disease=Diabetes
    disease_name = request.args.get('disease')
    
    if not disease_name:
        return jsonify({"message": "Please provide a disease parameter in the URL"}), 400
        
    try:
        recommendations = get_medicine_recommendations(disease_name)
        
        return jsonify({
            "message": "Recommendations fetched successfully",
            "disease": disease_name,
            "data": recommendations
        }), 200
        
    except Exception as e:
        return jsonify({"message": "Error fetching recommendations", "error": str(e)}), 500
