import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AvatarCard } from '../components/Avatars/AvatarCard';
import { useApp } from '../contexts/AppContext';

export function Avatars() {
  const { state, dispatch } = useApp();
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);

  useEffect(() => {
    // Initialize with sample avatars
    if (state.avatars.length === 0) {
      const sampleAvatars = [
        {
          id: '1',
          name: 'Professional Sarah',
          imageUrl: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400',
          language: 'English',
          gender: 'female',
          style: 'professional',
          isDefault: true,
        },
        {
          id: '2',
          name: 'Friendly Mike',
          imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
          language: 'English',
          gender: 'male',
          style: 'friendly',
          isDefault: false,
        },
        {
          id: '3',
          name: 'Casual Emma',
          imageUrl: 'https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=400',
          language: 'English',
          gender: 'female',
          style: 'casual',
          isDefault: false,
        },
        {
          id: '4',
          name: 'Expert David',
          imageUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
          language: 'English',
          gender: 'male',
          style: 'professional',
          isDefault: false,
        },
      ];

      dispatch({ type: 'SET_AVATARS', payload: sampleAvatars });
      setSelectedAvatarId('1');
    }
  }, [state.avatars.length, dispatch]);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatarId(avatar.id);
    dispatch({ type: 'SELECT_AVATAR', payload: avatar });
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Avatar Selected',
        message: `${avatar.name} is now your active avatar for video generation.`,
        timestamp: new Date(),
        isRead: false,
      }
    });
  };

  const handleAvatarConfigure = (avatar) => {
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'info',
        title: 'Avatar Configuration',
        message: `Opening configuration panel for ${avatar.name}...`,
        timestamp: new Date(),
        isRead: false,
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avatar Management</h1>
          <p className="text-gray-600 mt-1">Choose and configure your AI avatars for video generation</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Avatar
        </button>
      </div>

      {state.selectedAvatar && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <img
              src={state.selectedAvatar.imageUrl}
              alt={state.selectedAvatar.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium text-blue-900">
                <span className="text-blue-600">Active Avatar:</span> {state.selectedAvatar.name}
              </p>
              <p className="text-sm text-blue-700">
                This avatar will be used for all new video generations
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {state.avatars.map((avatar) => (
          <AvatarCard
            key={avatar.id}
            avatar={avatar}
            isSelected={selectedAvatarId === avatar.id}
            onSelect={() => handleAvatarSelect(avatar)}
            onConfigure={() => handleAvatarConfigure(avatar)}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Avatar Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎭</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Multiple Styles</h4>
            <p className="text-sm text-gray-600">Professional, casual, and friendly avatar styles to match your content tone</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🌍</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Multi-Language</h4>
            <p className="text-sm text-gray-600">Support for multiple languages with natural pronunciation and expressions</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎬</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">HD Quality</h4>
            <p className="text-sm text-gray-600">High-definition video output with realistic facial expressions and gestures</p>
          </div>
        </div>
      </div>
    </div>
  );
}