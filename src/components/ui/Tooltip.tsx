import type { ReactNode } from 'react';
import { useState } from 'react';

export function Tooltip({ children, content }: { children: ReactNode; content: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-navy-900 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none shadow-lg">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-navy-900 rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
}
