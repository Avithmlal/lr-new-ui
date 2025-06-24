import React from 'react';
import { Clock, FileText, Video, Mic, MessageSquare, ChevronRight } from 'lucide-react';

const activities = [
  {
    id: '1',
    type: 'course_created',
    title: 'Course "Advanced React Patterns" created',
    project: 'React Mastery',
    timestamp: '2h ago',
    icon: FileText,
    color: 'bg-blue-500',
  },
  {
    id: '2',
    type: 'video_generated',
    title: 'Avatar video for Module 3',
    project: 'JavaScript Fundamentals',
    timestamp: '4h ago',
    icon: Video,
    color: 'bg-purple-500',
  },
  {
    id: '3',
    type: 'audio_generated',
    title: 'Audio narration completed',
    project: 'Python Basics',
    timestamp: '6h ago',
    icon: Mic,
    color: 'bg-emerald-500',
  },
  {
    id: '4',
    type: 'chat_session',
    title: 'Billy chat session',
    project: 'Machine Learning Intro',
    timestamp: '1d ago',
    icon: MessageSquare,
    color: 'bg-orange-500',
  },
  {
    id: '5',
    type: 'course_created',
    title: 'Course outline generated',
    project: 'Web Development',
    timestamp: '2d ago',
    icon: FileText,
    color: 'bg-teal-500',
  },
];

export function RecentActivity() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center group">
            View All
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="p-3 hover:bg-gray-50 transition-colors cursor-pointer group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity.color} group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                <activity.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {activity.title}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-600 truncate">{activity.project}</p>
                  <div className="flex items-center text-xs text-gray-400 ml-2 flex-shrink-0">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.timestamp}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}