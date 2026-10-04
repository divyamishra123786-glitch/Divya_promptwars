import { useState, type ReactNode } from 'react';
import type { Severity } from '../types';

interface SeverityChipProps {
  severity: Severity;
  label?: string;
}

export function SeverityChip({ severity, label }: SeverityChipProps) {
  const text = label ?? severity;
  return (
    <span className={`chip-${severity.toLowerCase()}`}>
      {text}
    </span>
  );
}

interface EclipseLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function EclipseLoader({ size = 'md', message }: EclipseLoaderProps) {
  const sizeClass = size === 'sm' ? 'eclipse-sm' : size === 'lg' ? 'eclipse-lg' : 'eclipse';
  return (
    <div className="flex flex-col items-center gap-4" role="status" aria-label={message ?? 'Loading'}>
      <div className={sizeClass} aria-hidden="true" />
      {message && (
        <p className="text-sm text-muted animate-pulse">{message}</p>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-6">
      {/* Half-covered eclipse */}
      <div className="relative">
        <div className="eclipse-lg" />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(to bottom, transparent 50%, #101214 50%)',
          }}
          aria-hidden="true"
        />
      </div>
      <div className="space-y-2 max-w-sm">
        <h3 className="font-heading text-lg text-ivory">{title}</h3>
        <p className="text-muted text-sm leading-relaxed">{description}</p>
      </div>
      {action}
    </div>
  );
}

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-lg border border-critical/30 bg-critical/10"
      role="alert"
      aria-live="polite"
    >
      <span className="text-critical mt-0.5 shrink-0">⚠</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ivory">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost text-xs shrink-0">
          Retry
        </button>
      )}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="p-5 rounded-xl border border-white/5 bg-card/50 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

interface DemoModeBannerProps {
  compact?: boolean;
}

export function DemoModeBanner({ compact = false }: DemoModeBannerProps) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-warning/15 text-warning border border-warning/25">
        <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
        DEMO MODE
      </span>
    );
  }

  return (
    <div className="px-4 py-3 rounded-lg border border-warning/25 bg-warning/10 flex items-start gap-3">
      <span className="text-warning shrink-0 text-sm">◐</span>
      <div>
        <p className="text-warning text-sm font-medium">Demo Mode — Sample Output</p>
        <p className="text-muted text-xs mt-0.5">
          This analysis is pre-generated sample data, not a live AI response. Add a{' '}
          <code className="text-warning/80 bg-warning/10 px-1 rounded">GEMINI_API_KEY</code> to enable live analysis.
        </p>
      </div>
    </div>
  );
}

interface ExpandablePanelProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: ReactNode;
}

export function ExpandablePanel({ title, children, defaultOpen = false, badge }: ExpandablePanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-white/06 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/03 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-heading text-sm font-medium text-ivory flex items-center gap-2">
          {title}
          {badge}
        </span>
        <span
          className="text-muted transition-transform duration-200 text-sm"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-white/05">
          {children}
        </div>
      )}
    </div>
  );
}
