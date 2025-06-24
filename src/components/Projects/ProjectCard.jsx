import React from 'react';
import { Calendar, Users, FileText, GraduationCap, Share2, Lock } from 'lucide-react';

export function ProjectCard({ project, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-300 group hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 pr-2">
          {project.title}
        </h3>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {project.isShared ? (
            <div className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              <Share2 className="w-3 h-3 mr-1" />
              Shared
            </div>
          ) : (
            <div className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              <Lock className="w-3 h-3 mr-1" />
              Private
            </div>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{project.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors flex-shrink-0">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="font-medium">{project.mediaAssets.length}</p>
            <p className="text-xs truncate">Assets</p>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors flex-shrink-0">
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="min-w-0">
            <p className="font-medium">{project.courses.length}</p>
            <p className="text-xs truncate">Courses</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
        <div className="flex items-center min-w-0">
          <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
        </div>
        {project.collaborators.length > 0 && (
          <div className="flex items-center ml-2 flex-shrink-0">
            <Users className="w-3 h-3 mr-1" />
            <span>{project.collaborators.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}