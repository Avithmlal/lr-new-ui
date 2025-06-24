import React, { useState } from 'react';
import { X, UserPlus, Mail, Send } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function InviteUserModal({ isOpen, onClose, plan }) {
  const { dispatch } = useApp();
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const emailList = emails.split(',').map(email => email.trim()).filter(email => email);
    
    if (emailList.length === 0) return;

    // Create enrollments for each invited user
    emailList.forEach((email, index) => {
      const enrollment = {
        id: Date.now().toString() + index,
        planId: plan.id,
        userId: `user-${Date.now()}-${index}`, // Mock user ID
        invitedBy: 'current-manager-id',
        invitedAt: new Date(),
        status: 'invited',
        overallProgress: 0,
        currentPhase: 'courses',
        courseProgress: [],
        pdfReviewProgress: [],
        assessmentProgress: [],
        criteriaEvaluation: [],
        knowledgeGaps: [],
        recommendations: [],
        enrolledAt: new Date(),
        lastActivityAt: new Date(),
        dueDate: dueDate ? new Date(dueDate) : undefined,
        notes: message || undefined
      };

      dispatch({ type: 'ADD_KNOWLEDGE_GATHER_ENROLLMENT', payload: enrollment });
    });

    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Invitations Sent',
        message: `Successfully sent ${emailList.length} invitation${emailList.length > 1 ? 's' : ''} for "${plan.title}".`,
        timestamp: new Date(),
        isRead: false,
      }
    });

    // Reset form
    setEmails('');
    setMessage('');
    setDueDate('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Invite Users</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-1">{plan.title}</h3>
            <p className="text-sm text-blue-800">Target Role: {plan.targetRole}</p>
            <p className="text-sm text-blue-800">Duration: {plan.estimatedDuration} hours</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Addresses
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email addresses separated by commas..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple email addresses with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a personal message to the invitation..."
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Invited users will receive an email notification</li>
              <li>• They can accept the invitation to enroll in the plan</li>
              <li>• You'll be notified when they start or complete the plan</li>
              <li>• You can track their progress in the enrollments tab</li>
            </ul>
          </div>
        </form>
        
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!emails.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 mr-2 inline" />
            Send Invitations
          </button>
        </div>
      </div>
    </div>
  );
}