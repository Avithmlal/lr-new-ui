import React from 'react';
import { Check, Settings, Play } from 'lucide-react';

export function AvatarCard({ avatar, isSelected, onSelect, onConfigure }) {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 overflow-hidden group hover:shadow-lg ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="relative aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={avatar.imageUrl}
          alt={avatar.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg">
            <Play className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        {avatar.isDefault && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow-sm">
              Default
            </span>
          </div>
        )}
        {isSelected && (
          <div className="absolute top-3 right-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{avatar.name}</h3>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Language</span>
            <span className="font-medium text-gray-900">{avatar.language}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Style</span>
            <span className="font-medium text-gray-900 capitalize">{avatar.style}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Gender</span>
            <span className="font-medium text-gray-900 capitalize">{avatar.gender}</span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onSelect}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isSelected
                ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-sm'
            }`}
          >
            {isSelected ? (
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 mr-2" />
                Selected
              </div>
            ) : (
              'Select Avatar'
            )}
          </button>
          <button
            onClick={onConfigure}
            className="px-4 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:shadow-sm"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}