import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Wand2, 
  Edit3, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Minus, 
  Loader,
  Play,
  Settings,
  Download,
  Share2,
  Clock,
  Users,
  BookOpen,
  Target
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, dispatch } = useApp();
  
  const [currentStep, setCurrentStep] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [lessonPlan, setLessonPlan] = useState(null);

  // Find the course
  const course = state.projects
    .flatMap(project => project.courses.map(course => ({ ...course, projectId: project.id, projectTitle: project.title })))
    .find(c => c.id === courseId);

  const projectParam = searchParams.get('project');

  useEffect(() => {
    if (course && course.sections && course.sections.length > 0) {
      setCurrentStep('completed');
    }
  }, [course]);

  const defaultModuleOptions = [
    { id: 'hook', type: 'hook', label: 'Hook Statement', description: 'Engaging opening to capture attention', enabled: true },
    { id: 'example', type: 'example', label: 'Practical Example', description: 'Real-world example or case study', enabled: true },
    { id: 'result', type: 'result', label: 'Result Statement', description: 'Clear outcome or takeaway', enabled: true },
    { id: 'summary', type: 'summary', label: 'Summary', description: 'Key points recap', enabled: true },
    { id: 'exercise', type: 'exercise', label: 'Practice Exercise', description: 'Hands-on activity', enabled: false },
    { id: 'quiz', type: 'quiz', label: 'Knowledge Check', description: 'Quick assessment', enabled: false },
  ];

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Course not found</h2>
        <button
          onClick={() => navigate('/courses')}
          className="text-blue-600 hover:text-blue-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const handleGenerateLessonPlan = async () => {
    setCurrentStep('generating-plan');
    setIsGenerating(true);

    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'info',
        title: 'Generating Lesson Plan',
        message: 'Billy is analyzing your project content and creating a detailed lesson plan...',
        timestamp: new Date(),
        isRead: false,
      }
    });

    // Simulate lesson plan generation (3-5 seconds)
    setTimeout(() => {
      const generatedPlan = {
        title: course.title,
        objective: course.objective,
        sections: [
          {
            id: '1',
            title: 'Introduction and Fundamentals',
            description: 'Establish foundation and core concepts',
            modules: [
              {
                id: '1-1',
                title: 'Course Overview',
                description: 'Introduction to the course structure and learning objectives',
                options: [...defaultModuleOptions],
                selected: true,
              },
              {
                id: '1-2',
                title: 'Key Concepts',
                description: 'Essential terminology and foundational principles',
                options: [...defaultModuleOptions],
                selected: true,
              },
            ],
          },
          {
            id: '2',
            title: 'Core Principles',
            description: 'Deep dive into main subject matter',
            modules: [
              {
                id: '2-1',
                title: 'Essential Techniques',
                description: 'Primary methodologies and approaches',
                options: [...defaultModuleOptions],
                selected: true,
              },
              {
                id: '2-2',
                title: 'Best Practices',
                description: 'Industry standards and proven strategies',
                options: [...defaultModuleOptions],
                selected: true,
              },
              {
                id: '2-3',
                title: 'Common Pitfalls',
                description: 'Mistakes to avoid and troubleshooting',
                options: [...defaultModuleOptions],
                selected: true,
              },
            ],
          },
          {
            id: '3',
            title: 'Advanced Applications',
            description: 'Real-world implementation and mastery',
            modules: [
              {
                id: '3-1',
                title: 'Case Studies',
                description: 'Real-world examples and success stories',
                options: [...defaultModuleOptions.map(opt => ({ ...opt, enabled: opt.type === 'example' || opt.type === 'result' }))],
                selected: true,
              },
              {
                id: '3-2',
                title: 'Next Steps',
                description: 'Continuing your learning journey',
                options: [...defaultModuleOptions],
                selected: true,
              },
            ],
          },
        ],
      };

      setLessonPlan(generatedPlan);
      setExpandedSections(new Set(['1', '2', '3']));
      setIsGenerating(false);
      setCurrentStep('customizing');

      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'success',
          title: 'Lesson Plan Generated',
          message: `Created a structured plan with ${generatedPlan.sections.length} sections and ${generatedPlan.sections.reduce((acc, s) => acc + s.modules.length, 0)} modules.`,
          timestamp: new Date(),
          isRead: false,
        }
      });
    }, 4000);
  };

  const handleGenerateCourse = async () => {
    if (!lessonPlan) return;

    setCurrentStep('generating-content');
    setIsGenerating(true);

    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'info',
        title: 'Generating Course Content',
        message: 'Creating detailed course content based on your customized lesson plan...',
        timestamp: new Date(),
        isRead: false,
      }
    });

    // Simulate course generation (5-8 seconds)
    setTimeout(() => {
      const selectedModules = lessonPlan.sections.flatMap(section => 
        section.modules.filter(module => module.selected)
      );

      const courseSections = lessonPlan.sections.map(section => ({
        id: section.id,
        title: section.title,
        order: parseInt(section.id),
        modules: section.modules
          .filter(module => module.selected)
          .map((module, index) => ({
            id: module.id,
            title: module.title,
            content: generateModuleContent(module),
            order: index + 1,
          })),
      })).filter(section => section.modules.length > 0);

      const updatedCourse = {
        ...course,
        sections: courseSections,
        status: {
          status: 'completed',
          progress: 100,
          message: 'Course generated successfully',
          completedAt: new Date(),
        },
      };

      dispatch({
        type: 'UPDATE_PROJECT',
        payload: {
          ...state.projects.find(p => p.id === course.projectId),
          courses: state.projects.find(p => p.id === course.projectId).courses.map(c => 
            c.id === course.id ? updatedCourse : c
          ),
        }
      });

      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'success',
          title: 'Course Generated Successfully',
          message: `"${course.title}" has been created with ${courseSections.length} sections and ${selectedModules.length} modules.`,
          timestamp: new Date(),
          isRead: false,
        }
      });

      setIsGenerating(false);
      setCurrentStep('completed');
    }, 6000);
  };

  const generateModuleContent = (module) => {
    let content = `# ${module.title}\n\n${module.description}\n\n`;
    
    module.options.forEach(option => {
      if (option.enabled) {
        switch (option.type) {
          case 'hook':
            content += `## Hook\nImagine if you could master ${module.title.toLowerCase()} in just a few minutes...\n\n`;
            break;
          case 'example':
            content += `## Example\nLet's look at a practical example of ${module.title.toLowerCase()} in action...\n\n`;
            break;
          case 'result':
            content += `## Key Takeaway\nBy the end of this module, you'll be able to ${module.description.toLowerCase()}.\n\n`;
            break;
          case 'summary':
            content += `## Summary\nIn this module, we covered the essential aspects of ${module.title.toLowerCase()}...\n\n`;
            break;
          case 'exercise':
            content += `## Practice Exercise\nNow it's your turn to apply what you've learned...\n\n`;
            break;
          case 'quiz':
            content += `## Knowledge Check\nTest your understanding with these quick questions...\n\n`;
            break;
        }
      }
    });

    return content;
  };

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleModule = (sectionId, moduleId) => {
    if (!lessonPlan) return;
    
    setLessonPlan(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId
          ? {
              ...section,
              modules: section.modules.map(module =>
                module.id === moduleId
                  ? { ...module, selected: !module.selected }
                  : module
              )
            }
          : section
      )
    }));
  };

  const toggleModuleOption = (sectionId, moduleId, optionId) => {
    if (!lessonPlan) return;
    
    setLessonPlan(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId
          ? {
              ...section,
              modules: section.modules.map(module =>
                module.id === moduleId
                  ? {
                      ...module,
                      options: module.options.map(option =>
                        option.id === optionId
                          ? { ...option, enabled: !option.enabled }
                          : option
                      )
                    }
                  : module
              )
            }
          : section
      )
    }));
  };

  const handleBackToProject = () => {
    if (projectParam) {
      navigate(`/projects/${projectParam}`);
    } else {
      navigate('/courses');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Generate Your Course</h3>
              <p className="text-blue-800 mb-4">
                Billy will analyze your project content and create a structured lesson plan. This process may take several minutes.
              </p>
              <button
                onClick={handleGenerateLessonPlan}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Lesson Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Course Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">{course.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target Audience:</span>
                    <span className="font-medium">{course.targetAudience || 'General'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project:</span>
                    <span className="font-medium">{course.projectTitle}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Generation Process</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    Analyze project content
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    Generate lesson plan structure
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    Customize modules and content
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    Generate final course content
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'generating-plan':
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Lesson Plan</h3>
            <p className="text-gray-600 mb-4">Billy is analyzing your project content and creating a structured lesson plan...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
              <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-4">This may take several minutes depending on your content volume.</p>
          </div>
        );

      case 'customizing':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Customize Course Modules</h3>
                <p className="text-gray-600">Select which modules to include and customize their content options.</p>
              </div>
              <button
                onClick={handleGenerateCourse}
                disabled={!lessonPlan?.sections.some(s => s.modules.some(m => m.selected))}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 className="w-4 h-4 mr-2 inline" />
                Generate Course Content
              </button>
            </div>

            <div className="space-y-4">
              {lessonPlan?.sections.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg">
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">{section.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {section.modules.map((module) => (
                      <div key={module.id} className="border border-gray-200 rounded-lg">
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start space-x-3">
                              <button
                                onClick={() => toggleModule(section.id, module.id)}
                                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                  module.selected
                                    ? 'bg-purple-600 border-purple-600'
                                    : 'border-gray-300 hover:border-purple-400'
                                }`}
                              >
                                {module.selected && <Check className="w-3 h-3 text-white" />}
                              </button>
                              <div>
                                <h5 className="font-medium text-gray-900">{module.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                              </div>
                            </div>
                          </div>
                          
                          {module.selected && (
                            <div className="ml-8 space-y-2">
                              <p className="text-sm font-medium text-gray-700 mb-2">Content Options:</p>
                              <div className="grid grid-cols-2 gap-2">
                                {module.options.map((option) => (
                                  <label key={option.id} className="flex items-center space-x-2 text-sm">
                                    <input
                                      type="checkbox"
                                      checked={option.enabled}
                                      onChange={() => toggleModuleOption(section.id, module.id, option.id)}
                                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                    />
                                    <span className="text-gray-700">{option.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'generating-content':
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Course Content</h3>
            <p className="text-gray-600 mb-4">Creating detailed course content based on your customized lesson plan...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
              <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '80%' }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-4">This process may take several minutes to complete.</p>
          </div>
        );

      case 'completed':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-900">Course Generated Successfully!</h3>
              </div>
              <p className="text-green-800 mb-4">
                Your course has been created with {course.sections?.length || 0} sections and {course.sections?.reduce((acc, s) => acc + s.modules.length, 0) || 0} modules.
              </p>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Play className="w-4 h-4 mr-2 inline" />
                  Preview Course
                </button>
                <button className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Export Course
                </button>
              </div>
            </div>

            {course.sections && course.sections.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Course Content</h4>
                {course.sections.map((section) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h5 className="font-medium text-gray-900">{section.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{section.modules.length} modules</p>
                      </div>
                      {expandedSections.has(section.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedSections.has(section.id) && (
                      <div className="border-t border-gray-200 p-4 space-y-3">
                        {section.modules.map((module) => (
                          <div key={module.id} className="p-3 bg-gray-50 rounded-lg">
                            <h6 className="font-medium text-gray-900 mb-2">{module.title}</h6>
                            <div className="text-sm text-gray-600 prose prose-sm max-w-none">
                              {module.content.split('\n').slice(0, 3).join('\n')}...
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToProject}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-1">{course.objective}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
            course.status?.status === 'completed' 
              ? 'bg-green-100 text-green-800'
              : course.status?.status === 'generating'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {course.status?.status === 'completed' ? 'Ready' : 
             course.status?.status === 'generating' ? 'Generating' : 'Draft'}
          </span>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Course Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sections</p>
              <p className="text-2xl font-bold text-gray-900">{course.sections?.length || 0}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Modules</p>
              <p className="text-2xl font-bold text-gray-900">
                {course.sections?.reduce((acc, s) => acc + s.modules.length, 0) || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Language</p>
              <p className="text-lg font-bold text-gray-900">{course.language}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <p className="text-lg font-bold text-gray-900">{course.status?.progress || 0}%</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {renderStepContent()}
      </div>
    </div>
  );
}