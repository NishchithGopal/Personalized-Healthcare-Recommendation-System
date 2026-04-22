import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Activity, LogOut, User, AlertCircle, CheckCircle2, HeartPulse } from 'lucide-react';
import DiseasePredictor from '../components/DiseasePredictor';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [lastVitals, setLastVitals] = useState(null);
  
  // Fetch protected data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        setProfile(response.data.profile);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };
    
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-2 text-primary-600 font-bold text-xl">
              <Activity className="h-6 w-6" />
              <span>HealthSync AI</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                <User className="h-4 w-4" />
                {user?.name || 'User'}
              </div>
              <button 
                onClick={logout}
                className="text-sm font-medium text-slate-600 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 flex items-center text-sm text-slate-500">
            We are preparing your personalized healthcare insights.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-white shadow-sm rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4 text-primary-600">
              <div className="p-2 bg-primary-50 rounded-lg">
                <User className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-800">Your Profile</h3>
            </div>
            {profile ? (
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Role:</strong> {profile.role}</p>
              </div>
            ) : (
              <div className="text-sm text-slate-500 animate-pulse">Loading profile...</div>
            )}
          </div>

          {/* Card 2 - Health Recommendations */}
          <div className="bg-white shadow-sm rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <HeartPulse className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-800">Health Recommendations</h3>
            </div>
            
            {!lastVitals ? (
              <p className="text-sm text-slate-500">
                Your personalized AI-powered recommendations will appear here automatically once you analyze your vitals below.
              </p>
            ) : (
              <ul className="space-y-3 pt-2">
                {(() => {
                  const insights = [];
                  if (Number(lastVitals.glucose_level) > 140) {
                    insights.push('Suggest reducing sugar intake to manage glucose levels.');
                  }
                  if (Number(lastVitals.blood_pressure) > 130) {
                    insights.push('A low-sodium diet is suggested to manage blood pressure.');
                  }
                  if (Number(lastVitals.heart_rate) > 100) {
                    insights.push('Suggest stress reduction to lower resting heart rate.');
                  }
                  if (Number(lastVitals.age) > 50) {
                    insights.push('Suggest regular comprehensive health screenings.');
                  }
                  
                  if (insights.length === 0) {
                    return (
                      <li className="flex items-start gap-2 text-sm text-slate-700 bg-green-50 p-3 rounded-lg border border-green-100">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Your vitals look healthy. Keep maintaining a balanced lifestyle.</span>
                      </li>
                    );
                  }
                  
                  return insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ));
                })()}
              </ul>
            )}
          </div>

          {/* Card 3 - Predictor Tool */}
          <DiseasePredictor onPredict={(vitals) => setLastVitals(vitals)} />
        </div>
      </main>
    </div>
  );
}
