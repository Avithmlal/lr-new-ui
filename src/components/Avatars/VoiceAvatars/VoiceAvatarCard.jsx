import { useState, useRef } from 'react';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy, 
  Star, 
  StarOff,
  Play,
  Pause,
  Volume2
} from 'lucide-react';
import { updateMyVoiceById, deleteMyVoiceById } from '../../../api/voiceService';
import StatusBadge from '../Common/StatusBadge';

const VoiceAvatarCard = ({ voice, onUpdate, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleSetDefault = async () => {
    try {
      setLoading(true);
      const updatedVoice = await updateMyVoiceById(voice._id, {
        isDefault: !voice.isDefault
      });
      onUpdate(updatedVoice.data);
      setShowDropdown(false);
    } catch (error) {
      console.error('Failed to update default status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${voice.title}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteMyVoiceById(voice._id);
      onDelete(voice._id);
    } catch (error) {
      console.error('Failed to delete voice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (voice.blobUrl) {
      navigator.clipboard.writeText(voice.blobUrl);
      // TODO: Add toast notification
      console.log('Link copied to clipboard');
    }
    setShowDropdown(false);
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Pause any other playing audio
      const allAudio = document.querySelectorAll('audio');
      allAudio.forEach(audio => {
        if (audio !== audioRef.current) {
          audio.pause();
        }
      });

      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const audioSource = voice.blobUrl

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Voice Visual */}
      <div className="relative aspect-video bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
        {/* Audio Waveform Visual */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`bg-white rounded-full transition-all duration-300 ${
                isPlaying 
                  ? 'animate-pulse h-8 w-1' 
                  : `h-${Math.floor(Math.random() * 6) + 2} w-1`
              }`}
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <StatusBadge status={voice.status} />
        </div>

        {/* Default Badge */}
        {voice.isDefault && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Default
            </span>
          </div>
        )}

        {/* Play Button */}
        {audioSource && voice.status === 'COMPLETED' && (
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-200"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white fill-current" />
            ) : (
              <Play className="w-8 h-8 text-white fill-current" />
            )}
          </button>
        )}

        {/* Hidden Audio Element */}
        {audioSource && (
          <audio
            ref={audioRef}
            src={audioSource}
            onEnded={handleAudioEnded}
            className="hidden"
          />
        )}
      </div>

      {/* Voice Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 truncate flex-1 mr-2">
            {voice.title}
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
                    {voice.isDefault ? (
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
                  
                  {audioSource && (
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Copy className="w-4 h-4 mr-3" />
                      Copy Link
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

        {/* Voice Details */}
        <div className="text-sm text-gray-500 space-y-1">
          <div>Created: {new Date(voice.createdAt).toLocaleDateString()}</div>
          {voice.script && (
            <div className="truncate" title={voice.script}>
              Script: "{voice.script.substring(0, 50)}..."
            </div>
          )}
        </div>

        {/* Audio Controls */}
        {audioSource && voice.status === 'COMPLETED' && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={handlePlayPause}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Play Preview
                </>
              )}
            </button>
          </div>
        )}
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

export default VoiceAvatarCard;