import React from 'react';
import { Plus } from 'lucide-react';

const EmptyState = ({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon: Icon 
}) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
        {Icon ? <Icon className="w-full h-full" /> : <Plus className="w-full h-full" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;