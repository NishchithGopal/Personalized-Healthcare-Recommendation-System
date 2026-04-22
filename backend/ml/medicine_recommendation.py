# Dictionary database mapping predicted diseases to recommendations
disease_mapping_db = {
    "Diabetes": {
        "medicines": ["Metformin", "Glipizide", "Insulin (if prescribed)"],
        "precautions": ["Monitor blood sugar levels daily", "Check your feet for cuts or blisters", "Take medications exactly as prescribed"],
        "advice": ["Maintain a low-carb diet", "Exercise for at least 30 minutes daily", "Stay well hydrated"]
    },
    "Hypertension": {
        "medicines": ["Lisinopril", "Amlodipine", "Hydrochlorothiazide"],
        "precautions": ["Monitor blood pressure regularly", "Avoid tobacco and limit alcohol", "Avoid sudden strenuous activities"],
        "advice": ["Implement the DASH diet (low sodium)", "Reduce stress through meditation or yoga", "Ensure 7-8 hours of sleep"]
    },
    "Diabetes & Hypertension": {
        "medicines": ["Metformin", "Lisinopril", "Aspirin (consult doctor)"],
        "precautions": ["Strict simultaneous monitoring of blood glucose and pressure", "Regular checks for kidney and eye health"],
        "advice": ["Adopt a strict low-sodium, diabetic-friendly diet", "Daily moderate exercise", "Routine doctor consultations"]
    },
    "Tachycardia": {
        "medicines": ["Beta-blockers (e.g., Metoprolol)", "Calcium channel blockers"],
        "precautions": ["Avoid caffeine and energy drinks", "Stop smoking immediately", "Do not ignore chest pains or shortness of breath"],
        "advice": ["Practice vagal maneuvers safely", "Manage stress and anxiety", "Maintain a healthy BMI"]
    },
    "Normal": {
        "medicines": ["No specific medications required"],
        "precautions": ["Maintain annual health check-ups"],
        "advice": ["Maintain a balanced diet", "Get regular physical exercise", "Drink plenty of water"]
    }
}

def get_medicine_recommendations(disease_name):
    """
    Returns medicines, precautions, and lifestyle advice for a given disease.
    """
    # Attempt to fetch exact match or fallback to Normal
    return disease_mapping_db.get(disease_name, {
        "medicines": ["Consult a doctor for specific medications"],
        "precautions": ["Seek medical advice"],
        "advice": ["Maintain a healthy lifestyle while waiting for consultation"]
    })
