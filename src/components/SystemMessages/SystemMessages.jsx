import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function SystemMessages() {
  const { state, dispatch } = useApp();
  const recentMessages = state.systemMessages.filter(msg => !msg.isRead).slice(0, 3);

  useEffect(() => {
    // Auto-mark messages as read after 5 seconds
    const timer = setTimeout(() => {
      recentMessages.forEach(msg => {
        if (!msg.isRead) {
          dispatch({ type: 'MARK_MESSAGE_READ', payload: msg.id });
        }
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [recentMessages, dispatch]);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertCircle;
      default: return Info;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const handleClose = (messageId) => {
    dispatch({ type: 'MARK_MESSAGE_READ', payload: messageId });
  };

  if (recentMessages.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 space-y-3 z-50">
      {recentMessages.map((message, index) => {
        const Icon = getIcon(message.type);
        const colors = getColors(message.type);
        
        return (
          <div
            key={message.id}
            className={`max-w-sm p-4 rounded-xl border shadow-lg transition-all duration-500 transform ${colors}`}
            style={{
              animation: `slideIn 0.5s ease-out ${index * 100}ms both`
            }}
          >
            <div className="flex items-start">
              <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{message.title}</p>
                <p className="text-sm opacity-90 mt-1 leading-relaxed line-clamp-2">{message.message}</p>
              </div>
              <button
                onClick={() => handleClose(message.id)}
                className="ml-2 text-current opacity-60 hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-black hover:bg-opacity-10 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}