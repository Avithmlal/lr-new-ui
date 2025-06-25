// React import not needed with automatic JSX runtime
import { getRoleDisplayName } from '../../utils/roleUtils';

export function RoleTag({ role, className = '' }) {
  if (!role) return null;

  const getRoleColor = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'ORGANIZATION_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ORGANIZATION_CREATOR':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ORGANIZATION_USER':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(role)} ${className}`}
      title={`Role: ${getRoleDisplayName(role)}`}
    >
      {getRoleDisplayName(role)}
    </span>
  );
}

export default RoleTag;