import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LocalStorageProvider } from '../services/storage';
import type { SavedAnalysis, JournalEntry } from '../types';

const analysisStore = new LocalStorageProvider<SavedAnalysis>('analyses');
const journalStore = new LocalStorageProvider<JournalEntry>('journal');

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [mode, setMode] = useState<'live' | 'demo'>('demo');

  useEffect(() => {
    const key = localStorage.getItem('gemini_api_key') || '';
    setApiKey(key);

    api.health()
      .then((res) => setMode(res.mode as 'live' | 'demo'))
      .catch(() => setMode('demo'));
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all local analyses and journal entries?')) {
      analysisStore.clear();
      journalStore.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="label-xs mb-2">Settings</div>
        <h1 className="font-heading text-3xl text-ivory">System & API Configuration</h1>
        <p className="text-muted mt-2">
          Configure Gemini AI key, manage local storage, and check system status.
        </p>
      </div>

      {/* Mode Banner */}
      <div className={`card ${mode === 'live' ? 'border-sage/30 bg-sage/05' : 'border-amber-500/30 bg-amber-500/05'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="label-xs mb-1 text-ivory">Current Execution Mode</div>
            <div className="font-heading text-lg text-ivory">
              {mode === 'live' ? '⚡ Live Gemini API Active' : '🎭 Demo Mode Active'}
            </div>
            <p className="text-xs text-muted mt-1">
              {mode === 'live'
                ? 'Queries are processed via live Gemini 1.5 Pro / Flash models.'
                : 'Using curated demo datasets and fallback rules (No API key configured).'}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mode === 'live' ? 'bg-sage/20 text-sage' : 'bg-amber-500/20 text-amber-300'}`}>
            {mode.toUpperCase()}
          </span>
        </div>
      </div>

      {/* API Key Form */}
      <div className="card space-y-4">
        <h2 className="font-heading text-lg text-ivory flex items-center gap-2">
          <span>⚙</span> Gemini API Key Configuration
        </h2>
        <form onSubmit={handleSaveApiKey} className="space-y-4">
          <div>
            <label className="label-xs block mb-2" htmlFor="settings-api-key">
              Google Gemini API Key
            </label>
            <input
              id="settings-api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="input-field w-full font-mono text-sm"
            />
            <p className="text-xs text-muted mt-1">
              Your key is stored locally in your browser. Leave blank to run in Demo mode.
            </p>
          </div>

          {savedSuccess && (
            <div className="text-xs text-sage bg-sage/10 p-3 rounded-lg border border-sage/20">
              API key settings updated successfully!
            </div>
          )}

          <button type="submit" className="btn-primary">
            Save Settings
          </button>
        </form>
      </div>

      {/* Data Management */}
      <div className="card space-y-4 border-critical/20 bg-critical/05">
        <h2 className="font-heading text-lg text-critical flex items-center gap-2">
          <span>⚠</span> Reset & Local Data Cleanup
        </h2>
        <p className="text-xs text-muted">
          Clear all saved decisions, historical blind spot analyses, and journal entries stored in your browser local storage.
        </p>
        <button
          onClick={handleClearData}
          className="px-4 py-2 rounded-lg bg-critical/20 border border-critical/30 text-critical text-sm hover:bg-critical/30 transition-colors font-medium"
        >
          Clear All Local Saved Data
        </button>
      </div>
    </div>
  );
}
