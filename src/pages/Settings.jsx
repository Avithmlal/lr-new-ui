import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Mic, 
  Video, 
  Database,
  ChevronRight,
  Save,
  Check
} from 'lucide-react';

const settingSections = [
  {
    id: 'profile',
    title: 'Profile & Account',
    description: 'Manage your personal information and account preferences',
    icon: User,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure how and when you receive notifications',
    icon: Bell,
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    description: 'Control your privacy settings and security preferences',
    icon: Shield,
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize the look and feel of your workspace',
    icon: Palette,
  },
  {
    id: 'language',
    title: 'Language & Region',
    description: 'Set your language, timezone, and regional preferences',
    icon: Globe,
  },
  {
    id: 'audio',
    title: 'Audio Settings',
    description: 'Configure voice recording and playback preferences',
    icon: Mic,
  },
  {
    id: 'video',
    title: 'Video & Avatar',
    description: 'Manage video generation and avatar preferences',
    icon: Video,
  },
  {
    id: 'data',
    title: 'Data & Storage',
    description: 'Manage your data, exports, and storage settings',
    icon: Database,
  },
];

export function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile settings
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Knowledge creator and educator',
    timezone: 'America/New_York',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    courseGeneration: true,
    systemMessages: true,
    
    // Privacy settings
    profileVisibility: 'private',
    dataSharing: false,
    analyticsOptIn: true,
    
    // Appearance settings
    theme: 'light',
    density: 'comfortable',
    animations: true,
    
    // Language settings
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    
    // Audio settings
    defaultVoice: 'natural',
    audioQuality: 'high',
    autoTranscribe: true,
    
    // Video settings
    defaultAvatar: 'professional',
    videoQuality: 'hd',
    autoGenerate: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Simulate save
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderSettingContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => handleSettingChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={settings.bio}
                    onChange={(e) => handleSettingChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                  { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' },
                  { key: 'projectUpdates', label: 'Project Updates', description: 'Get notified when projects are updated' },
                  { key: 'courseGeneration', label: 'Course Generation', description: 'Notifications for course generation status' },
                  { key: 'systemMessages', label: 'System Messages', description: 'Important system announcements' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[item.key]}
                        onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['light', 'dark'].map((theme) => (
                      <div
                        key={theme}
                        onClick={() => handleSettingChange('theme', theme)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          settings.theme === theme
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-full h-16 rounded mb-2 ${
                          theme === 'light' ? 'bg-white border' : 'bg-gray-800'
                        }`}></div>
                        <p className="text-sm font-medium text-gray-900 capitalize">{theme}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Interface Density</label>
                  <select
                    value={settings.density}
                    onChange={(e) => handleSettingChange('density', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                    <option value="spacious">Spacious</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Animations</p>
                    <p className="text-sm text-gray-600">Enable smooth transitions and animations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.animations}
                      onChange={(e) => handleSettingChange('animations', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Voice</label>
                  <select
                    value={settings.defaultVoice}
                    onChange={(e) => handleSettingChange('defaultVoice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="natural">Natural (Default)</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="energetic">Energetic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Audio Quality</label>
                  <select
                    value={settings.audioQuality}
                    onChange={(e) => handleSettingChange('audioQuality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="standard">Standard</option>
                    <option value="high">High</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Auto-Transcribe</p>
                    <p className="text-sm text-gray-600">Automatically transcribe voice recordings</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoTranscribe}
                      onChange={(e) => handleSettingChange('autoTranscribe', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">This settings section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and application settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <nav className="space-y-1 p-2">
              {settingSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 text-left rounded-lg transition-all duration-200 group ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center min-w-0">
                    <section.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        activeSection === section.id
                          ? 'text-blue-700'
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{section.title}</p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      activeSection === section.id ? 'rotate-90' : ''
                    }`}
                  />
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {settingSections.find(s => s.id === activeSection)?.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {settingSections.find(s => s.id === activeSection)?.description}
                  </p>
                </div>
                <button
                  onClick={handleSave}
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    saved
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {renderSettingContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}