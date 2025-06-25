import React from 'react';
import AvatarCollection from '../components/Avatars/AvatarCollection';

export function Avatars() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avatar Management</h1>
          <p className="text-gray-600 mt-1">Create and manage your custom video and voice avatars</p>
        </div>
      </div>

      <AvatarCollection />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Avatar Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎭</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Custom Video Avatars</h4>
            <p className="text-sm text-gray-600">Upload your own videos and create personalized video avatars with AI</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎙️</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Voice Cloning</h4>
            <p className="text-sm text-gray-600">Clone your voice with custom audio uploads and training scripts</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎬</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Professional Quality</h4>
            <p className="text-sm text-gray-600">High-definition output with multiple AI processing models</p>
          </div>
        </div>
      </div>
    </div>
  );
}