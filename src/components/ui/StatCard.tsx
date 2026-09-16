import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Users, Package, ShoppingCart, ArrowRightLeft, Clock, DollarSign } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone?: 'navy' | 'cyan' | 'accent' | 'success' | 'warning' | 'error';
  trend?: string;
  trendUp?: boolean;
  onClick?: () => void;
}

const toneStyles: Record<string, { bg: string; text: string }> = {
  navy: { bg: 'bg-navy-50', text: 'text-navy-600' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  accent: { bg: 'bg-accent-50', text: 'text-accent-600' },
  success: { bg: 'bg-success-50', text: 'text-success-600' },
  warning: { bg: 'bg-warning-50', text: 'text-warning-600' },
  error: { bg: 'bg-error-50', text: 'text-error-600' },
};

export function StatCard({ label, value, icon, tone = 'navy', trend, trendUp, onClick }: StatCardProps) {
  const styles = toneStyles[tone];
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 shadow-card p-4 ${onClick ? 'cursor-pointer hover:shadow-card-hover transition-shadow' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${styles.bg} ${styles.text}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-navy-800">{value}</p>
      {trend && (
        <div className="flex items-center gap-1 mt-1.5">
          {trendUp !== undefined && (trendUp ? <TrendingUp className="w-3.5 h-3.5 text-success-600" /> : <TrendingDown className="w-3.5 h-3.5 text-error-600" />)}
          <span className={`text-xs ${trendUp ? 'text-success-600' : 'text-error-600'}`}>{trend}</span>
        </div>
      )}
    </div>
  );
}

export { TrendingUp, TrendingDown, AlertTriangle, Users, Package, ShoppingCart, ArrowRightLeft, Clock, DollarSign };
