import React, { useState } from 'react';
import VideoAvatars from './VideoAvatars/VideoAvatars';
import VoiceAvatars from './VoiceAvatars/VoiceAvatars';

const AvatarCollection = () => {
  const [activeTab, setActiveTab] = useState('video');

  const tabs = [
    { id: 'video', label: 'Video Avatars', component: VideoAvatars },
    { id: 'voice', label: 'Voice Avatars', component: VoiceAvatars },
  ];

  const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;
  const ActiveComponent = activeComponent;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default AvatarCollection;