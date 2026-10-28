import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-1.5 max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2 px-3 py-2 rounded shadow-lg text-[13px] font-medium text-white transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            t.type === 'success'
              ? 'bg-[#00A859]'
              : t.type === 'error'
              ? 'bg-red-600'
              : 'bg-[#0f172a]'
          }`}
        >
          {t.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />}
          {t.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-white" />}
          {t.type === 'info' && <Info className="w-4 h-4 shrink-0 text-[#FFD54F]" />}
          <span className="flex-1 leading-snug">{t.message}</span>
        </div>
      ))}
    </div>
  );
};
