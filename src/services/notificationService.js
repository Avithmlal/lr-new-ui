// Simple notification service that uses the app context to show system messages
import { toast } from 'react-hot-toast';

class NotificationService {
  constructor() {
    // For backward compatibility with old UI
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.warning = this.warning.bind(this);
    this.info = this.info.bind(this);
  }

  success({ message, description }) {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      // Dispatch custom event that can be caught by app context
      window.dispatchEvent(new CustomEvent('notification', {
        detail: {
          type: 'success',
          title: 'Success',
          message: description || message,
          timestamp: new Date(),
        }
      }));
    }
    
    // Also show toast for immediate feedback
    if (typeof toast !== 'undefined') {
      toast.success(description || message);
    } else {
      console.log('Success:', description || message);
    }
  }

  error({ message, description }) {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      // Dispatch custom event that can be caught by app context
      window.dispatchEvent(new CustomEvent('notification', {
        detail: {
          type: 'error',
          title: 'Error',
          message: description || message,
          timestamp: new Date(),
        }
      }));
    }
    
    // Also show toast for immediate feedback
    if (typeof toast !== 'undefined') {
      toast.error(description || message);
    } else {
      console.error('Error:', description || message);
    }
  }

  warning({ message, description }) {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('notification', {
        detail: {
          type: 'warning',
          title: 'Warning',
          message: description || message,
          timestamp: new Date(),
        }
      }));
    }
    
    if (typeof toast !== 'undefined') {
      toast.warning?.(description || message) || toast(description || message, { icon: '⚠️' });
    } else {
      console.warn('Warning:', description || message);
    }
  }

  info({ message, description }) {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('notification', {
        detail: {
          type: 'info',
          title: 'Info',
          message: description || message,
          timestamp: new Date(),
        }
      }));
    }
    
    if (typeof toast !== 'undefined') {
      toast(description || message, { icon: 'ℹ️' });
    } else {
      console.info('Info:', description || message);
    }
  }
}

// Create singleton instance
const NotificationInstance = new NotificationService();

export default NotificationInstance;

// Named exports for convenience
export { NotificationInstance };
export const notification = NotificationInstance;