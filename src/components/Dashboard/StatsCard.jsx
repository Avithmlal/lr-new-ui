import React from 'react';

export function StatsCard({ title, value, change, changeType, icon: Icon, color, onClick }) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-emerald-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const CardComponent = onClick ? 'button' : 'div';

  return (
    <CardComponent 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group ${
        onClick ? 'cursor-pointer hover:border-blue-300' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold text-gray-900 mb-2 transition-colors ${
            onClick ? 'group-hover:text-blue-600' : ''
          }`}>
            {value}
          </p>
          {change && (
            <div className="flex items-center">
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </CardComponent>
  );
}