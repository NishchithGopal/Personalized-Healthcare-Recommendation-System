import React, { useState } from 'react';
import api from '../services/api';
import { Activity, AlertCircle, CheckCircle2, Pill, ShieldAlert, HeartPulse } from 'lucide-react';

export default function DiseasePredictor({ onPredict }) {
  const [formData, setFormData] = useState({
    age: '',
    blood_pressure: '',
    glucose_level: '',
    heart_rate: ''
  });
  
  const [prediction, setPrediction] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);
    setRecommendations(null);
    
    try {
      // 1. Predict Disease
      const response = await api.post('/predict/disease', formData);
      const predictedDisease = response.data.prediction;
      setPrediction(predictedDisease);
      
      // 2. Automatically fetch Recommendations
      const recResponse = await api.get(`/recommend/medicine?disease=${predictedDisease}`);
      setRecommendations(recResponse.data.data);
      
      if (onPredict) {
        onPredict(formData);
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error communicating with AI services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl border border-slate-200">
      
      {/* Search Input Section */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-4 text-primary-600">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Activity className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-800">Disease Prediction & Care</h3>
        </div>
        
        <p className="text-sm text-slate-500 mb-6">
          Enter your vitals below to get an AI-powered health prediction and actionable care plans.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="1"
                max="120"
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. 45"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">Blood Pressure</label>
              <input
                type="number"
                name="blood_pressure"
                value={formData.blood_pressure}
                onChange={handleChange}
                required
                min="50"
                max="250"
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. 120"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">Glucose Level</label>
              <input
                type="number"
                name="glucose_level"
                value={formData.glucose_level}
                onChange={handleChange}
                required
                min="30"
                max="400"
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. 90"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">Heart Rate</label>
              <input
                type="number"
                name="heart_rate"
                value={formData.heart_rate}
                onChange={handleChange}
                required
                min="40"
                max="200"
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. 72"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing Vitals...' : 'Analyze Vitals & Get Recommendations'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {prediction && (
        <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-xl">
          {/* Prediction Banner */}
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 border ${prediction === 'Normal' ? 'bg-green-100 border-green-200 text-green-800' : 'bg-orange-100 border-orange-200 text-orange-900'}`}>
            {prediction === 'Normal' ? (
              <CheckCircle2 className="h-6 w-6 mt-0.5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-6 w-6 mt-0.5 text-orange-600 flex-shrink-0" />
            )}
            <div>
              <h4 className="font-bold text-lg">AI Diagnosis: {prediction}</h4>
              <p className="text-sm mt-1 opacity-80">Based on our Machine Learning models utilizing your submitted vitals.</p>
            </div>
          </div>

          {/* Recommendations Layout */}
          {recommendations && (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-800 border-b pb-2">Care Recommendations</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Medicines Card */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-blue-600">
                    <Pill className="h-4 w-4" />
                    <h5 className="font-semibold text-sm text-slate-800">Medicines</h5>
                  </div>
                  <ul className="space-y-2">
                    {recommendations.medicines.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Precautions Card */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-red-500">
                    <ShieldAlert className="h-4 w-4" />
                    <h5 className="font-semibold text-sm text-slate-800">Precautions</h5>
                  </div>
                  <ul className="space-y-2">
                    {recommendations.precautions.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lifestyle Advice Card */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-emerald-500">
                    <HeartPulse className="h-4 w-4" />
                    <h5 className="font-semibold text-sm text-slate-800">Lifestyle Advice</h5>
                  </div>
                  <ul className="space-y-2">
                    {recommendations.advice.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
