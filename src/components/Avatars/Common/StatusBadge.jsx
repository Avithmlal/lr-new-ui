import React from 'react';
import { Clock, CheckCircle, XCircle, Upload } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'Completed',
          className: 'bg-green-100 text-green-800 border-green-200',
        };
      case 'processing':
        return {
          icon: Clock,
          label: 'Processing',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };
      case 'failed':
        return {
          icon: XCircle,
          label: 'Failed',
          className: 'bg-red-100 text-red-800 border-red-200',
        };
      case 'created':
      case 'uploaded':
        return {
          icon: Upload,
          label: 'Uploaded',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      default:
        return {
          icon: Clock,
          label: status || 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

export default StatusBadge;