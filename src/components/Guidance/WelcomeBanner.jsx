import React, { useState } from 'react';
import { X, Lightbulb, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function WelcomeBanner({ onDismiss }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Welcome to Leaproad! 🎉
            </h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Start by creating a <strong>Project</strong> – it's your workspace for uploading files, 
              talking to Billy, and generating courses or videos. Everything in Leaproad revolves around projects!
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/projects')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Create Your First Project
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Explore Billy Chat
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}