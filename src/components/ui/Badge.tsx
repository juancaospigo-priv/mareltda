import type { ReactNode } from 'react';

type Tone = 'navy' | 'cyan' | 'accent' | 'success' | 'warning' | 'error' | 'gray' | 'purple';

const tones: Record<Tone, string> = {
  navy: 'bg-navy-100 text-navy-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  accent: 'bg-accent-100 text-accent-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-600',
  error: 'bg-error-100 text-error-700',
  gray: 'bg-gray-100 text-gray-600',
  purple: 'bg-indigo-100 text-indigo-700',
};

export function Badge({ children, tone = 'gray', dot = false }: { children: ReactNode; tone?: Tone; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${tones[tone]}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
