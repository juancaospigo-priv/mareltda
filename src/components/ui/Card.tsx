import type { ReactNode } from 'react';

export function Card({ children, className = '', hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-card ${hover ? 'transition-shadow hover:shadow-card-hover' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon, action }: { title: string; subtitle?: string; icon?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between p-5 pb-3">
      <div className="flex items-center gap-3">
        {icon && <div className="text-cyan-600">{icon}</div>}
        <div>
          <h3 className="text-base font-semibold text-navy-800">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-5 pt-0 ${className}`}>{children}</div>;
}
