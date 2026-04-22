from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

def create_app():
    # Initialize the Flask application
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)

    # Enable Cross-Origin Resource Sharing (CORS) for React frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Establish MongoDB Context (Initial Connection will happen on first request if needed, handled by our LocalProxy)
    
    # Register API Blueprints
    from routes.auth_routes import auth_bp
    from routes.user_routes import user_bp
    from routes.predict_routes import predict_bp
    from routes.recommend_routes import recommend_bp
    
    # Prefix all routes properly
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(predict_bp, url_prefix='/api/predict')
    app.register_blueprint(recommend_bp, url_prefix='/api/recommend')

    # Basic root endpoint
    @app.route('/', methods=['GET'])
    def index():
        return jsonify({"message": "Welcome to the Personalized Healthcare Recommendation API"}), 200

    # Error handling for unauthorized access
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({"message": "Unauthorized access"}), 401
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"message": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"message": "Internal Server Error"}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    # In production, do not run with debug=True
    app.run(debug=True, port=5000)
