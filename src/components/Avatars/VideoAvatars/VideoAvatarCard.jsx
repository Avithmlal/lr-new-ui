import React, { useState } from 'react';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy, 
  Star, 
  StarOff,
  Play,
  ExternalLink,
  Eye
} from 'lucide-react';
import { updateMyAvatarById, deleteMyAvatarById, getAvatarWithVideo } from '../../../api/avatarService';
import StatusBadge from '../Common/StatusBadge';

const VideoAvatarCard = ({ avatar, onUpdate, onDelete, onPreview }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSetDefault = async () => {
    try {
      setLoading(true);
      const updatedAvatar = await updateMyAvatarById(avatar._id, {
        isDefault: !avatar.isDefault
      });
      onUpdate(updatedAvatar.data);
      setShowDropdown(false);
    } catch (error) {
      console.error('Failed to update default status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${avatar.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteMyAvatarById(avatar._id);
      onDelete(avatar._id);
    } catch (error) {
      console.error('Failed to delete avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (avatar.sampleURL || avatar.blobName) {
      navigator.clipboard.writeText(avatar.sampleURL || avatar.blobName);
      // TODO: Add toast notification
      console.log('Link copied to clipboard');
    }
    setShowDropdown(false);
  };

  const handlePreview = async () => {
    if (onPreview) {
      onPreview(avatar);
    }
  };

  const handleExternalPreview = () => {
    if (avatar.sampleURL || avatar.blobName) {
      window.open(avatar.sampleURL || avatar.blobName, '_blank');
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 ${
      avatar.isDefault 
        ? 'ring-2 ring-yellow-400 ring-opacity-50 shadow-lg' 
        : ''
    }`}>
      {/* Avatar Thumbnail */}
      <div className="relative aspect-video bg-gray-100">
        {avatar.thumbnail ? (
          <img
            src={avatar.thumbnail}
            alt={avatar.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Play className="w-12 h-12" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <StatusBadge status={avatar.status} />
        </div>

        {/* Default Badge */}
        {avatar.isDefault && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 border border-yellow-300 shadow-lg">
              <Star className="w-3 h-3 mr-1 fill-current" />
              DEFAULT
            </span>
          </div>
        )}

        {/* Preview Button */}
        {avatar.status === 'COMPLETED' && (
          <button
            onClick={handlePreview}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200"
            title="Click to preview video"
          >
            <Eye className="w-8 h-8 text-white" />
          </button>
        )}
      </div>

      {/* Avatar Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 truncate flex-1 mr-2">
            {avatar.name}
          </h3>
          
          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={handleSetDefault}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    disabled={loading}
                  >
                    {avatar.isDefault ? (
                      <>
                        <StarOff className="w-4 h-4 mr-3" />
                        Remove as Default
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4 mr-3" />
                        Set as Default
                      </>
                    )}
                  </button>
                  
                  {avatar.status === 'COMPLETED' && (
                    <button
                      onClick={handlePreview}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4 mr-3" />
                      Preview Video
                    </button>
                  )}

                  {(avatar.sampleURL || avatar.blobName) && (
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Copy className="w-4 h-4 mr-3" />
                      Copy Link
                    </button>
                  )}

                  {(avatar.sampleURL || avatar.blobName) && (
                    <button
                      onClick={handleExternalPreview}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ExternalLink className="w-4 h-4 mr-3" />
                      Open in New Tab
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      // TODO: Implement edit functionality
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4 mr-3" />
                    Edit
                  </button>
                  
                  <hr className="my-1" />
                  
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4 mr-3" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Avatar Details */}
        <div className="text-sm text-gray-500 space-y-1">
          <div>Created: {new Date(avatar.createdAt).toLocaleDateString()}</div>
          {avatar.videoId && (
            <div className="truncate">Video ID: {avatar.videoId}</div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default VideoAvatarCard;