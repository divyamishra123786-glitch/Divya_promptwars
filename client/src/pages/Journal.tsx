import { useState, useEffect } from 'react';
import { LocalStorageProvider } from '../services/storage';
import type { JournalEntry } from '../types';
import { EmptyState } from '../components/ui';

const journalStore = new LocalStorageProvider<JournalEntry>('journal');

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState('');
  const [initialThoughts, setInitialThoughts] = useState('');
  const [whatOverlooked, setWhatOverlooked] = useState('');
  const [whatLearned, setWhatLearned] = useState('');

  useEffect(() => {
    setEntries(journalStore.list());
  }, []);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !initialThoughts.trim()) return;

    const now = new Date().toISOString();
    const entry: JournalEntry = {
      id: 'j-' + Date.now(),
      title: title.trim(),
      createdAt: now,
      updatedAt: now,
      initialThoughts: initialThoughts.trim(),
      whatOverlooked: whatOverlooked.trim(),
      whatLearned: whatLearned.trim(),
      informationNeeded: '',
      nextSteps: '',
    };

    journalStore.save(entry);
    setEntries(journalStore.list());
    setTitle('');
    setInitialThoughts('');
    setWhatOverlooked('');
    setWhatLearned('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="label-xs mb-2">Decision Journal</div>
        <h1 className="font-heading text-3xl text-ivory">Track your decision quality over time.</h1>
        <p className="text-muted mt-2">
          Record initial thoughts, what was overlooked, and lessons learned.
        </p>
      </div>

      {/* New Entry Card */}
      <div className="card space-y-4">
        <h2 className="font-heading text-lg text-ivory flex items-center gap-2">
          <span className="text-accent">◻</span> New Reflection Entry
        </h2>

        <form onSubmit={handleAddEntry} className="space-y-4 pt-2">
          <div>
            <label className="label-xs block mb-1" htmlFor="journal-title">
              Decision Title
            </label>
            <input
              id="journal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deciding on 6-month internship offer"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="label-xs block mb-1" htmlFor="journal-initial">
              Initial Thoughts & Rationales
            </label>
            <textarea
              id="journal-initial"
              rows={3}
              value={initialThoughts}
              onChange={(e) => setInitialThoughts(e.target.value)}
              placeholder="What were your initial main priorities and reasoning?"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="label-xs block mb-1" htmlFor="journal-overlooked">
              What Was Overlooked / Hidden Factors
            </label>
            <textarea
              id="journal-overlooked"
              rows={2}
              value={whatOverlooked}
              onChange={(e) => setWhatOverlooked(e.target.value)}
              placeholder="What blind spots or missing details emerged?"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="label-xs block mb-1" htmlFor="journal-learned">
              What Did You Learn?
            </label>
            <textarea
              id="journal-learned"
              rows={2}
              value={whatLearned}
              onChange={(e) => setWhatLearned(e.target.value)}
              placeholder="Key takeaways for future choices..."
              className="input-field w-full"
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim() || !initialThoughts.trim()}
            className="btn-primary"
          >
            Save Reflection
          </button>
        </form>
      </div>

      {/* Existing Journal Entries */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg text-ivory">Past Journal Entries ({entries.length})</h2>
        {entries.length === 0 ? (
          <EmptyState
            title="No Journal Entries Yet"
            description="Use the form above to write your first reflection."
          />
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="card space-y-2">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="font-heading text-sm text-ivory font-medium">{entry.title}</span>
                  <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                </div>
                {entry.initialThoughts && (
                  <p className="text-sm text-ivory/90"><strong>Initial Thoughts:</strong> {entry.initialThoughts}</p>
                )}
                {entry.whatOverlooked && (
                  <p className="text-xs text-warning"><strong>Overlooked:</strong> {entry.whatOverlooked}</p>
                )}
                {entry.whatLearned && (
                  <p className="text-xs text-sage"><strong>Learned:</strong> {entry.whatLearned}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
