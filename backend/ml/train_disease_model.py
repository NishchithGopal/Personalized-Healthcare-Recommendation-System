import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle
import os

def generate_dummy_data(num_samples=1000):
    np.random.seed(42)
    
    # Generate random features
    age = np.random.randint(20, 80, num_samples)
    blood_pressure = np.random.randint(90, 180, num_samples)
    glucose_level = np.random.randint(70, 250, num_samples)
    heart_rate = np.random.randint(60, 120, num_samples)
    
    data = pd.DataFrame({
        'age': age,
        'blood_pressure': blood_pressure,
        'glucose_level': glucose_level,
        'heart_rate': heart_rate
    })
    
    # Simple rule-based dummy target generation for demonstration
    conditions = [
        (data['glucose_level'] > 180) & (data['blood_pressure'] > 140),
        (data['glucose_level'] > 180),
        (data['blood_pressure'] > 140) & (data['age'] > 50),
        (data['heart_rate'] > 100)
    ]
    choices = ['Diabetes & Hypertension', 'Diabetes', 'Hypertension', 'Tachycardia']
    data['disease'] = np.select(conditions, choices, default='Normal')
    
    return data

def train_and_save_model():
    print("Generating synthetic data...")
    df = generate_dummy_data(2000)
    
    X = df[['age', 'blood_pressure', 'glucose_level', 'heart_rate']]
    y = df['disease']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy on test set: {accuracy * 100:.2f}%")
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'disease_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"Model saved successfully to {model_path}")

if __name__ == "__main__":
    train_and_save_model()
