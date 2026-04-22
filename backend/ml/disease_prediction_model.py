import os
import pickle
import pandas as pd

# Global variable to cache the model in memory
_model = None

def load_model():
    global _model
    if _model is None:
        model_path = os.path.join(os.path.dirname(__file__), 'disease_model.pkl')
        if not os.path.exists(model_path):
            raise FileNotFoundError("Trained model not found. Please run train_disease_model.py first.")
        with open(model_path, 'rb') as f:
            _model = pickle.load(f)
    return _model

def predict_disease(user_health_data):
    """
    Predicts the disease based on user health features.
    Expects user_health_data as a dictionary:
    {
       'age': int,
       'blood_pressure': int,
       'glucose_level': int,
       'heart_rate': int
    }
    """
    model = load_model()
    
    # Needs to match the DataFrame structure the model was trained on
    input_df = pd.DataFrame([user_health_data])
    
    try:
        prediction = model.predict(input_df)
        return prediction[0]
    except Exception as e:
        raise Exception(f"Model prediction error: {str(e)}")
