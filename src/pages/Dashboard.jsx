import React, { useEffect } from 'react';
import { FolderOpen, GraduationCap, MessageSquare, Zap, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { WelcomeBanner } from '../components/Guidance/WelcomeBanner';
import { HintTooltip } from '../components/Guidance/HintTooltip';
import { useApp } from '../contexts/AppContext';
import { useGuidance } from '../hooks/useGuidance';
import { HINTS } from '../constants/hints';

export function Dashboard() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const { showWelcomeBanner, showTooltips, dismissWelcomeBanner, markStepCompleted } = useGuidance();

  useEffect(() => {
    // Initialize with sample data
    if (state.projects.length === 0) {
      const sampleProjects = [
        {
          id: '1',
          title: 'React Mastery Course',
          description: 'Advanced React patterns and best practices for modern web development.',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
          mediaAssets: [
            {
              id: '1',
              projectId: '1',
              type: 'document',
              title: 'React Hooks Guide',
              content: 'Comprehensive guide to React hooks...',
              metadata: { size: 1024, tags: ['react', 'hooks'] },
              createdAt: new Date(),
            },
          ],
          courses: [],
          isShared: true,
          collaborators: ['jane@example.com'],
        },
        {
          id: '2',
          title: 'JavaScript Fundamentals',
          description: 'Core JavaScript concepts for beginners to intermediate developers.',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-18'),
          mediaAssets: [],
          courses: [],
          isShared: false,
          collaborators: [],
        },
      ];

      dispatch({ type: 'SET_PROJECTS', payload: sampleProjects });
    }
  }, [state.projects.length, dispatch]);

  const totalProjects = state.projects.length;
  const totalCourses = state.projects.reduce((acc, project) => acc + project.courses.length, 0);
  const totalAssets = state.projects.reduce((acc, project) => acc + project.mediaAssets.length, 0);
  const totalVideos = state.videos?.length || 0;

  const handleQuickAction = (action) => {
    markStepCompleted(`quick_action_${action}`);
    switch (action) {
      case 'create_project':
        navigate('/projects');
        break;
      case 'billy_chat':
        navigate('/chat');
        break;
      case 'generate_course':
        navigate('/courses');
        break;
      case 'create_video':
        navigate('/videos');
        break;
    }
  };

  const handleStatsCardClick = (section) => {
    navigate(`/${section}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your projects.</p>
      </div>

      {showWelcomeBanner && (
        <WelcomeBanner onDismiss={dismissWelcomeBanner} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HintTooltip hint="Your active projects where you store documents, conversations, and generate content" position="bottom">
          <div>
            <StatsCard
              title="Active Projects"
              value={totalProjects}
              change="+2 this week"
              changeType="positive"
              icon={FolderOpen}
              color="bg-blue-500"
              onClick={() => handleStatsCardClick('projects')}
            />
          </div>
        </HintTooltip>
        
        <HintTooltip hint="Structured courses automatically generated from your project content" position="bottom">
          <div>
            <StatsCard
              title="Courses Created"
              value={totalCourses}
              change="+1 this week"
              changeType="positive"
              icon={GraduationCap}
              color="bg-green-500"
              onClick={() => handleStatsCardClick('courses')}
            />
          </div>
        </HintTooltip>

        <HintTooltip hint="AI-generated videos from your project content using avatars" position="bottom">
          <div>
            <StatsCard
              title="Videos Generated"
              value={totalVideos}
              change="+3 this week"
              changeType="positive"
              icon={Video}
              color="bg-purple-500"
              onClick={() => handleStatsCardClick('videos')}
            />
          </div>
        </HintTooltip>
        
        <HintTooltip hint="Documents, audio, video, and chat logs stored in your projects" position="bottom">
          <div>
            <StatsCard
              title="Media Assets"
              value={totalAssets}
              change="+5 this week"
              changeType="positive"
              icon={Zap}
              color="bg-orange-500"
            />
          </div>
        </HintTooltip>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600 mt-1">Get started with these common tasks</p>
          </div>
          <div className="p-4 space-y-3">
            <HintTooltip hint={HINTS.CREATE_PROJECT} position="left">
              <button 
                onClick={() => handleQuickAction('create_project')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Create New Project</p>
                    <p className="text-sm text-gray-600">Start a new knowledge capture project</p>
                  </div>
                </div>
              </button>
            </HintTooltip>
            
            <HintTooltip hint={HINTS.BILLY_CHAT} position="left">
              <button 
                onClick={() => handleQuickAction('billy_chat')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Chat with Billy</p>
                    <p className="text-sm text-gray-600">Get help with content creation</p>
                  </div>
                </div>
              </button>
            </HintTooltip>
            
            <HintTooltip hint={HINTS.GENERATE_COURSE} position="left">
              <button 
                onClick={() => handleQuickAction('generate_course')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Generate Course</p>
                    <p className="text-sm text-gray-600">Turn your content into a structured course</p>
                  </div>
                </div>
              </button>
            </HintTooltip>

            <HintTooltip hint="Create AI-generated videos from your project content" position="left">
              <button 
                onClick={() => handleQuickAction('create_video')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Video className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Create Video</p>
                    <p className="text-sm text-gray-600">Generate AI videos with avatars</p>
                  </div>
                </div>
              </button>
            </HintTooltip>
          </div>
        </div>
      </div>
    </div>
  );
}