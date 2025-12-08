import React, { useState } from 'react';
import { Sparkles, Loader2, Thermometer, Calendar, User } from 'lucide-react';
import { getGeminiOutfitSuggestion } from '../services/geminiService';

const AIOutfitAssistant: React.FC = () => {
  const [occasion, setOccasion] = useState('');
  const [weather, setWeather] = useState('');
  const [style, setStyle] = useState('Casual');
  const [gender, setGender] = useState('Woman');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!occasion || !weather) return;
    setLoading(true);
    setResult(null);
    const suggestion = await getGeminiOutfitSuggestion(occasion, weather, gender, style);
    setResult(suggestion);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-6 md:p-8 shadow-lg border border-primary-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary-500 p-2 rounded-xl text-white">
          <Sparkles size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">AI Stylist Sunny</h2>
      </div>
      
      <p className="text-gray-600 mb-6">Tell me where you're going and what the weather is like, and I'll curate the perfect outfit for you.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="e.g. Wedding, Beach Party, Office" 
              className="w-full pl-10 pr-4 py-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weather</label>
          <div className="relative">
            <Thermometer className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="e.g. Sunny 30°C, Rainy" 
              className="w-full pl-10 pr-4 py-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select 
            className="w-full px-4 py-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="Woman">Woman</option>
            <option value="Man">Man</option>
            <option value="Non-binary">Non-binary</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Style Preference</label>
          <select 
            className="w-full px-4 py-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            <option value="Casual">Casual</option>
            <option value="Formal">Formal</option>
            <option value="Bohemian">Bohemian</option>
            <option value="Streetwear">Streetwear</option>
            <option value="Minimalist">Minimalist</option>
          </select>
        </div>
      </div>

      <button 
        onClick={handleGenerate}
        disabled={loading || !occasion || !weather}
        className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" /> Styling...
          </>
        ) : (
          <>
            Generate Outfit <Sparkles size={18} />
          </>
        )}
      </button>

      {result && (
        <div className="mt-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Sunny's Suggestion:</h3>
          <div className="prose prose-sm text-gray-600 whitespace-pre-line">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIOutfitAssistant;
