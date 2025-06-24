import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Mic, 
  Video, 
  Clock, 
  Target, 
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Send,
  Bot,
  User,
  MicOff,
  VideoOff,
  Settings,
  Brain,
  TrendingUp,
  Award,
  FileText
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function KnowledgeTransferAssessment() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [assessmentMode, setAssessmentMode] = useState('chat');
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions] = useState(10);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm Billy, and I'll be conducting your knowledge assessment today. I'll ask you questions about the concepts you've learned, and we'll have an interactive discussion. Are you ready to begin?",
      sender: 'billy',
      timestamp: new Date(),
      type: 'system'
    }
  ]);

  // Mock assessment data
  const assessment = {
    id: assessmentId || '1',
    title: 'Senior Developer Technical Assessment',
    packageTitle: 'Senior Developer Knowledge Transfer',
    competencyArea: 'System Architecture',
    difficulty: 'advanced',
    estimatedDuration: 45,
    billyPersonality: 'interviewer',
    adaptiveDifficulty: true,
    maxAttempts: 3,
    currentAttempt: 1,
    passingScore: 80,
    questions: [
      {
        id: 'q1',
        text: 'Can you explain the difference between controlled and uncontrolled components in React?',
        competencyArea: 'React Fundamentals',
        difficulty: 'medium',
        expectedKeywords: ['controlled', 'uncontrolled', 'state', 'props', 'ref']
      },
      {
        id: 'q2',
        text: 'How would you optimize the performance of a React application with a large list of items?',
        competencyArea: 'Performance Optimization',
        difficulty: 'hard',
        expectedKeywords: ['virtualization', 'memoization', 'useMemo', 'useCallback', 'React.memo']
      },
      {
        id: 'q3',
        text: 'Describe your approach to code review. What do you look for?',
        competencyArea: 'Code Quality',
        difficulty: 'medium',
        expectedKeywords: ['readability', 'performance', 'security', 'testing', 'standards']
      }
    ]
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (isActive && !isCompleted) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'response',
      metadata: {
        questionNumber: currentQuestion,
        competencyArea: assessment.questions[currentQuestion - 1]?.competencyArea
      }
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate Billy's response with scoring
    setTimeout(() => {
      const questionScore = Math.floor(Math.random() * 30) + 70; // 70-100 range
      const billyResponse = {
        id: (Date.now() + 1).toString(),
        text: getBillyResponse(inputText, currentQuestion, questionScore),
        sender: 'billy',
        timestamp: new Date(),
        type: currentQuestion < totalQuestions ? 'feedback' : 'system',
        metadata: {
          questionNumber: currentQuestion,
          score: questionScore,
          competencyArea: assessment.questions[currentQuestion - 1]?.competencyArea
        }
      };
      
      setMessages(prev => [...prev, billyResponse]);
      setCurrentScore(prev => prev + questionScore);
      
      if (currentQuestion < totalQuestions) {
        // Ask next question
        setTimeout(() => {
          const nextQuestion = {
            id: (Date.now() + 2).toString(),
            text: getNextQuestion(currentQuestion + 1),
            sender: 'billy',
            timestamp: new Date(),
            type: 'question',
            metadata: {
              questionNumber: currentQuestion + 1,
              competencyArea: assessment.questions[currentQuestion]?.competencyArea,
              difficulty: assessment.questions[currentQuestion]?.difficulty
            }
          };
          setMessages(prev => [...prev, nextQuestion]);
          setCurrentQuestion(prev => prev + 1);
        }, 2000);
      } else {
        // Complete assessment
        setTimeout(() => {
          completeAssessment();
        }, 2000);
      }
    }, 1500);
  };

  const getBillyResponse = (userResponse, questionNum, score) => {
    if (score >= 90) {
      return "Excellent answer! You demonstrate a deep understanding of this concept. " + 
             (questionNum < totalQuestions ? "Let's move on to the next question." : "");
    } else if (score >= 80) {
      return "Good response! You've covered the key points well. " + 
             (questionNum < totalQuestions ? "Let's continue with the next topic." : "");
    } else if (score >= 70) {
      return "That's a reasonable answer, though there are some additional considerations. " + 
             (questionNum < totalQuestions ? "Let's explore another area." : "");
    } else {
      return "I see your reasoning, but there are some important aspects we should discuss further. " + 
             (questionNum < totalQuestions ? "Let's move forward and see how you handle the next question." : "");
    }
  };

  const getNextQuestion = (questionNum) => {
    if (questionNum <= assessment.questions.length) {
      return assessment.questions[questionNum - 1].text;
    }
    return "Let's discuss a scenario-based question to test your practical application of these concepts...";
  };

  const completeAssessment = () => {
    const finalScore = Math.round(currentScore / totalQuestions);
    setIsCompleted(true);
    setIsActive(false);
    
    const completionMessage = {
      id: Date.now().toString(),
      text: `Assessment completed! Your final score is ${finalScore}%. ${
        finalScore >= assessment.passingScore 
          ? 'Congratulations, you have passed this assessment!' 
          : `You need ${assessment.passingScore}% to pass. You can retake this assessment.`
      }`,
      sender: 'billy',
      timestamp: new Date(),
      type: 'system',
      metadata: { score: finalScore }
    };
    
    setMessages(prev => [...prev, completionMessage]);
    
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: finalScore >= assessment.passingScore ? 'success' : 'warning',
        title: 'Assessment Completed',
        message: `Final score: ${finalScore}%. ${
          finalScore >= assessment.passingScore ? 'Passed!' : 'Retake available.'
        }`,
        timestamp: new Date(),
        isRead: false,
      }
    });
  };

  const startAssessment = () => {
    setIsActive(true);
    setSessionTime(0);
    
    // Add first question
    setTimeout(() => {
      const firstQuestion = {
        id: Date.now().toString(),
        text: assessment.questions[0].text,
        sender: 'billy',
        timestamp: new Date(),
        type: 'question',
        metadata: {
          questionNumber: 1,
          competencyArea: assessment.questions[0].competencyArea,
          difficulty: assessment.questions[0].difficulty
        }
      };
      setMessages(prev => [...prev, firstQuestion]);
    }, 1000);

    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'info',
        title: 'Assessment Started',
        message: `${assessment.title} has begun. Good luck!`,
        timestamp: new Date(),
        isRead: false,
      }
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'info',
          title: 'Recording Started',
          message: 'Voice recording is now active.',
          timestamp: new Date(),
          isRead: false,
        }
      });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'chat': return MessageSquare;
      case 'voice': return Mic;
      case 'video': return Video;
      default: return MessageSquare;
    }
  };

  if (!isActive && !isCompleted) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/knowledge-transfer')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
              <p className="text-gray-600">{assessment.packageTitle}</p>
            </div>
          </div>
        </div>

        {/* Assessment Setup */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Assessment Setup</h3>
          
          {/* Assessment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Competency Area</label>
                <p className="text-gray-900">{assessment.competencyArea}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Difficulty Level</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(assessment.difficulty)}`}>
                  {assessment.difficulty.toUpperCase()}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Billy Personality</label>
                <p className="text-gray-900 capitalize">{assessment.billyPersonality}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Estimated Duration</label>
                <p className="text-gray-900">{assessment.estimatedDuration} minutes</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Passing Score</label>
                <p className="text-gray-900">{assessment.passingScore}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Attempt</label>
                <p className="text-gray-900">{assessment.currentAttempt} of {assessment.maxAttempts}</p>
              </div>
            </div>
          </div>

          {/* Interaction Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose Interaction Mode</label>
            <div className="grid grid-cols-3 gap-3">
              {['chat', 'voice', 'video'].map((mode) => {
                const Icon = getModeIcon(mode);
                return (
                  <button
                    key={mode}
                    onClick={() => setAssessmentMode(mode)}
                    className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                      assessmentMode === mode
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-2 text-gray-600" />
                    <span className="text-sm font-medium capitalize">{mode}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assessment Features */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Assessment Features</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {assessment.adaptiveDifficulty && (
                <li className="flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  Adaptive difficulty - questions adjust based on your responses
                </li>
              )}
              <li className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Real-time knowledge gap analysis
              </li>
              <li className="flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Detailed competency scoring
              </li>
              <li className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Conversation recording for review
              </li>
            </ul>
          </div>

          {/* Start Button */}
          <div className="flex justify-center">
            <button
              onClick={startAssessment}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
            <p className="text-gray-600">
              {isCompleted ? 'Assessment Completed' : `Question ${currentQuestion} of ${totalQuestions}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>{formatTime(sessionTime)}</span>
          </div>
          {!isCompleted && (
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getDifficultyColor(assessment.difficulty)}`}>
              {assessment.difficulty.toUpperCase()}
            </span>
          )}
          {isCompleted && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4 mr-1" />
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {!isCompleted && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Assessment Progress</span>
            <span className="text-sm text-gray-600">{Math.round((currentQuestion / totalQuestions) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {isCompleted && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{Math.round(currentScore / totalQuestions)}%</p>
              <p className="text-sm text-gray-600">Final Score</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
              <p className="text-sm text-gray-600">Questions Answered</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{formatTime(sessionTime)}</p>
              <p className="text-sm text-gray-600">Time Taken</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{assessment.passingScore}%</p>
              <p className="text-sm text-gray-600">Passing Score</p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px] overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Billy - Interviewer Mode</h3>
                <p className="text-sm text-gray-600">
                  {isCompleted ? 'Assessment completed' : 'Conducting technical assessment'}
                </p>
              </div>
            </div>
            
            {assessmentMode === 'voice' && !isCompleted && (
              <button
                onClick={toggleRecording}
                className={`p-2 rounded-lg transition-colors ${
                  isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
            
            {assessmentMode === 'video' && !isCompleted && (
              <button className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                <Video className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-lg'
                    : 'bg-white text-gray-900 rounded-bl-lg border border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {message.sender === 'billy' && (
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    
                    {message.metadata && (
                      <div className="mt-2 space-y-1">
                        {message.metadata.competencyArea && (
                          <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {message.metadata.competencyArea}
                          </span>
                        )}
                        {message.metadata.score && (
                          <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded ml-1">
                            Score: {message.metadata.score}%
                          </span>
                        )}
                      </div>
                    )}
                    
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isCompleted && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Type your response..."
                  rows={2}
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => navigate('/knowledge-transfer')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Knowledge Transfer
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2 inline" />
                Retake Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}