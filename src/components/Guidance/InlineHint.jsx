import React from 'react';
import { Info } from 'lucide-react';

export function InlineHint({ message, type = 'info', className = '' }) {
  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    tip: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
  };

  const iconColors = {
    info: 'text-blue-500',
    tip: 'text-green-500',
    warning: 'text-amber-500',
  };

  return (
    <div className={`flex items-start space-x-2 p-3 border rounded-lg ${typeStyles[type]} ${className}`}>
      <Info className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColors[type]}`} />
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  );
}