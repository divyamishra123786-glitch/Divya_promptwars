import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalStorageProvider } from '../services/storage';
import type { SavedAnalysis } from '../types';
import { SeverityChip, EmptyState } from '../components/ui';
import { exportAnalysisPDF } from '../services/pdf';

const analysisStore = new LocalStorageProvider<SavedAnalysis>('analyses');

export default function MyDecisionsPage() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    setAnalyses(analysisStore.list());
  }, []);

  const filtered = analyses.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const maxSeverity = a.result.blindSpots.reduce((max, b) => {
      const order = { Low: 0, Medium: 1, High: 2 };
      return order[b.severity] > order[max] ? b.severity : max;
    }, 'Low' as 'Low' | 'Medium' | 'High');
    const matchSeverity = filterSeverity === 'All' || maxSeverity === filterSeverity;
    return matchSearch && matchSeverity;
  });

  const handleDelete = (id: string) => {
    analysisStore.delete(id);
    setAnalyses(analysisStore.list());
    setDeleteConfirmId(null);
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : prev.length < 2
        ? [...prev, id]
        : prev
    );
  };

  const handleExport = async (a: SavedAnalysis) => {
    setExporting(a.id);
    try {
      await exportAnalysisPDF(a);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="label-xs mb-2">My Decisions</div>
          <h1 className="font-heading text-3xl text-ivory">
            {analyses.length} Analys{analyses.length !== 1 ? 'es' : 'is'}
          </h1>
        </div>
        <button onClick={() => navigate('/app/new')} className="btn-primary">
          ✦ New Analysis
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="search"
          id="decisions-search"
          className="input-field flex-1 min-w-48"
          placeholder="Search decisions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search decisions"
        />
        <div className="flex gap-2">
          {(['All', 'High', 'Medium', 'Low'] as const).map((s) => (
            <button
              key={s}
              id={`filter-${s.toLowerCase()}`}
              onClick={() => setFilterSeverity(s)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                filterSeverity === s
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'bg-card border border-white/08 text-muted hover:text-ivory'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Compare bar */}
      {compareIds.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-lg border border-accent/25 bg-accent/08">
          <p className="text-sm text-ivory">
            {compareIds.length === 1 ? 'Select one more to compare' : 'Ready to compare 2 analyses'}
          </p>
          <div className="flex gap-2">
            {compareIds.length === 2 && (
              <button
                id="compare-btn"
                onClick={() => navigate(`/app/compare?a=${compareIds[0]}&b=${compareIds[1]}`)}
                className="btn-primary text-sm py-2"
              >
                Compare →
              </button>
            )}
            <button onClick={() => setCompareIds([])} className="btn-ghost text-xs">
              Clear
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No decisions found"
          description={search ? `No results for "${search}"` : 'Start your first analysis to see it here.'}
          action={
            !search ? (
              <button onClick={() => navigate('/app/new')} className="btn-primary">
                ✦ Analyze My First Decision
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => {
            const highCount = a.result.blindSpots.filter(b => b.severity === 'High').length;
            const maxSeverity = a.result.blindSpots.reduce((max, b) => {
              const order = { Low: 0, Medium: 1, High: 2 };
              return order[b.severity] > order[max] ? b.severity : max;
            }, 'Low' as 'Low' | 'Medium' | 'High');
            const isSelected = compareIds.includes(a.id);

            return (
              <div
                key={a.id}
                id={`analysis-card-${a.id}`}
                className={`p-4 rounded-xl border transition-all ${
                  isSelected ? 'border-accent/40 bg-accent/05' : 'border-white/06 bg-card/50 hover:border-accent/15'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCompare(a.id)}
                    aria-label={`Select "${a.title}" for comparison`}
                    className="mt-1 accent-accent"
                    disabled={!isSelected && compareIds.length >= 2}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="font-heading text-base text-ivory">{a.title}</h3>
                        <p className="text-xs text-muted mt-0.5">
                          {new Date(a.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} ·{' '}
                          {a.result.blindSpots.length} blind spots · {highCount} high severity
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <SeverityChip severity={maxSeverity} />
                        {a.result.mode === 'demo' && (
                          <span className="chip-medium text-xs">DEMO</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <button
                        id={`view-${a.id}`}
                        onClick={() => navigate(`/app/analysis/${a.id}`)}
                        className="btn-secondary text-xs py-1.5 px-3"
                      >
                        View Analysis
                      </button>
                      <button
                        onClick={() => handleExport(a)}
                        disabled={exporting === a.id}
                        className="btn-ghost text-xs"
                      >
                        {exporting === a.id ? 'Exporting…' : '⤓ PDF'}
                      </button>
                      {deleteConfirmId === a.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-critical">Delete permanently?</span>
                          <button
                            id={`confirm-delete-${a.id}`}
                            onClick={() => handleDelete(a.id)}
                            className="text-xs text-critical hover:text-critical/80 font-medium"
                          >
                            Yes, delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-xs text-muted hover:text-ivory"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          id={`delete-${a.id}`}
                          onClick={() => setDeleteConfirmId(a.id)}
                          className="btn-ghost text-xs text-muted hover:text-critical"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
